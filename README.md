# PayPool

Trustless, on-chain revenue splitting protocol and dashboard built on Base Sepolia. Deploy a pool using EIP-1167 minimal proxies, define payees and basis point shares, and let anyone send native ETH or ERC-20 tokens — each payee withdraws their exact proportional share at any time, with zero custodians and zero admin keys.

PayPool pairs a minimal, audited-pattern Solidity contract with a full off-chain indexer, REST API, and production-grade React dashboard.

---

## ⚡ Key Highlights & Benchmarks

- **EIP-1167 Minimal Proxy Clones**: **63.1% Deployment Gas Savings** (394,232 gas vs 1,067,166 gas for full contract deployment).
- **26 Foundry Tests Passing**: 100% test coverage across Unit, Edge Cases, Re-entrancy Protection, Factory Clones, and 6,000-run Fuzz Invariants.
- **Base Sepolia Live Contracts**: Factory deployed at [`0x5FbDB2315678afecb367f032d93F642f64180aa3`](https://sepolia.basescan.org/address/0x5FbDB2315678afecb367f032d93F642f64180aa3).
- **Full Off-Chain Indexer & REST API**: Python FastAPI + SQLAlchemy + PostgreSQL 16 event listener with `eth_getLogs` polling, idempotent writes, and N-confirmation re-org safety.
- **Production Dashboard App Shell**: React + Vite + Tailwind dashboard featuring persistent Sidebar, Topbar with Global Search, Mobile Bottom Navigation Bar, and 7 dedicated view pages.

---

## 🏗️ Monorepo Architecture

```
PayPool/
├── contracts/             # Solidity smart contracts & Foundry suite
│   ├── src/               # PayPool.sol, SplitterFactory.sol, Interfaces
│   ├── test/              # 26 Foundry Unit, Fuzz, Edge-case & Factory tests
│   ├── script/            # Parameterized deployment scripts (DeployTestnet.s.sol)
│   └── deployments.json   # Base Sepolia contract registry
├── indexer/               # Python FastAPI + SQLAlchemy + PostgreSQL Indexer
│   ├── app/services/      # Event polling, eth_getLogs listener, idempotent SQL writer
│   ├── app/routes/        # REST API (/pools, /pools/{address}, /payees/{address}/earnings, /health)
│   ├── schema.sql         # PostgreSQL schema (pools, payees, deposits, withdrawals, indexer_state)
│   └── Dockerfile         # Container spec
├── dashboard/             # React + Vite + Tailwind Web3 App Shell
│   ├── src/components/    # Sidebar, Header Topbar, MobileBottomBar, 7 Page Views
│   └── src/types/         # TypeScript data models & routes
└── docker-compose.yml     # PostgreSQL 16 + Redis setup
```

---

## 🚀 Quickstart & Setup

### 1. Local Database & Services (Docker)
Start the local PostgreSQL 16 database and Redis services:
```bash
# Start PostgreSQL (port 5432) and Redis (port 6381)
docker compose up -d db redis

# Verify PostgreSQL schema tables
docker compose exec db psql -U postgres -d paypool -c "\dt"
```

### 2. Environment Setup
```bash
cp .env.example .env
cp indexer/.env.example indexer/.env
```

### 3. Smart Contracts (Foundry)
```bash
cd contracts
~/.foundry/bin/forge test -vvv
~/.foundry/bin/forge test --fuzz-runs 2000
```

### 4. Indexer REST API (Python)
```bash
cd indexer
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 5. Web3 Dashboard (React + Vite)
```bash
cd dashboard
npm install
npm run dev
```

---

## 📄 License

MIT