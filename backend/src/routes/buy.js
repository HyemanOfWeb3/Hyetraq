import { Router } from "express";
import { z } from "zod";

const CATALOG_URL = "https://gateway.usebuy.ai/v1/catalog";
const CATALOG_TIMEOUT_MS = 8000;
const MAX_CATALOG_BYTES = 1024 * 1024;
const catalogSchema = z
  .object({ capabilities: z.array(z.unknown()).optional() })
  .passthrough();

async function readLimitedBody(response) {
  if (!response.body) throw new Error("empty-response");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytesRead += value.byteLength;
    if (bytesRead > MAX_CATALOG_BYTES) {
      await reader.cancel().catch(() => {});
      throw new Error("response-too-large");
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

export function createBuyRouter(fetchImpl = fetch) {
  const router = Router();

  router.get("/catalog", async (_req, res) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CATALOG_TIMEOUT_MS);
    try {
      const response = await fetchImpl(CATALOG_URL, {
        signal: controller.signal,
        redirect: "manual",
        headers: { accept: "application/json" },
      });
      if (response.status >= 300 && response.status < 400) {
        return res.status(502).json({
          error: "The live catalogue returned an unsafe redirect.",
          paidCallsEnabled: false,
        });
      }
      if (!response.ok) {
        return res.status(502).json({
          error: "The live buy catalogue could not be loaded.",
          upstreamStatus: response.status,
          paidCallsEnabled: false,
        });
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        return res.status(502).json({
          error: "The live catalogue returned an unexpected format.",
          paidCallsEnabled: false,
        });
      }

      let catalog;
      try {
        catalog = JSON.parse(await readLimitedBody(response));
      } catch (error) {
        if (error.name === "AbortError") {
          return res
            .status(502)
            .json({
              error: "The live catalogue request timed out.",
              paidCallsEnabled: false,
            });
        }
        const message =
          error.message === "response-too-large"
            ? "The live catalogue response exceeded the allowed size."
            : "The live catalogue returned an unexpected format.";
        return res
          .status(502)
          .json({ error: message, paidCallsEnabled: false });
      }
      const parsedCatalog = catalogSchema.safeParse(catalog);
      if (!parsedCatalog.success) {
        return res
          .status(502)
          .json({
            error: "The live catalogue returned an unexpected format.",
            paidCallsEnabled: false,
          });
      }

      res.json({
        catalog: parsedCatalog.data,
        source: CATALOG_URL,
        fetchedAt: new Date().toISOString(),
        paidCallsEnabled: false,
        note: "Catalogue is live; paid execution stays disabled until exact quote and settlement-receipt parsing is validated.",
      });
    } catch (error) {
      res.status(502).json({
        error:
          error.name === "AbortError"
            ? "The live catalogue request timed out."
            : "The live catalogue is unreachable from this server.",
        paidCallsEnabled: false,
      });
    } finally {
      clearTimeout(timeout);
    }
  });

  router.post("/execute", (_req, res) =>
    res.status(501).json({
      error:
        "Paid execution is intentionally disabled in this feasibility build.",
      reason:
        "The live quote schema and settlement receipt must be validated before enabling a payment path. No payment was attempted.",
      paidCallsEnabled: false,
    }),
  );

  return router;
}

export default createBuyRouter();
