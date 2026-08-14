# PayPool — Security

This document is a living threat model for PayPool. It exists both as an engineering discipline and as evidence, for anyone reviewing this project, that security was treated as a first-class requirement rather than an afterthought.

## Trust Assumptions

- **The RPC provider is trusted for liveness, not correctness** — the indexer trusts the RPC node to eventually deliver correct logs, but all displayed data is independently reconstructable from on-chain events by any third party.
- **The dashboard is trusted for nothing** — it is a convenience layer only. A payee can always verify their pending balance by calling `pendingPayment()` directly against the contract.
- **Pool creators are not trusted** — anyone can create a pool with any payee list; PayPool does not vet pools. A pool with a malicious or mistaken configuration only affects funds sent to that specific pool.

## Core Invariant

> At all times, for any token: `totalReceived[token] == totalReleased[token] + sum(pendingPayment(payee, token) for all payees)`

This is the property fuzz tests are built around (see `DESIGN.md` for test spec). If this invariant ever breaks, funds are either stuck or a payee can claim more than their share — both are critical severity.

## Threat Model

| Threat | Mitigation |
|---|---|
| Reentrancy on `release()` | Checks-effects-interactions ordering + OpenZeppelin `ReentrancyGuard` |
| Malicious ERC-20 (non-standard return values, fee-on-transfer) | `SafeERC20` for all token transfers; fee-on-transfer tokens explicitly documented as unsupported (accounting assumes received amount == sent amount) |
| Integer overflow/underflow in share math | Solidity 0.8+ built-in overflow checks; explicit fuzz tests on share arithmetic at boundary values |
| Griefing via one payee blocking payouts to others | Pull-payment pattern isolates each payee's withdrawal into an independent call |
| Unbounded loop / gas-limit DoS | Max payee count capped (20) at pool creation; no function iterates over an attacker-controlled-length array without a cap |
| Factory deploying a malicious implementation | Implementation address is immutable and set once at factory deployment; clones cannot point elsewhere |
| Front-running pool creation | Pool address is deterministic only if using `CREATE2` with attacker-predictable salt — using `CREATE` (sequential) for factory clones avoids this class of issue; documented explicitly in `DESIGN.md` |
| Chain reorgs causing indexer to show unconfirmed data as final | Indexer only commits events after N confirmations (default 5, configurable) |
| Indexer double-counting on restart/replay | Unique constraint on `(tx_hash, log_index)` per event table |
| Dust/rounding exploited to drain excess funds | Pull-payment formula (`totalReceived * share / totalShares - alreadyReleased`) mathematically cannot pay out more than `totalReceived`; excess dust remains claimable proportionally, never creates a shortfall |

## Out of Scope for v1 Threat Model

- Governance/voting attacks — no governance exists in v1 (immutable splits)
- Cross-chain bridge risk — no bridging functionality in v1
- Front-end supply chain (compromised npm dependency serving malicious JS) — standard web security practice applies but is not the focus of this document

## Pre-Deployment Checklist

- [ ] Full Foundry test suite passing, including fuzz tests on share math
- [ ] Invariant tests confirming the core invariant above under randomized deposit/withdrawal sequences
- [ ] Slither static analysis run, all findings triaged (documented, not just silenced)
- [ ] Manual review of `initialize()` — confirm it can only be called once (clone initialization front-running check)
- [ ] Manual review of ERC-20 interactions — confirm `SafeERC20` used everywhere, no raw `transfer`/`transferFrom`
- [ ] Confirm no `selfdestruct`, no `delegatecall` to non-trusted addresses
- [ ] Testnet deployment with real transactions (not just unit tests) before any mainnet claim
- [ ] Gas report reviewed — no function exceeds a reasonable gas ceiling under max payee count

## Disclosure

This is a portfolio project, not a production financial system holding real user funds at scale. That said — if you find a vulnerability, open a GitHub issue or reach out directly rather than exploiting it on a live deployment. No bug bounty program exists at this stage.