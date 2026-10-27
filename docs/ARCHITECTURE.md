# HyeTraq architecture

## Product goal

HyeTraq is an evidence-first Web3 research agent. A user asks a specific question, sets a maximum spend, and gets a plan that prefers bounded free data before considering paid data, inference, or browser services. A final report should distinguish sourced facts, analysis, gaps, and actual costs.

## Current implementation

- `frontend/`: React + Vite interface for entering a question, choosing scope, setting a cap, previewing the plan, and checking the live buy catalogue.
- `backend/src/server.js`: Express API entry point, basic security headers, JSON size limit, and CORS.
- `backend/src/routes/research.js`: validates the question and cap and returns a plan only. It does not fetch evidence or generate a completed report.
- `backend/src/routes/buy.js`: catalogue lookup and a deliberately disabled execution route.
- `docs/FEASIBILITY.md`: integration assumptions and what remains unverified.

## Intended execution flow

1. Validate and normalize the user's research question.
2. Generate a plan with free sources first and specific evidence needs.
3. Discover an appropriate service from the live buy catalogue.
4. Obtain the exact live quote for the intended request.
5. Check the quoted amount against the remaining user-approved cap.
6. Request explicit approval before the payment-bearing call.
7. Use the official local buy client/keychain model. Do not collect a user's private key or seed phrase in this web app.
8. Persist the response and settlement evidence. If the outcome is ambiguous, mark it `unknown` and do not automatically retry.
9. Produce a source-linked report and a spend ledger based only on verified records.

Steps 3–9 are design targets, not claims about the current code. Paid execution remains disabled until the real service contract and settlement receipt are verified end to end.

## Trust boundaries

- Browser: user input and presentation only; no wallet secrets.
- API: validation, plan generation, spend policy, report assembly, and sanitized logs.
- Local buy runner: intended place for the official client and its local wallet/keychain.
- External paid providers: untrusted input; validate schemas and preserve source/provenance metadata.
- Celo / ERC-8004: identity and settlement evidence must be linked to the real registered agent and actual transactions.
