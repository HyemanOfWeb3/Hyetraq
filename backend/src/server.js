import "dotenv/config";
import { randomUUID } from "node:crypto";
import { pathToFileURL } from "node:url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import researchRouter from "./routes/research.js";
import { createBuyRouter } from "./routes/buy.js";
import agentRouter from "./routes/agent.js";

export function createApp({ buyRouter = createBuyRouter() } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: process.env.WEB_ORIGIN || "http://127.0.0.1:5173" }));
  app.use((req, res, next) => {
    req.requestId = randomUUID();
    res.setHeader("x-request-id", req.requestId);
    next();
  });
  app.use(express.json({ limit: "64kb" }));
  app.get("/api/health", (_req, res) =>
    res.json({ ok: true, service: "hyetraq-api", mode: "feasibility-mvp" }),
  );
  app.use("/api/research", researchRouter);
  app.use("/api/buy", buyRouter);
  app.use("/api/agent", agentRouter);
  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    const status =
      err?.type === "entity.too.large"
        ? 413
        : err?.type === "entity.parse.failed"
          ? 400
          : 500;
    const code =
      status === 413
        ? "request_too_large"
        : status === 400
          ? "invalid_json"
          : "internal_error";
    console.error(
      JSON.stringify({
        event: "request_failed",
        requestId: req.requestId,
        status,
      }),
    );
    res.status(status).json({ error: code, requestId: req.requestId });
  });
  return app;
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  const port = Number(process.env.PORT || 5050);
  const app = createApp();
  app.listen(port, "127.0.0.1", () =>
    console.log(`HyeTraq API listening on http://127.0.0.1:${port}`),
  );
}
