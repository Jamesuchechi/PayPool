# PayPool

Trustless, on-chain revenue splitting. Deploy a pool, define payees and shares, and let anyone send funds to it — each payee withdraws their exact proportional share at any time, with zero custodians and zero admin keys.

PayPool pairs a minimal, audited-pattern Solidity contract with a full off-chain indexer and dashboard, so "trustless" also means "understandable" — you don't need to read a block explorer to know what you're owed.

## Why

Splitting shared revenue (royalties, project income, grant funds, collaborator payouts) usually means either a spreadsheet and a trusted human holding the money, or a centralized platform taking a cut. PayPool removes both: the contract is the custodian, and the math is enforced by code, not policy.

## How it works

1. **Create a pool** — specify payee addresses and their share of the total (e.g. in basis points)
2. **Fund it** — anyone can send ETH or an ERC-20 token to the pool address
3. **Withdraw** — each payee (or anyone acting on their behalf) calls `release()` to pull their exact owed share

Every deposit and withdrawal is an on-chain event. The dashboard reads those events into a live view — pool balances, per-payee pending amounts, and full history.

## Stack

| Layer | Tech |
|---|---|
| Contracts | Solidity 0.8.24+, Foundry, OpenZeppelin |
| Indexer | Python, FastAPI, ARQ |
| Database | PostgreSQL |
| Frontend | React, Vite, viem/wagmi |
| Chain (testnet) | Base Sepolia |

## Project docs

- [`PRODUCT.md`](./PRODUCT.md) — what this is, who it's for, scope
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — system design, diagrams, key decisions
- [`DESIGN.md`](./DESIGN.md) — detailed contract interfaces, data model, API contracts
- [`SECURITY.md`](./SECURITY.md) — threat model, invariants, audit checklist
- [`TODO.md`](./TODO.md) — phased build plan
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — dev setup and conventions

## Quickstart

> Contracts, indexer, and frontend each have their own setup — full instructions land in `CONTRIBUTING.md` as each piece is built. This section will be filled in as the implementation phases in `TODO.md` complete.

```bash
# Contracts
cd contracts && forge install && forge test

# Indexer
cd indexer && pip install -r requirements.txt && arq worker.WorkerSettings

# Dashboard
cd dashboard && npm install && npm run dev
```

## Status

Early build — see [`TODO.md`](./TODO.md) for current phase.

## License

MIT