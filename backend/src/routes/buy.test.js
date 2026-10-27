import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { once } from "node:events";
import { createBuyRouter } from "./buy.js";

async function withBuyServer(fetchImpl, run) {
  const app = express();
  app.use("/api/buy", createBuyRouter(fetchImpl));
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

test("fetches the fixed official catalogue URL and returns provenance metadata", async () => {
  await withBuyServer(
    async (url, options) => {
      assert.equal(url, "https://gateway.usebuy.ai/v1/catalog");
      assert.equal(options.redirect, "manual");
      return new Response(JSON.stringify({ capabilities: [] }), {
        headers: { "content-type": "application/json" },
      });
    },
    async (base) => {
      const response = await fetch(`${base}/api/buy/catalog`);
      const body = await response.json();
      assert.equal(response.status, 200);
      assert.equal(body.source, "https://gateway.usebuy.ai/v1/catalog");
      assert.ok(body.fetchedAt);
      assert.equal(body.paidCallsEnabled, false);
    },
  );
});

test("rejects catalogue redirects without following them", async () => {
  await withBuyServer(
    async (_url, options) => {
      assert.equal(options.redirect, "manual");
      return new Response(null, {
        status: 302,
        headers: { location: "http://127.0.0.1/private" },
      });
    },
    async (base) => {
      const response = await fetch(`${base}/api/buy/catalog`);
      assert.equal(response.status, 502);
      assert.match((await response.json()).error, /unsafe redirect/i);
    },
  );
});

test("rejects catalogue bodies larger than the configured limit", async () => {
  await withBuyServer(
    async () =>
      new Response(" ".repeat(1024 * 1024 + 1), {
        headers: { "content-type": "application/json" },
      }),
    async (base) => {
      const response = await fetch(`${base}/api/buy/catalog`);
      assert.equal(response.status, 502);
      assert.match((await response.json()).error, /exceeded the allowed size/i);
    },
  );
});

test("rejects non-JSON catalogue responses", async () => {
  await withBuyServer(
    async () =>
      new Response("<html>not JSON</html>", {
        headers: { "content-type": "text/html" },
      }),
    async (base) => {
      const response = await fetch(`${base}/api/buy/catalog`);
      assert.equal(response.status, 502);
      assert.match((await response.json()).error, /unexpected format/i);
    },
  );
});

test("rejects a JSON catalogue with the wrong top-level shape", async () => {
  await withBuyServer(
    async () =>
      new Response(JSON.stringify(["unexpected"]), {
        headers: { "content-type": "application/json" },
      }),
    async (base) => {
      const response = await fetch(`${base}/api/buy/catalog`);
      assert.equal(response.status, 502);
      assert.match((await response.json()).error, /unexpected format/i);
    },
  );
});

test("reports an upstream timeout without exposing implementation details", async () => {
  await withBuyServer(
    async () => {
      const error = new Error("private fetch detail");
      error.name = "AbortError";
      throw error;
    },
    async (base) => {
      const response = await fetch(`${base}/api/buy/catalog`);
      const body = await response.json();
      assert.equal(response.status, 502);
      assert.equal(body.error, "The live catalogue request timed out.");
      assert.equal(
        JSON.stringify(body).includes("private fetch detail"),
        false,
      );
    },
  );
});
