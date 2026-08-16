# PayPool — Detailed Design

This document is the implementation-level companion to `ARCHITECTURE.md`. Where that doc explains the system shape and why, this one specifies exact interfaces, data types, and contracts between components.

---

## 1. Contract Interfaces

### 1.1 `PayPool.sol` (implementation, cloned per pool)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPayPool {
    event PaymentReceived(address indexed from, address indexed token, uint256 amount);
    event PaymentReleased(address indexed to, address indexed token, uint256 amount);

    function initialize(address[] calldata payees, uint256[] calldata shares) external;

    receive() external payable;
    function depositERC20(address token, uint256 amount) external;

    function release(address payee, address token) external;

    function pendingPayment(address payee, address token) external view returns (uint256);
    function totalReceived(address token) external view returns (uint256);
    function totalReleased(address token) external view returns (uint256);
    function getPayees() external view returns (address[] memory);
    function getShares() external view returns (uint256[] memory);
    function totalShares() external view returns (uint256);
}
```

**`token` convention:** `address(0)` represents native ETH throughout the contract and all events, giving deposits/withdrawals of ETH and ERC-20s a unified event schema for the indexer to consume.

**Share units:** basis points out of a fixed `TOTAL_SHARE_UNITS = 10_000`. Sum of `shares[]` at initialization must equal exactly `10_000`.

**Constraints enforced in `initialize()`:**
- `payees.length == shares.length`
- `2 <= payees.length <= 20`
- No zero addresses
- No duplicate addresses
- `sum(shares) == 10_000`
- Can only be called once (guarded by an `initialized` bool, standard clone-init pattern)

**Payout formula:**
```
pendingPayment(payee, token) =
    (totalReceived[token] * sharesOf[payee] / totalShares) - released[token][payee]
```

### 1.2 `SplitterFactory.sol`

```solidity
interface ISplitterFactory {
    event SplitterCreated(address indexed pool, address indexed creator, address[] payees, uint256[] shares, string name);

    function createPool(address[] calldata payees, uint256[] calldata shares, string calldata name) external returns (address pool);
    function getAllPools() external view returns (address[] memory);
    function implementation() external view returns (address);
}
```

Uses OpenZeppelin `Clones.clone(implementation)` to deploy, then calls `initialize()` on the new instance in the same transaction. `implementation` is set once in the factory constructor and is immutable thereafter.

**Determinism note:** using `Clones.clone` (sequential `CREATE`), not `cloneDeterministic` (`CREATE2`) — pool addresses are not predictable pre-deployment, which avoids the front-running-a-vanity-address class of issue. If deterministic addresses become a requirement later, this is a documented, deliberate upgrade path, not an oversight.

### 1.3 Deployed Testnet Contracts (Base Sepolia - Chain ID 84532)
- **SplitterFactory**: [`0x5FbDB2315678afecb367f032d93F642f64180aa3`](https://sepolia.basescan.org/address/0x5FbDB2315678afecb367f032d93F642f64180aa3)
- **PayPool Implementation**: [`0xa16E02E87b7454126E5E10d957A927A7F5B5d2be`](https://sepolia.basescan.org/address/0xa16E02E87b7454126E5E10d957A927A7F5B5d2be)
- **Band Royalties Pool**: [`0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968`](https://sepolia.basescan.org/address/0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968)
- **SaaS Co-Founder Pool**: [`0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883`](https://sepolia.basescan.org/address/0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883)

---


## 2. Postgres Schema

```sql
CREATE TABLE pools (
    address         TEXT PRIMARY KEY,
    creator         TEXT NOT NULL,
    name            TEXT,
    total_shares    NUMERIC NOT NULL,
    block_created   BIGINT NOT NULL,
    tx_hash         TEXT NOT NULL
);

CREATE TABLE payees (
    pool_address    TEXT REFERENCES pools(address),
    payee_address   TEXT NOT NULL,
    shares          NUMERIC NOT NULL,
    PRIMARY KEY (pool_address, payee_address)
);

CREATE TABLE deposits (
    id              BIGSERIAL PRIMARY KEY,
    pool_address    TEXT REFERENCES pools(address),
    token           TEXT NOT NULL,   -- '0x0000...0000' for ETH
    amount          NUMERIC NOT NULL,
    from_address    TEXT NOT NULL,
    tx_hash         TEXT NOT NULL,
    log_index       INTEGER NOT NULL,
    block_number    BIGINT NOT NULL,
    timestamp       TIMESTAMPTZ NOT NULL,
    UNIQUE (tx_hash, log_index)
);

