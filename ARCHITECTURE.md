# PayPool — Architecture

## System Overview

PayPool has three layers: on-chain contracts (source of truth), an off-chain indexer (reads chain state into a fast queryable store), and a dashboard (reads the indexer, writes to chain via the user's wallet).

```
                     ┌─────────────────────────────────────────┐
                     │              EVM Chain (Base Sepolia)     │
                     │                                            │
                     │   SplitterFactory.sol                      │
                     │        │ deploys (EIP-1167 clone)          │
                     │        ▼                                   │
                     │   PayPool.sol (per-pool instance)          │
                     │        - receive() / depositERC20()        │
                     │        - release(payee, token)              │
                     │        - view functions                    │
                     └───────────────┬─────────────────────────┘
                                      │ emits events
                                      ▼
                     ┌─────────────────────────────────────────┐
                     │           Indexer (FastAPI + ARQ)         │
                     │   - polls eth_getLogs on an interval      │
                     │   - backfills from last-indexed block     │
                     │   - writes to Postgres, idempotently      │
                     └───────────────┬─────────────────────────┘
                                      │
                                      ▼
                     ┌─────────────────────────────────────────┐
                     │              Postgres                     │
                     │   pools · payees · deposits · withdrawals │
                     └───────────────┬─────────────────────────┘
                                      │ read-only queries
                                      ▼
                     ┌─────────────────────────────────────────┐
                     │           FastAPI REST API                │
                     └───────────────┬─────────────────────────┘
                                      │
                                      ▼
                     ┌─────────────────────────────────────────┐
                     │        React/Vite Dashboard                │
                     │   viem/wagmi for wallet + writes           │
                     │   REST API for reads                       │
                     └─────────────────────────────────────────┘
```

## Design principle: reads never touch the chain live

The dashboard never calls the RPC directly for data display — only for wallet transactions (create pool, release funds). All display data comes from the indexed Postgres store via the REST API. This keeps the UI fast and insulated from RPC rate limits, and makes the "last synced" staleness indicator meaningful (see NFR-4 in the requirements doc).

## Contract Architecture

```
SplitterFactory.sol
  ├── createPool(payees[], shares[], name) → deploys EIP-1167 minimal proxy
  ├── emits SplitterCreated(pool, creator, payees[], shares[])
  └── getAllPools() view

PayPool.sol (implementation, cloned per pool)
  ├── initialize(payees[], shares[])       // replaces constructor for clone pattern
  ├── receive() external payable            // ETH deposits
  ├── depositERC20(token, amount)           // ERC-20 deposits
  ├── release(payee, token)                 // pull withdrawal, callable by anyone
  ├── pendingPayment(payee, token) view
  ├── totalReceived(token) view
  └── getPayees() / getShares() view
```

**Why clones instead of a full deploy per pool:** a full contract deploy is expensive (~1M+ gas). EIP-1167 minimal proxies point to a single deployed implementation and cost ~50k gas to spin up a new pool. This matters both for real usability (cheap pool creation) and as a portfolio signal (shows gas-optimization awareness).

**Why pull payments instead of push:** push payments (looping over payees and sending funds on every deposit) are a classic reentrancy and gas-griefing vector — a single malicious or broken payee address can block payouts for everyone. Pull payments isolate each payee's withdrawal into its own transaction and its own failure domain.

## Off-chain Indexer Design

- Runs as an ARQ worker on a polling loop (interval configurable; websocket subscription is a valid upgrade if the RPC provider supports it)
- Tracks `last_indexed_block` in Postgres; on startup, backfills from that block to current chain head before resuming live polling
- Idempotency guaranteed via a unique constraint on `(tx_hash, log_index)` for every event row — safe to re-process a block range without double-counting
- Chain reorg handling: only indexes blocks with N confirmations behind head (configurable, default 5) to avoid indexing data that gets reorged out

## Data Model

```
pools
  address (PK), creator, name, total_shares, block_created, tx_hash

payees
  pool_address (FK), payee_address, shares

deposits
  id (PK), pool_address (FK), token, amount, from_address,
  tx_hash, log_index, block_number, timestamp
  UNIQUE (tx_hash, log_index)

withdrawals
  id (PK), pool_address (FK), payee_address, token, amount,
  tx_hash, log_index, block_number, timestamp
  UNIQUE (tx_hash, log_index)
```

## API Surface (FastAPI)

```
GET  /pools                       list all pools
GET  /pools/{address}             pool detail: payees, shares, balances
GET  /pools/{address}/deposits    deposit history
GET  /pools/{address}/withdrawals withdrawal history
GET  /payees/{address}/earnings   aggregate earnings across all pools
GET  /health                      last-indexed block vs chain head
```

## Chain Portability

All chain-specific config (RPC URL, chain ID, factory address, confirmation depth) lives in environment variables, not code. Moving from Base Sepolia to Base mainnet or another EVM chain is a config change, not a redeploy of the indexer or dashboard logic.

## Key Architectural Decisions (ADR-style summary)

| Decision | Choice | Rationale |
|---|---|---|
| Payment model | Pull, not push | Isolates failure domains, avoids reentrancy/griefing |
| Pool deploy pattern | EIP-1167 clones | ~20x cheaper pool creation than full deploys |
| Share mutability | Immutable per pool | Trust-minimization; no governance attack surface |
| Release caller | Permissionless (anyone can trigger, funds only go to payee) | Lets keepers/bots/friends trigger payouts without custody risk |
| Data source for UI | Indexed Postgres, never live RPC | Fast, rate-limit-safe, enables staleness indicators |
| Reorg handling | N-confirmation delay before indexing | Avoids indexing soon-to-be-orphaned blocks |