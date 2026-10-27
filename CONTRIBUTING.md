# Contributing to HyeTraq

1. Use Node.js `20.19.0+` or `22.12.0+` (see `.nvmrc`; Node 21 is not supported by Vite 7).
2. Install with `npm ci` at the root, then run `npm ci` inside `backend/` and `frontend/` so each lockfile is respected.
3. Copy `.env.example` to `backend/.env` for local API settings. Do not add real secrets to Git.
4. Run `npm test` and `npm run build` from the root before submitting changes.
5. Add tests for input validation, budget enforcement, provider failures, and payment state transitions.
6. Never claim a paid call succeeded without verifiable settlement evidence.

Keep changes focused and document whether each feature is implemented, mocked, or planned.
