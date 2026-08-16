# PayPool — Build Plan

Phased so each milestone is independently demoable. Don't start a phase until the previous one's demo checkpoint works.

## Phase 0 — Project Scaffolding
- [x] Initialize monorepo structure: `contracts/`, `indexer/`, `dashboard/`, docs at root
- [x] Foundry project init in `contracts/`
- [x] FastAPI + ARQ project init in `indexer/`
- [x] Vite + React project init in `dashboard/`
- [x] Base Sepolia RPC access confirmed (Alchemy/Infura/public endpoint), test wallet funded from faucet
- **Demo checkpoint:** empty scaffolds run/build/test with no errors

## Phase 1 — Core Contract (single instance, no factory yet)
- [x] `PayPool.sol`: constructor takes payees[] + shares[], validates inputs (length match, no zero addresses, no duplicates, shares sum correctly, min 2 / max 20 payees)
- [x] `receive()` for ETH deposits, emits `PaymentReceived`
- [x] `depositERC20(token, amount)`, emits `PaymentReceived`
- [x] `release(payee, token)` pull withdrawal, emits `PaymentReleased`
- [x] View functions: `pendingPayment`, `totalReceived`, `getPayees`, `getShares`
- [x] Unit tests: happy path deposit + withdraw for both ETH and a mock ERC-20
- **Demo checkpoint:** deploy manually via script, send test ETH, call `release()`, confirm correct payout


## Phase 2 — Contract Hardening
- [x] `ReentrancyGuard` on `release()`
- [x] `SafeERC20` for all token transfers
- [x] Fuzz tests: share math invariant (`totalReceived == totalReleased + sum(pending)`) across randomized deposit/withdraw sequences
- [x] Edge case tests: zero deposits, single payee attempting >100% claim, repeated release calls, release with zero pending balance
- [x] Slither run, findings triaged and documented
- **Demo checkpoint:** full test suite green, fuzz run at high iteration count with no invariant break


## Phase 3 — Factory + Clone Pattern
- [x] `SplitterFactory.sol` using EIP-1167 minimal proxy (OpenZeppelin `Clones`)
- [x] `initialize()` replaces constructor logic in the implementation contract; confirm it's callable exactly once
- [x] `createPool()`, emits `SplitterCreated`
- [x] `getAllPools()` view
- [x] Gas comparison test: clone deploy cost vs full deploy cost (63% gas savings measured: 394k vs 1.06M gas)
- **Demo checkpoint:** deploy factory, create 3 pools via it, confirm each behaves identically to Phase 1's manual deploy


## Phase 4 — Testnet Deployment
- [x] Deployment script (Foundry `forge script`) parameterized by env vars (`DeployTestnet.s.sol`)
- [x] Deploy factory + implementation to Base Sepolia
- [x] Create at least 2 real pools with real testnet transactions (not just local anvil)
- [x] Record deployed addresses in `DESIGN.md` and `contracts/deployments.json`
- **Demo checkpoint:** verifiable contract on Base Sepolia block explorer, real transaction history to point to


## Phase 5 — Indexer
- [x] Postgres schema migration: `pools`, `payees`, `deposits`, `withdrawals` (`schema.sql` + SQLAlchemy `init_db`)
- [x] Event listener: poll `eth_getLogs` for factory + all known pool addresses (`indexer_service.py`)
- [x] Idempotent writes via `(tx_hash, log_index)` unique constraint
- [x] Backfill-on-startup logic
- [x] N-confirmation delay before committing events (`confirmation_depth`)
- [x] `/health` endpoint reporting sync status
- **Demo checkpoint:** indexer running against Phase 4's live testnet pools, Postgres reflects real deposit/withdrawal history within one poll interval


## Phase 6 — REST API
- [x] `GET /pools`, `GET /pools/{address}`, `GET /pools/{address}/deposits`, `GET /pools/{address}/withdrawals`
- [x] `GET /payees/{address}/earnings`
- [x] Basic response caching / pagination for pool lists
- **Demo checkpoint:** all endpoints return correct data via curl/Postman against the live indexed database


## Phase 7 — Dashboard Architecture & Dedicated Page Views
- [x] Reusable App Shell Architecture (Sidebar, Topbar with Search, Mobile Bottom Navigation Bar)
- [x] Wallet connect integration & Auth gating, wrong-network detection/prompt
- [x] Overview Dashboard (`/dashboard`): High-level stats, claimable balances, recent stream
- [x] Create Pool Form Modal → calls `createPool()` on-chain
- [x] Live Pools Directory (`/pools`): Searchable & filterable registry of all active revenue splitters
- [x] Pool Detail Workspace (`/pools/:address`): Interactive basis points pie chart, live deposit/withdrawal audit tables, QR code generator, and contract verification card
- [x] "My Earnings" Aggregate Portal (`/earnings`): Multi-pool claimable earnings view with 1-click batch release
- [x] Protocol Analytics Dashboard (`/analytics`): Volume flow charts, token breakdown, and EIP-1167 gas savings metrics
- [x] Notifications Center & Alerts Feed: Real-time event notifications for new deposits and claimable funds
- [x] User Profile & Settings Page (`/profile` & `/settings`): Wallet details, role preferences, network configuration, CSV data export
- [x] Public Deposit Gateway (`/pay/:address`): Lightweight payment page for non-logged-in donors/clients with QR code
- [x] Indexer staleness indicator using `/health` data
- **Demo checkpoint:** full user flow — connect wallet, switch pages via Sidebar/Mobile Bar, create pool, view analytics, release earnings, inspect notifications



## Phase 8 — Polish & Portfolio-Readiness
- [x] Record a short demo video/GIF for the README
- [x] Finalize all docs (`README.md`, `ARCHITECTURE.md`, `SECURITY.md`, `DESIGN.md`, `TODO.md`)
- [x] Gas report (63.1% EIP-1167 savings) + 26-test coverage report committed
- [x] Clean up deployment scripts so a stranger can redeploy from scratch following the README alone
- **Demo checkpoint:** a friend with no context can clone the repo and deploy their own pool in under 15 minutes using only the docs


## Stretch (post-v1, not required for portfolio completeness)
- [ ] Subgraph-based indexing as an alternative to the custom indexer
- [ ] Mainnet deployment
- [ ] Governance-based mutable splits (would need its own ADR)
- [ ] Multi-chain pool support