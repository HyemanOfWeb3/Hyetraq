import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleDollarSign,
  FileText,
  FlaskConical,
  Globe2,
  Layers3,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { workflowStatusPresentation } from "./workflowStatus.js";

const API = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5050/api";

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function App() {
  const [question, setQuestion] = useState("");
  const [budget, setBudget] = useState(0.05);
  const [focus, setFocus] = useState("celo");
  const [plan, setPlan] = useState(null);
  const [catalogState, setCatalogState] = useState("idle");
  const [catalogMessage, setCatalogMessage] = useState(
    "Catalogue has not been checked in this session.",
  );
  const [busy, setBusy] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    fetch(`${API}/health`, { signal: controller.signal })
      .then((response) => setApiStatus(response.ok ? "online" : "offline"))
      .catch(() => setApiStatus("offline"))
      .finally(() => window.clearTimeout(timeout));
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const steps = plan?.steps || [
    {
      id: "free-chain-data",
      title: "Check available on-chain data",
      payment: "free-first",
      status: "planned",
      detail:
        "Prefer free bounded blockchain queries where they answer the question.",
    },
    {
      id: "paid-evidence",
      title: "Find a paid source only if needed",
      payment: "requires-quote-and-approval",
      status: "not-started",
      detail: "Compare a live quote with your spending cap before any payment.",
    },
    {
      id: "synthesis",
      title: "Build an evidence-linked brief",
      payment: "no-payment",
      status: "not-started",
      detail:
        "Separate sourced facts, interpretation, unknowns, and actual cost.",
    },
  ];
  const budgetLabel = useMemo(() => `$${Number(budget).toFixed(2)}`, [budget]);

  async function createPlan(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const response = await fetchWithTimeout(`${API}/research/plan`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, maxSpendUsd: Number(budget), focus }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not create a plan.");
      setPlan(data);
    } catch (err) {
      setPlan({
        status: "local-preview",
        question,
        maxSpendUsd: Number(budget),
        steps,
        notice: `${err.message} Showing a local preview only; this is not a generated research report.`,
      });
    } finally {
      setBusy(false);
    }
  }

  async function checkCatalog() {
    setCatalogState("loading");
    setCatalogMessage("Requesting the current service catalogue…");
    try {
      const response = await fetchWithTimeout(`${API}/buy/catalog`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Catalogue unavailable.");
      const caps = Array.isArray(data.catalog?.capabilities)
        ? data.catalog.capabilities
        : [];
      const available = caps.filter((c) => c.available === true).length;
      setCatalogState("success");
      setCatalogMessage(
        `Live catalogue received at ${new Date(data.fetchedAt).toLocaleTimeString()}. ${available} capabilities were explicitly marked available by the gateway. Paid execution remains disabled.`,
      );
    } catch (err) {
      setCatalogState("error");
      setCatalogMessage(
        `${err.message} This environment could not verify live availability; no paid call was made.`,
      );
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Activity size={19} />
          </div>
          <div>
            <strong>HyeTraq</strong>
            <small>EVIDENCE-FIRST RESEARCH</small>
          </div>
        </div>
        <div className="workspace-switch">
          <div className="workspace-icon">L</div>
          <div className="workspace-copy">
            <strong>Local workspace</strong>
            <span>No account or persistence</span>
          </div>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav aria-label="Primary navigation">
          <span className="nav-item active" aria-current="page">
            <Search size={17} /> Research desk
          </span>
        </nav>
        <div className="sidebar-bottom">
          <div className="budget-mini">
            <div className="mini-heading">
              <span>PLAN SPEND CAP</span>
              <CircleDollarSign size={15} />
            </div>
            <strong>{budgetLabel}</strong>
            <div className="mini-track">
              <span style={{ width: "0%" }} />
            </div>
            <small>Planning only · no payment records</small>
          </div>
          <div className="secure-note">
            <ShieldCheck size={16} />
            <span>Paid execution is disabled in this build.</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Local workspace <span>/</span> <strong>Research desk</strong>
          </div>
          <div className="top-actions">
            <span className={`api-pill ${apiStatus}`}>
              <i /> API {apiStatus === "checking" ? "checking" : apiStatus}
            </span>
          </div>
        </header>
        <section className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-icon">
                  <Sparkles size={13} />
                </span>{" "}
                WEB3 RESEARCH PLANNER
              </div>
              <h1>
                Make the signal <em>make sense.</em>
              </h1>
              <p>
                Plan a research workflow, inspect the catalogue, and see clearly
                what this build does not execute.
              </p>
            </div>
            <div className="live-chip">LOCAL DEMO</div>
          </div>

          <div className="hero-grid">
            <section className="panel research-panel">
              <div className="panel-title">
                <div className="title-icon">
                  <Search size={17} />
                </div>
                <div>
                  <h2>Start a research brief</h2>
                  <p>Tell HyeTraq what you need to understand.</p>
                </div>
                <span className="step-count">01 / INPUT</span>
              </div>
              <form onSubmit={createPlan}>
                <label htmlFor="question">RESEARCH QUESTION</label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={1200}
                  minLength={12}
                  required
                  placeholder="e.g. Compare Celo DeFi activity this month…"
                />
                <div className="field-meta">
                  <span>
                    Be specific about the timeframe, chain, or comparison.
                  </span>
                  <span>{question.length}/1200</span>
                </div>
                <div className="form-row">
                  <div className="field-block">
                    <label htmlFor="focus">RESEARCH SCOPE</label>
                    <div className="select-wrap">
                      <Globe2 size={15} />
                      <select
                        id="focus"
                        value={focus}
                        onChange={(e) => setFocus(e.target.value)}
                      >
                        <option value="celo">Celo ecosystem</option>
                        <option value="web3-general">Web3 · general</option>
                      </select>
                      <ChevronDown size={14} />
                    </div>
                  </div>
                  <div className="field-block">
                    <div className="label-with-value">
                      <label htmlFor="maxSpend">PLAN SPEND CAP</label>
                      <strong>{budgetLabel}</strong>
                    </div>
                    <input
                      id="maxSpend"
                      type="range"
                      min="0"
                      max="5"
                      step="0.01"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                    />
                    <div className="range-ends">
                      <span>$0.00 · free only</span>
                      <span>$5.00</span>
                    </div>
                  </div>
                </div>
                <div className="approval-note">
                  <LockKeyhole size={16} />
                  <span>
                    <strong>This cap applies to planning only.</strong> Paid
                    execution is disabled in this build. Creating a plan does
                    not make a payment.
                  </span>
                </div>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={busy}
                >
                  {busy ? "Preparing plan…" : "Build research plan"}{" "}
                  <ArrowUpRight size={17} />
                </button>
              </form>
            </section>

            <section className="panel workflow-panel">
              <div className="panel-title">
                <div className="title-icon green">
                  <FlaskConical size={17} />
                </div>
                <div>
                  <h2>Proposed workflow</h2>
                  <p>Plan only · no research steps have run.</p>
                </div>
              </div>
              <div className="workflow-list">
                {steps.map((s, i) => {
                  const presentation = workflowStatusPresentation(s.status);
                  return (
                    <div className="workflow-step" key={s.id}>
                      <div
                        className={`step-icon ${presentation.icon === "complete" ? "complete" : presentation.icon === "pending" ? "pending" : "muted"}`}
                      >
                        {presentation.icon === "complete" ? (
                          <Check size={15} />
                        ) : i === 1 ? (
                          <CircleDollarSign size={15} />
                        ) : i === 2 ? (
                          <FileText size={15} />
                        ) : (
                          <Search size={15} />
                        )}
                      </div>
                      <div className="step-body">
                        <div className="step-top">
                          <strong>{s.title}</strong>
                          <span
                            className={`status-label ${presentation.className}`}
                          >
                            {presentation.label}
                          </span>
                        </div>
                        <p>{s.detail}</p>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="step-connector" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="workflow-foot">
                <Zap size={15} />
                <span>
                  Paid execution is unavailable; no payment can be initiated
                  here.
                </span>
              </div>
            </section>
          </div>

          {plan && (
            <section
              className="panel result-panel"
              role="status"
              aria-live="polite"
            >
              <div className="result-head">
                <div>
                  <div className="eyebrow">PLAN PREVIEW</div>
                  <h2>Your research plan is ready</h2>
                </div>
                <span className="status-label status-pending">
                  {plan.status === "plan-only"
                    ? "Plan only"
                    : "Local preview only"}
                </span>
              </div>
              <p className="plan-question">“{plan.question}”</p>
              <div className="plan-stats">
                <div>
                  <span>PLAN SPEND CAP</span>
                  <strong>${Number(plan.maxSpendUsd).toFixed(2)}</strong>
                </div>
                <div>
                  <span>PAID ACTIONS</span>
                  <strong>Execution disabled</strong>
                </div>
                <div>
                  <span>RESEARCH REPORT</span>
                  <strong>Not generated</strong>
                </div>
              </div>
              <div className="notice-box">
                <ShieldCheck size={17} />
                <span>{plan.notice}</span>
              </div>
            </section>
          )}

          <section className="lower-grid">
            <div className="panel sources-panel">
              <div className="panel-title">
                <div className="title-icon">
                  <Globe2 size={17} />
                </div>
                <div>
                  <h2>Service catalogue</h2>
                  <p>Check what is currently available, not a cached guess.</p>
                </div>
              </div>
              <div className="catalog-empty" aria-live="polite">
                <div className={`catalog-icon ${catalogState}`}>
                  <Layers3 size={22} />
                </div>
                <div>
                  <strong>
                    {catalogState === "success"
                      ? "Catalogue checked"
                      : catalogState === "error"
                        ? "Live catalogue unavailable"
                        : "No live catalogue check yet"}
                  </strong>
                  <p>{catalogMessage}</p>
                </div>
              </div>
              <button
                className="secondary-button"
                onClick={checkCatalog}
                disabled={catalogState === "loading"}
              >
                {catalogState === "loading"
                  ? "Checking…"
                  : "Check live catalogue"}{" "}
                <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="panel ledger-panel">
              <div className="panel-title">
                <div className="title-icon">
                  <CircleDollarSign size={17} />
                </div>
                <div>
                  <h2>Payment status</h2>
                  <p>Paid execution is disabled in this build.</p>
                </div>
              </div>
              <div className="ledger-empty">
                <div>
                  <strong>Unavailable</strong>
                  <span>No paid operations can be initiated here</span>
                </div>
                <span className="no-transactions">EXECUTION DISABLED</span>
              </div>
              <div className="ledger-foot">
                <ShieldCheck size={14} /> No payment receipts or transaction
                records are created by this scaffold.
              </div>
            </div>
          </section>
          <footer>
            <span>
              HyeTraq <b>·</b> Feasibility build
            </span>
            <span>
              <ShieldCheck size={13} /> Transparent costs. Verifiable evidence.
              No fabricated receipts.
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
}
