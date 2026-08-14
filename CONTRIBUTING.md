# Contributing to PayPool

This is currently a solo portfolio project, but it's structured to be contribution-ready. This doc is written as if it were open — that's intentional, since it doubles as proof of engineering discipline.

## Repo Structure

```
paypool/
├── contracts/       Foundry project — Solidity contracts + tests
├── indexer/         FastAPI + ARQ event indexer
├── dashboard/        React/Vite frontend
├── README.md
├── PRODUCT.md
├── ARCHITECTURE.md
├── DESIGN.md
├── SECURITY.md
├── TODO.md
└── CONTRIBUTING.md
```

## Dev Setup

### Contracts
```bash
cd contracts
forge install
forge build
forge test -vvv
```
Requires [Foundry](https://book.getfoundry.sh/getting-started/installation).

### Indexer
```bash
cd indexer
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in RPC_URL, DATABASE_URL, FACTORY_ADDRESS
alembic upgrade head    # run migrations
arq worker.WorkerSettings
```

### Dashboard
```bash
cd dashboard
npm install
cp .env.example .env    # fill in API_URL, CHAIN_ID
npm run dev
```

## Testing Requirements

- **Contracts:** every new function needs a happy-path test and at least one adversarial/edge-case test. Any change to share-calculation logic requires an updated fuzz test.
- **Indexer:** new event types need a test confirming idempotent re-processing (run the same block range twice, confirm no duplicate rows).
- **Dashboard:** no strict coverage requirement yet, but any wallet-interaction flow should be manually tested against a local anvil chain before merging.

## Commit / PR Conventions

- Conventional commits style: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`
- One logical change per PR — don't mix contract changes with dashboard changes unless they're tightly coupled (e.g. an ABI change requiring a frontend update)
- Any change touching `contracts/` must include updated/passing `forge test` output in the PR description
- Any change touching share-math or withdrawal logic must reference the core invariant in `SECURITY.md` and explain why it still holds

## Code Style

- **Solidity:** follow the [Solidity style guide](https://docs.soliditylang.org/en/latest/style-guide.html); run `forge fmt` before committing
- **Python:** `black` + `ruff`, type hints on all function signatures
- **TypeScript/React:** `prettier` + `eslint`, functional components only, no class components

## Reporting Issues

Open a GitHub issue with:
- What you expected vs what happened
- Steps to reproduce (chain/network, transaction hash if relevant)
- For contract bugs: whether it's a gas issue, a logic issue, or a security concern (security concerns — see `SECURITY.md`'s disclosure section before opening publicly)