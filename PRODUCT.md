# PayPool — Product Overview

## What is PayPool?

PayPool is a protocol for deploying trustless, on-chain revenue-splitting contracts. Anyone can create a "pool" that defines a set of payees and their proportional share of any incoming funds (ETH or ERC-20 tokens). Once deployed, the pool runs autonomously — no admin, no custodian, no intermediary. Payees withdraw their earned share at any time, and every deposit and withdrawal is fully auditable on-chain.

A companion off-chain indexer and dashboard turn the raw on-chain activity into a readable, real-time view: who's owed what, how much has flowed through a pool, and a history of every transaction.

## Problem

Splitting revenue between multiple parties — collaborators, a band, a DAO treasury, open-source contributors, a royalty pool — is normally done manually (a spreadsheet plus a trusted party who moves the money) or via a centralized platform that takes a cut and can freeze or misallocate funds. Existing on-chain splitter implementations (e.g. OpenZeppelin's `PaymentSplitter`) solve the contract-level problem but stop there — they don't give non-technical payees a way to see or trust what they're owed without reading a block explorer.

## Who is this for

- **Primary persona:** a small group (2–20 people) who want to receive shared income (royalties, grant funds, project revenue) without appointing one person as the money-holder.
- **Portfolio context:** this is a demonstration project. The "user" for now is also anyone evaluating the codebase — recruiters, other engineers, potential collaborators — so the product must be legible end-to-end, not just functionally correct.

## Core value proposition

1. **Trustless** — funds are never custodied by a person; only the contract logic controls distribution.
2. **Transparent** — every payee can independently verify their share is calculated correctly, with no reliance on the dashboard being honest (the dashboard is a convenience layer, not a source of truth).
3. **Cheap to create** — factory + clone pattern means deploying a new pool costs a fraction of a full contract deployment.
4. **Legible** — the dashboard makes "trustless" also mean "understandable," which most raw smart-contract splitters fail to do.

## v1 Scope

**In scope:**
- Deploy a pool with a fixed, immutable list of payees and shares
- Accept ETH and any standard ERC-20 token as deposits
- Pull-based withdrawals, callable by anyone on behalf of any payee
- Public dashboard: create a pool, view any pool's activity, view "my earnings" across pools
- Single-chain deployment (Base Sepolia for testnet, portable to any EVM chain via config)

**Explicitly out of scope for v1** (documented as deliberate decisions, not gaps):
- Mutable share allocations / governance voting on splits — pools are immutable once deployed; this is a trust-minimization feature, not a missing feature
- Multi-chain / cross-chain pools in a single instance
- Non-token-standard assets (NFTs, exotic token types)
- Fiat on/off-ramp
- Fee-taking by the protocol itself (v1 is not monetized)

## Success criteria (for this being a strong portfolio piece)

- A stranger can read the README, understand the system in under 5 minutes, and deploy it themselves
- The contract has a fuzz-tested invariant proof of correctness (conservation of funds)
- The dashboard is usable by someone who has never used a block explorer
- The docs demonstrate the same rigor a team would expect before a real audit