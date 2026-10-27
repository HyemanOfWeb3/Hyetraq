import { Router } from "express";
import { z } from "zod";

const router = Router();
const schema = z
  .object({
    question: z.string().trim().min(12).max(1200),
    maxSpendUsd: z.number().min(0).max(5),
    focus: z.enum(["celo", "web3-general"]).default("celo"),
  })
  .strict();

router.post("/plan", (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({
        error:
          "Enter a research question (12–1,200 characters) and a spending cap from $0 to $5.",
      });
  const { question, maxSpendUsd, focus } = parsed.data;
  const steps = [
    {
      id: "free-chain-data",
      title: "Check available on-chain data",
      payment: "free-first",
      status: "planned",
      detail:
        "Prefer bounded SQD queries where they can answer the question without a paid call.",
    },
    {
      id: "paid-evidence",
      title: "Find a paid source only if needed",
      payment: "requires-quote-and-approval",
      status: maxSpendUsd > 0 ? "awaiting-live-catalog" : "blocked-by-zero-cap",
      detail:
        "A live service catalogue and exact request quote must be checked before any payment.",
    },
    {
      id: "synthesis",
      title: "Build an evidence-linked brief",
      payment: "no-payment",
      status: "not-started",
      detail:
        "Separate sourced facts, interpretation, gaps, and costs. No evidence will be fabricated.",
    },
  ];
  res.json({
    status: "plan-only",
    focus,
    question,
    maxSpendUsd,
    steps,
    notice:
      "This feasibility build does not execute payments or invent research results. Paid execution remains disabled until live quote/receipt handling is tested.",
    next: "Check the live buy catalogue, then implement quote parsing and receipt verification against its current schema.",
  });
});

export default router;
