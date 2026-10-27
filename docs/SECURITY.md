# Security and payment safety

- Never commit `.env`, wallet files, private keys, seed phrases, access tokens, or personal payment credentials.
- Never ask users to paste a private key or seed phrase into the app, repository, issue tracker, or chat.
- The intended buy integration uses the official local client/keychain flow. A hosted backend must not silently custody a user's wallet.
- Enforce a per-run cap and a total session cap on the server, not only in the browser.
- Compare the exact live quote with the remaining cap before payment. Reject missing, malformed, stale, or ambiguous quotes.
- Require clear user approval for each payment until a safe, explicit policy has been designed and reviewed.
- Do not automatically retry a request after a timeout if settlement may already have occurred.
- Treat provider content as untrusted. Sanitize logs and never render raw HTML from a provider.
- Keep a payment record separate from a provider response. A successful HTTP response alone is not payment evidence.
- Do not mark a payment `settled` unless the receipt or transaction evidence has been validated.
- Before deployment, add authentication, request rate limits, audit logs, origin restrictions, and abuse controls.
