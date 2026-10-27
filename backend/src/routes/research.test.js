import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createApp } from "../server.js";

async function withServer(app, run) {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    return await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

test("creates a validated plan without claiming research execution", async () => {
  await withServer(createApp(), async (base) => {
    const response = await fetch(`${base}/api/research/plan`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question: "Review recent Celo DeFi activity",
        maxSpendUsd: 0.05,
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, "plan-only");
    assert.equal(body.focus, "celo");
    assert.equal(body.maxSpendUsd, 0.05);
    assert.match(
      body.notice,
      /does not execute payments or invent research results/,
    );
  });
});

test("rejects malformed values and unknown plan fields", async () => {
  await withServer(createApp(), async (base) => {
    const invalidBodies = [
      { question: "short", maxSpendUsd: 0 },
      { question: "A sufficiently long research question", maxSpendUsd: 5.01 },
      {
        question: "A sufficiently long research question",
        maxSpendUsd: 0,
        focus: "unknown",
      },
      {
        question: "A sufficiently long research question",
        maxSpendUsd: 0,
        privateKey: "must-not-be-accepted",
      },
    ];

    for (const body of invalidBodies) {
      const response = await fetch(`${base}/api/research/plan`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      assert.equal(response.status, 400);
    }
  });
});

test("returns safe client errors for malformed and oversized JSON", async () => {
  await withServer(createApp(), async (base) => {
    const malformed = await fetch(`${base}/api/research/plan`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error, "invalid_json");
    assert.ok(malformed.headers.get("x-request-id"));

    const oversized = await fetch(`${base}/api/research/plan`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: "x".repeat(70 * 1024), maxSpendUsd: 0 }),
    });
    assert.equal(oversized.status, 413);
    assert.equal((await oversized.json()).error, "request_too_large");
  });
});

test("paid execution remains disabled and identity is not claimed as verified", async () => {
  await withServer(createApp(), async (base) => {
    const payment = await fetch(`${base}/api/buy/execute`, { method: "POST" });
    assert.equal(payment.status, 501);
    assert.equal((await payment.json()).paidCallsEnabled, false);

    const identity = await fetch(`${base}/api/agent/identity`);
    const identityBody = await identity.json();
    assert.equal(identityBody.registered, false);
    assert.equal(identityBody.verificationStatus, "not-configured");
    assert.match(identityBody.note, /does not create or verify/i);
  });
});
