# HyeTraq

**Research. Execute. Verify.**

HyeTraq is an evidence-first Web3 intelligence workspace designed to turn a research question into a transparent, reviewable research workflow. It helps users scope an investigation, inspect relevant on-chain and external data, evaluate sources, and assemble findings with citations and an execution trail. Where paid services materially improve an investigation, HyeTraq is designed to use the `buy` service-payment workflow with explicit user approval, bounded spending, and verifiable settlement evidence.

> **Project status: early-stage scaffold.** This repository contains a working foundation and product direction, not a production-ready autonomous research platform. Read [Current capabilities and limitations](#current-capabilities-and-limitations) before relying on it.

## Contents

- [Why HyeTraq](#why-hyetraq)
- [Product principles](#product-principles)
- [How it should work](#how-it-should-work)
- [Current capabilities and limitations](#current-capabilities-and-limitations)
- [Architecture](#architecture)
- [Security and privacy](#security-and-privacy)
- [Requirements](#requirements)
- [Local development](#local-development)
- [Environment configuration](#environment-configuration)
- [Testing and quality gates](#testing-and-quality-gates)
- [Payment safety](#payment-safety)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License and third-party services](#license-and-third-party-services)

## Why HyeTraq

Web3 research is fragmented across explorers, RPC endpoints, analytics platforms, project documentation, social sources, and AI tools. A confident-looking answer is not enough: users need to understand **where a claim came from, how it was produced, what it cost, and what remains uncertain**.

HyeTraq is intended to make that process inspectable. It is not a trading terminal, financial adviser, wallet custodian, or guarantee of the accuracy of third-party data.

## Product principles

1. **Evidence before confidence.** Material claims should link to sources, queries, blocks, transactions, or documents that a reviewer can inspect.
2. **Human control over money.** Paid operations require a clear quote, a user-approved maximum, and an explicit confirmation before execution.
3. **No invented activity.** A plan, catalogue result, mock response, or UI state is never represented as a completed paid call or verified transaction.
4. **Least privilege.** Components receive only the credentials, data, and permissions they need.
5. **Safe failure.** An ambiguous payment result is marked `unknown` or `needs_reconciliation`, not automatically retried.
6. **Transparent uncertainty.** Reports distinguish verified facts, source claims, model-generated interpretation, and unresolved questions.
7. **Secure by default.** No secrets in browser code, source control, logs, screenshots, reports, or prompts.
8. **Accessible and responsive.** The workspace should remain understandable on mobile, keyboard-only navigation, and assistive technologies.

## How it should work

The intended user journey is:

1. **Frame the question.** The user enters a research question and optionally defines chains, protocols, date ranges, source preferences, and exclusions.
2. **Create a plan.** HyeTraq proposes bounded research steps and identifies which can use free sources and which might require a paid service.
3. **Inspect the plan and cost.** The user sees the provider, requested operation, quoted cost, currency/token, maximum spend, and reason the paid service is needed.
4. **Approve execution.** No payment is sent merely because a plan exists. Paid execution is blocked until the quote and limits are validated and the user explicitly approves.
5. **Gather and verify evidence.** Results are stored with source metadata, retrieval time, relevant block/transaction identifiers where applicable, and provenance.
6. **Synthesize a report.** Claims are linked to evidence. Contradictions, missing data, and confidence limitations are called out rather than silently resolved.
7. **Review the activity trail.** The user can distinguish planned, running, completed, failed, and uncertain operations, including verified payment evidence where available.

## Current capabilities and limitations

The repository currently provides an early feasibility scaffold. Verify each capability in the code and test suite before treating it as complete.

| Area | Current status |
|---|---|
| Responsive research workspace | Initial UI scaffold |
| Research-plan API and bounded spend input | Initial implementation |
| `buy` catalogue connectivity | Runtime check exists; availability must be verified in the user's environment |
| Paid service execution | Intentionally disabled pending end-to-end validation |
| Payment receipt verification | Not implemented as a complete verified flow |
| Research report generation with evidence citations | Not implemented as a complete feature |
| Persistent user research history | Not implemented |
| Production authentication and authorization | Not implemented |
| ERC-8004 registration and verification | Identity status metadata only; actual registration is not implemented |
| Production deployment and operational controls | Not ready |

**Do not describe HyeTraq as production-ready or claim successful paid execution, verified receipts, persistent storage, authentication, or ERC-8004 registration unless those functions have been implemented and independently tested.** A successful catalogue request is not evidence of a paid call.

## Architecture

The current direction separates presentation, orchestration, and execution:

- **Frontend:** React + Vite. Presents the research workspace and sends requests to the backend. It must never contain wallet secrets or provider credentials.
- **Backend API:** Node.js + Express. Validates user input, exposes bounded research-plan and status endpoints, and coordinates trusted server/local-runner services.
- **Execution adapter:** Intended to integrate with the official `@celo/buy` workflow for service discovery, quote handling, paid calls, and settlement evidence. Keep the exact API contract behind a small adapter and verify it against the current official package and documentation.
- **Research data:** Prefer bounded free sources, such as supported SQD endpoints, when they answer the question adequately. Use paid providers only when needed and approved.
- **Identity:** ERC-8004 is a planned requirement. Do not confuse displaying identity metadata with on-chain registration or verification.
- **Persistence:** Not yet production-selected. Choose storage only after the execution and trust model is settled.

### Recommended trust boundary

For an early demonstration, prefer a local execution runner that uses the user's local wallet/keychain, with the web UI communicating with that runner through a narrowly scoped, authenticated interface. A hosted service must not collect or store users' raw private keys or seed phrases. A hosted execution model requires a reviewed non-custodial signing design before implementation.

## Security and privacy

HyeTraq handles research prompts and may eventually initiate paid service requests. Treat prompts, retrieved web content, wallet interactions, transaction data, and generated reports as potentially sensitive or adversarial.

- Never request, collect, or store seed phrases or raw private keys.
- Keep credentials server-side or in the approved local wallet/keychain; never expose them through `VITE_*` variables or frontend bundles.
- Validate and bound all user-controlled input, including query length, URLs, provider identifiers, chain identifiers, spend caps, and result sizes.
- Treat retrieved content as untrusted data, not as instructions for the agent.
- Do not allow model output or remote content to change spending limits, destination, provider, permissions, or execution policy.
- Require explicit approval for each paid operation or a clearly scoped, separately approved batch. Show the estimated total and enforce the cap at the execution boundary.
- Do not automatically retry a paid request when settlement is uncertain.
- Redact credentials, authorization headers, cookies, signing material, and sensitive prompt content from logs.
- Use HTTPS in deployed environments, secure cookie settings where cookies are used, restrictive CORS, rate limiting, and appropriate security headers.
- Avoid rendering untrusted HTML. Sanitize or render report content as safe Markdown.
- Apply retention limits and provide deletion/export controls before storing user research histories.
- Maintain an auditable activity record without recording secrets.

See [`docs/SECURITY.md`](docs/SECURITY.md) for the security baseline and [`AGENTS.md`](AGENTS.md) for mandatory implementation rules.

## Requirements

- Node.js `20.19.0+` or `22.12.0+` (Vite 7 requirement; Node 21 is not supported)
- npm
- Git
- A modern browser

A wallet and paid-service credentials are **not** required to run the current scaffold. Do not configure real funds merely to explore the UI. Any future payment integration should be tested on a deliberate, low-value path only after its quote, approval, cap, and settlement behaviour has been reviewed.

## Local development

Use the Node version in `.nvmrc`, then install from the repository root and each workspace using the committed lockfiles:

```bash
npm ci
cd backend
npm ci
cd ../frontend
npm ci
cd ..
```

Create a backend-local environment file:

```bash
cp .env.example backend/.env
```

In PowerShell, use `Copy-Item .env.example backend/.env`; in Command Prompt, use `copy .env.example backend\.env`.

Review each variable and use non-production values. Never commit `backend/.env`.

Start the development processes:

```bash
npm run dev
```

Expected local addresses in the current scaffold:

- Frontend: `http://127.0.0.1:5173`
- API health: `http://127.0.0.1:5050/api/health`

Both development servers bind to loopback only. They are not intended to be exposed to a LAN or public network. If a command or port differs in the checked-out branch, trust the actual `package.json` and source configuration rather than this document.

## Environment configuration

Use `.env.example` as the canonical list of supported configuration names. The buy catalogue endpoint is fixed to the documented official gateway; it is not configurable through an arbitrary URL. Keep actual values in an ignored local environment file or a managed secret store.

Rules:

- Do not put secrets in the frontend environment. Variables prefixed with `VITE_` are bundled for client access and must be considered public.
- Do not use production credentials in development or CI.
- Do not print environment values during diagnostics.
- Fail closed when a required security-sensitive configuration is missing.
- Do not add real keys, tokens, passwords, seed phrases, wallet exports, or signed authorization payloads to sample files.
- If a secret may have been exposed, revoke or rotate it immediately and inspect logs and repository history.

## Testing and quality gates

Run the checks available in the repository:

```bash
npm run build
npm test
```

Before a pull request or demo, also verify:

- [ ] Frontend production build succeeds.
- [ ] Backend tests pass.
- [ ] Input validation rejects malformed and oversized requests.
- [ ] Spend caps are enforced by the execution boundary, not only the UI.
- [ ] Paid execution remains disabled if quote validation or receipt verification is incomplete.
- [ ] No secrets are present in the diff, build output, logs, screenshots, or Git history.
- [ ] UI works at mobile, tablet, and desktop widths.
- [ ] Keyboard navigation, visible focus, labels, contrast, and error states are checked.
- [ ] Documentation describes actual behaviour, not intended future behaviour.
- [ ] Any paid integration is tested with an explicit approval and a recorded, verifiable outcome.

CI passing is useful evidence, but it does not by itself establish security, production readiness, or hackathon eligibility.

## Payment safety

A paid request may incur a charge even if the client times out or receives an error after the provider has processed it. Therefore:

- Fetch and validate the current quote before approval.
- Show provider, operation, requested amount, currency/unit, maximum permitted amount, and relevant fees if available.
- Enforce the maximum immediately before the paid call.
- Use idempotency support if the official provider contract offers it; do not invent idempotency guarantees.
- Record a stable operation identifier and raw provider receipt metadata with secrets redacted.
- If settlement is ambiguous, mark it `unknown` and reconcile using provider evidence before any retry.
- Never fabricate a receipt or label a request as paid solely because the HTTP request returned successfully.
- Keep the paid executor disabled until the current contract, cap enforcement, approval flow, and settlement evidence have been tested end to end.

## Roadmap

### Foundation
- [x] Establish a separated frontend/backend scaffold.
- [x] Document security boundaries and feasibility gaps.
- [ ] Complete validation, error handling, and test coverage.

### Evidence-first research
- [ ] Implement a source adapter interface with bounded timeouts and result sizes.
- [ ] Preserve source URL/provider, retrieval timestamp, query parameters, chain/block/transaction identifiers where relevant, and content hashes where appropriate.
- [ ] Generate reports with claim-to-evidence links and an uncertainty section.
- [ ] Add persistence with explicit retention and deletion behaviour.

### Paid execution
- [ ] Verify the official `buy` client and current service schemas.
- [ ] Implement quote validation and user approval.
- [ ] Enforce spending caps at the trusted execution boundary.
- [ ] Verify provider receipts and handle ambiguous settlement safely.
- [ ] Keep paid operations unavailable until all above checks pass.

### Identity and release readiness
- [ ] Implement and verify ERC-8004 registration as required by the selected deployment and network.
- [ ] Add authentication, authorization, rate limiting, abuse controls, and operational monitoring.
- [ ] Complete threat modelling, dependency review, accessibility review, and deployment hardening.
- [ ] Publish honest demo evidence and a clear limitations statement.

## Contributing

Read [`AGENTS.md`](AGENTS.md) before using an AI coding agent or changing security-sensitive code. Read [`DESIGN.md`](DESIGN.md) before changing the interface. Follow [`CONTRIBUTING.md`](CONTRIBUTING.md), keep changes small and reviewable, and include tests for behaviour changes.

Never commit secrets, real wallet exports, private research data, or unredacted payment artifacts.

## License and third-party services

Check the repository's actual license before reusing or distributing code. HyeTraq may interact with third-party data and paid-service providers; each provider's terms, availability, data handling, and pricing apply. Do not imply endorsement or affiliation unless explicitly authorized. Product names and marks belong to their respective owners.
