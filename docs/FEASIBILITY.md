# Feasibility spike notes

Date: 2026-10-24

## Confirmed from current official materials

- The Agents on Open Rails page names **Build with buy** as the track for useful products that pay for services they do not own.
- The official `celo-org/buy-skill` repository documents `@celo/buy`, the live gateway catalogue at `https://gateway.usebuy.ai/v1/catalog`, quote-before-pay, and paid request execution.
- The current guide documents Chainstack Celo RPC and Cencori inference as partner paywalls with an indicative flat price of $0.01 per request; the exact HTTP 402 challenge is the authoritative price.
- The same guide warns that a paid request may settle before a timeout/error and says not to retry uncertain paid requests automatically.
- SQD endpoints at `/sqd/` are documented as free for bounded on-chain data queries. This supports a free-first research strategy.
- Hackathon rules require ERC-8004 identity. The official page says Build with buy entries should identify the services used and provide payment proof.

## Not yet verified in this runtime

- Live catalogue retrieval: the web research tool cannot fetch the gateway endpoint, and this runtime has no DNS/network access for direct HTTP checks. The app has a runtime check button for the user's environment.
- A real quote/payment/receipt cycle: no wallet was set up and no payment was attempted. This is intentional.
- Whether the selected paid capabilities are available and correctly priced at execution time.

## Decision

Keep paid execution disabled until a live quote can be parsed, the exact request can be bounded by a user-approved spend cap, and settlement evidence can be preserved without retrying uncertain payments. Do not ship a fake payment ledger or claim a paid call based only on docs.

## Key architecture question

The official client uses a local wallet/keychain. A conventional hosted web server should not take custody of a user's private key. For the first demo, prefer a local agent runner that owns the `buy` client and wallet locally, with the web UI calling that local runner. A hosted SaaS execution model needs a separate non-custodial signing design before implementation.