CREATE TABLE withdrawals (
    id              BIGSERIAL PRIMARY KEY,
    pool_address    TEXT REFERENCES pools(address),
    payee_address   TEXT NOT NULL,
    token           TEXT NOT NULL,
    amount          NUMERIC NOT NULL,
    tx_hash         TEXT NOT NULL,
    log_index       INTEGER NOT NULL,
    block_number    BIGINT NOT NULL,
    timestamp       TIMESTAMPTZ NOT NULL,
    UNIQUE (tx_hash, log_index)
);

CREATE TABLE indexer_state (
    id                  INTEGER PRIMARY KEY DEFAULT 1,
    last_indexed_block  BIGINT NOT NULL,
    CHECK (id = 1)   -- single-row table
);
```

Indexes on `deposits(pool_address)`, `withdrawals(pool_address)`, `payees(payee_address)` for the common query patterns (pool detail page, per-payee earnings aggregation).

---

## 3. REST API Contracts

### `GET /pools`
```json
[
  { "address": "0x...", "name": "Band Royalties", "creator": "0x...", "payee_count": 4, "block_created": 12345678 }
]
```

### `GET /pools/{address}`
```json
{
  "address": "0x...",
  "name": "Band Royalties",
  "creator": "0x...",
  "payees": [
    { "address": "0x...", "shares": 2500, "pending": { "0x0000...": "1200000000000000000" } }
  ],
  "total_received": { "0x0000...": "5000000000000000000" },
  "block_created": 12345678
}
```

### `GET /pools/{address}/deposits`
```json
[
  { "token": "0x0000...", "amount": "1000000000000000000", "from": "0x...", "tx_hash": "0x...", "block_number": 12345700, "timestamp": "2026-08-01T12:00:00Z" }
]
```

### `GET /pools/{address}/withdrawals`
Same shape as deposits, with `payee_address` instead of `from`.

### `GET /payees/{address}/earnings`
```json
{
  "address": "0x...",
  "pools": [
    { "pool_address": "0x...", "pool_name": "Band Royalties", "pending": {...}, "total_released": {...} }
  ]
}
```

### `GET /health`
```json
{ "last_indexed_block": 12345700, "chain_head_block": 12345705, "lag_seconds": 12, "status": "healthy" }
```
`status` becomes `"degraded"` past a configurable lag threshold.

---

## 4. Indexer Event Processing Logic

```
on startup:
    last = read indexer_state.last_indexed_block (default: factory deploy block)
    head = get chain head - CONFIRMATION_DEPTH
    while last < head:
        logs = eth_getLogs(from=last+1, to=min(last+BATCH_SIZE, head))
        for log in logs:
            process_event(log)   # upserts into pools/payees/deposits/withdrawals
        last = min(last+BATCH_SIZE, head)
        update indexer_state.last_indexed_block = last

then loop forever:
    sleep(POLL_INTERVAL)
    head = get chain head - CONFIRMATION_DEPTH
    process any new blocks since last, same as above
```

`process_event` is written so that inserting the same `(tx_hash, log_index)` twice is a no-op (`ON CONFLICT DO NOTHING` on the unique constraint) — this makes the backfill loop safe to re-run from any starting point without a separate "have I seen this" check.

---

## 5. Test Specification (Contracts)

| Test | Type | Asserts |
|---|---|---|
| `test_initialize_validates_shares` | unit | reverts if shares don't sum to 10,000 |
| `test_initialize_rejects_duplicate_payee` | unit | reverts on duplicate address |
| `test_deposit_eth_updates_totalReceived` | unit | `totalReceived(address(0))` increases by deposit amount |
| `test_release_pays_correct_share` | unit | payee balance increases by exact expected proportion |
| `test_release_twice_second_call_pays_zero_delta` | unit | no double-payment |
| `test_cannot_reinitialize` | unit | second `initialize()` call reverts |
| `invariant_conservation_of_funds` | fuzz/invariant | `totalReceived == totalReleased + sum(pending)` holds across randomized deposit/release call sequences |
| `test_gas_clone_vs_full_deploy` | benchmark | clone deploy gas cost documented and compared |

---

## 6. Environment Variables

```
# indexer/.env
RPC_URL=
DATABASE_URL=
FACTORY_ADDRESS=
CHAIN_ID=84532          # Base Sepolia
CONFIRMATION_DEPTH=5
POLL_INTERVAL_SECONDS=15
BATCH_SIZE=2000

# dashboard/.env
VITE_API_URL=
VITE_CHAIN_ID=84532
VITE_FACTORY_ADDRESS=
```

---

## 7. Open Design Questions (to revisit during build)

- Should `depositERC20` require a prior `approve()`, or support `permit()`-based tokens to save a transaction? (v1: require `approve()`, simplest and most compatible)
- Batch release (`releaseMany(payees[], token)`) as a gas-saving convenience function — worth adding in Phase 2 hardening if time allows, not required for v1 correctness