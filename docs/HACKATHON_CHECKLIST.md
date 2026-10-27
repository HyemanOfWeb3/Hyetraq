# Agents on Open Rails — Build with buy checklist

This is a working checklist, not a claim that every requirement is already complete. Update each item only after collecting evidence.

## Required for a valid entry

- [ ] Register HyeTraq on Loops House before the deadline.
- [ ] Make the GitHub repository public and ensure it still resolves during judging.
- [ ] Register an ERC-8004 identity for the agent and add the registry link / Agent ID here: `TBD`.
- [ ] Confirm the entry's required Celo setup and any attribution instructions shown during registration. The hackathon page says x402 / buy transactions have special attribution handling; follow the current track instructions rather than assuming tags are supported.
- [ ] Keep secrets, seed phrases, and private keys out of source control, browser code, logs, screenshots, and submissions.
- [ ] Record the actual paid services used and attach evidence of successful settlement to the submission.

## Build with buy judging evidence

- [ ] State the real user and research task HyeTraq solves.
- [ ] Demonstrate a real workflow powered by one or more paid services that HyeTraq does not own.
- [ ] Capture the service name, request purpose, quoted price, final cost, timestamp, and payment / transaction evidence when available.
- [ ] Show that the spend cap is enforced before a paid request is sent.
- [ ] Handle ambiguous timeouts without automatically retrying a potentially settled payment.
- [ ] Show a useful report with source links and clearly separated facts, interpretation, and unknowns.
- [ ] Test with a small, explicitly approved budget. Do not use fabricated receipts or demo data as proof of payment.

## Current state of this package

- [x] React/Vite research workspace and Express API scaffold.
- [x] Research-plan endpoint with a bounded spend field.
- [x] Runtime catalogue-check endpoint (availability is only confirmed when it succeeds in the user's environment).
- [x] Paid execution endpoint safely disabled while the live quote and receipt flow is unverified.
- [x] Initial boundary tests.
- [ ] Full research execution and report persistence.
- [ ] Verified buy quote -> payment -> receipt workflow.
- [ ] Spend ledger backed by verified payment evidence.
- [ ] ERC-8004 identity registered and verified.
- [ ] Public repository, deployed demo, and completed Loops House submission.

Do not mark this project hackathon-ready until the unchecked implementation and submission items are completed and verified.
