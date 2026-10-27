# DESIGN.md

Design-system and interface guidance for HyeTraq, including AI design agents, prototype generators, and frontend implementation agents.

## 1. Product identity

**Product:** HyeTraq  
**Tagline:** Research. Execute. Verify.  
**Category:** Evidence-first Web3 research and intelligence workspace  
**Primary promise:** Turn a research question into a transparent, source-linked investigation with visible costs, human-controlled execution, and a reviewable audit trail.

HyeTraq should feel like a serious research instrument: calm, precise, dependable, modern, and technically literate. It should combine the clarity of a professional analytics workspace with the traceability of a developer tool. It must not feel like a speculative trading terminal, crypto casino, generic chatbot, or futuristic AI landing-page template.

## 2. Design principles

1. **Evidence is the hero.** Sources, timestamps, chain identifiers, assumptions, and claim-to-source links should be first-class.
2. **Clarity over decoration.** Use hierarchy, spacing, typography, and restrained colour before effects.
3. **Trust is earned through disclosure.** Show what is live, cached, simulated, unavailable, or unverified.
4. **Money needs friction in the right place.** Paid execution requires a deliberate review and approval step; never make the primary action ambiguous.
5. **Complexity is progressive.** Keep the first view understandable while exposing detailed evidence and execution metadata on demand.
6. **State is part of the interface.** Loading, empty, partial, error, disabled, and uncertain states are designed, not afterthoughts.
7. **Professional, not sterile.** Use a distinctive editorial rhythm and considered microcopy without sacrificing usability.
8. **Accessible by default.** Aim for WCAG 2.2 AA, keyboard support, readable contrast, and reduced-motion support.
9. **Responsive by intent.** The desktop workspace may use multiple panes; mobile must become a deliberate single-column workflow rather than a squeezed desktop layout.

## 3. Visual direction

### Overall style

- Dark-first research workspace with a deep ink/charcoal foundation.
- Warm off-white or cool neutral text, muted slate secondary text, subtle borders, and restrained lime or teal accents.
- Use accent colours sparingly for primary actions, focus, selected navigation, and meaningful evidence highlights.
- Reserve red for destructive or critical states, amber for caution, and green for confirmed success. Never rely on colour alone.
- Use flat or softly elevated surfaces with thin borders. Avoid heavy glassmorphism, neon glows, excessive blur, glossy gradients, and decorative 3D elements.
- Keep shadows subtle and functional. Prefer contrast and spacing over nested cards everywhere.
- Use small, intentional iconography with consistent stroke weight. Pair unfamiliar icons with labels or tooltips.

### Brand personality

- Analytical
- Calm
- Exact
- Transparent
- Capable
- Security-conscious

Avoid copy and visuals that suggest omniscience, guaranteed correctness, guaranteed returns, or fully autonomous spending.

## 4. Design tokens

Treat these as initial design tokens. If the existing codebase already defines equivalent tokens, consolidate them rather than creating a competing system. Validate contrast in implementation.

### Colour palette

| Token | Suggested value | Use |
|---|---|---|
| `--ht-bg` | `#0B0F14` | App background |
| `--ht-surface` | `#111821` | Main surfaces |
| `--ht-surface-raised` | `#17212C` | Raised panels and menus |
| `--ht-border` | `#273342` | Dividers and component borders |
| `--ht-text` | `#F3F6F8` | Primary text |
| `--ht-text-muted` | `#A1ADBA` | Secondary text |
| `--ht-text-subtle` | `#748292` | Tertiary text; check contrast before use |
| `--ht-accent` | `#B8F36B` | Primary action / active accent |
| `--ht-accent-strong` | `#9BD94D` | Hover/pressed accent |
| `--ht-info` | `#72C7E8` | Informational state |
| `--ht-success` | `#7ED6A5` | Confirmed success |
| `--ht-warning` | `#F3C66D` | Caution / needs review |
| `--ht-danger` | `#FF7F87` | Error / destructive state |

Accent values are starting points, not a substitute for contrast testing. Avoid using accent text on similarly bright backgrounds without checking readability.

### Typography

Use a high-legibility UI sans-serif for interface text and an optional restrained monospace for addresses, hashes, IDs, timestamps, and technical metadata.

Suggested stack:

- UI: `Inter`, `Geist`, or system sans-serif fallback.
- Technical data: `IBM Plex Mono`, `JetBrains Mono`, or system monospace fallback.

Rules:

- Use a consistent type scale rather than many arbitrary sizes.
- Page title should be prominent but not oversized.
- Body text should be comfortably readable; avoid tiny low-contrast metadata.
- Use tabular numerals for costs, timestamps, and metrics when supported.
- Wrap long URLs and hashes safely; provide copy affordances without forcing horizontal page scrolling.
- Use sentence case for headings, labels, and buttons.

### Spacing, shape, and layout

- Base spacing unit: 4 px.
- Common spacing steps: 4, 8, 12, 16, 20, 24, 32, 40, 48 px.
- Component radius: 8–12 px.
- Larger panels: 12–16 px.
- Use a consistent content grid and align headings, panel edges, and primary controls.
- Keep readable line lengths for reports; use a narrower text measure for long-form findings.
- Avoid placing every control inside a separate card. Use whitespace and section dividers to establish hierarchy.

### Motion

- Motion should communicate state changes, not decorate.
- Prefer short, restrained transitions.
- Respect `prefers-reduced-motion`.
- Never rely on animation alone to convey loading, completion, urgency, or errors.
- Avoid continuously pulsing status indicators unless they communicate a real, active process.

## 5. Information architecture

Recommended top-level navigation:

- **Research** — start and monitor investigations.
- **Reports** — saved findings and evidence-linked reports, once persistence exists.
- **Activity** — research steps, provider calls, and settlement evidence.
- **Settings** — preferences, connected services, identity, and privacy controls as implemented.

Do not display navigation items as fully functional if their pages do not exist. In the scaffold, mark planned or unavailable areas clearly or omit them until implemented.

## 6. Primary research workspace

The primary screen should answer these questions at a glance:

1. What am I researching?
2. What will HyeTraq do next?
3. What evidence has been collected?
4. Will this cost money?
5. What needs my approval?
6. What has been verified versus inferred?

### Desktop layout

Use a clear three-part hierarchy rather than a dense grid of unrelated widgets:

- **Navigation rail:** brand, core sections, user/workspace context if implemented.
- **Main work area:** research question composer, scope controls, plan, live progress, findings, and report.
- **Context panel:** source/evidence details, execution status, budget information, and selected item detail.

The context panel may collapse at medium widths. Do not force three columns on tablet or mobile.

### Research composer

Include:

- A prominent question field with a concise example placeholder.
- Optional scope controls for chain, protocol, time range, and source type only where supported.
- A clear primary action such as **Build research plan**.
- A small privacy/usage note where relevant.
- Input length and validation feedback.
- Keyboard-accessible controls and a visible focus ring.

Do not label a plan-creation action as “Run” or “Execute” if it cannot perform the research yet.

### Plan review

Show a readable sequence of proposed steps. Each step should communicate:

- Purpose
- Source/provider
- Free versus paid classification
- Expected output
- Estimated cost where available
- Dependencies or limitations
- Status

Use plain language, not opaque agent jargon. Allow users to inspect details without losing the overall plan.

### Spend approval

Paid operations require a distinct review surface, preferably a modal or dedicated step that traps focus correctly and is accessible by keyboard.

Display:

- Provider and service
- Exact operation being requested
- Quote amount and currency/unit
- Estimated total for the approved scope
- User-defined maximum spend
- Whether the quote is current and validated
- Why this paid call is needed
- Important irreversible-payment/uncertain-settlement notice
- **Approve and pay** only when the backend confirms all execution gates are satisfied
- A clear **Cancel** action

If quote, cap, provider, or receipt verification is unavailable, do not show an enabled payment button. Explain what is missing and offer a safe non-paid alternative when possible. Never use a pre-checked consent box.

### Research progress and activity

Use a vertical step timeline or compact activity list. Each row should show a human-readable step name, current state, time where available, and a short outcome. Detailed request/response metadata can be expanded.

Suggested states:

- `Planned`
- `Waiting for approval`
- `Running`
- `Completed`
- `Failed`
- `Unknown outcome`
- `Needs reconciliation`
- `Skipped`

Use text labels and icons in addition to colour. Do not show a successful state until the relevant operation is verified.

### Evidence panel

Evidence items should be easy to inspect and compare. Display:

- Claim or short evidence summary
- Source name and link
- Retrieval time
- Chain/block/transaction identifiers where applicable
- Data freshness or caveat
- Relationship to report claims
- Copy/open-source affordances

Separate direct observations from project claims and AI interpretation. Make stale or conflicting evidence visible.

### Final report

Recommended structure:

1. Executive summary
2. Research question and scope
3. Key findings
4. Evidence and source links
5. Methodology and data freshness
6. Contradictions and limitations
7. Unanswered questions
8. Execution and cost summary, only when supported by actual records

A reader should be able to trace a material claim to evidence in one or two interactions. Reports should be exportable only when export is actually implemented, and sensitive data should not leak into public URLs.

## 7. Component standards

### Buttons

- One clear primary action per major surface.
- Secondary actions should be visually quieter.
- Destructive actions use a distinct danger treatment and confirmation when consequential.
- Disabled buttons need an adjacent explanation when the reason is not obvious.
- Include hover, focus-visible, pressed, disabled, and loading states.
- Prevent duplicate submissions while a request is in progress.

### Inputs

- Persistent labels; do not rely on placeholder text alone.
- Helpful inline validation and clear error association.
- Adequate touch target size.
- Keyboard support and visible focus.
- Preserve user input after recoverable errors where safe.

### Cards and panels

- Use panels to group related information, not as decoration.
- Keep border and surface contrast subtle but sufficient.
- Avoid excessive nesting and repeated rounded rectangles.
- Use consistent padding and header alignment.

### Tables and technical values

- Use tables for comparable structured records, not for long-form narrative.
- On mobile, switch to a readable card/list pattern or provide an intentional scroll container.
- Provide copy controls for long identifiers.
- Use monospace sparingly and ensure values remain selectable.
- Never truncate a critical amount, status, or chain identifier without a way to inspect the full value.

### Dialogs and confirmations

- Set an accessible name and description.
- Move focus into the dialog, contain focus while open, and restore focus on close.
- Make cancellation easy to find.
- For payments, present a complete operation summary and require an explicit user action.
- Do not use misleading countdowns, dark patterns, or pressure language.

### Notifications and errors

- Say what happened, what is known, and what the user can safely do next.
- Avoid exposing stack traces, provider secrets, internal IDs, or sensitive prompts.
- For uncertain payment settlement, state that the outcome is not yet confirmed and that the system will reconcile it before retrying.
- Do not turn a partial success into an all-success toast.

## 8. Content and microcopy

Write like a precise research tool, not a hype-driven crypto product.

Prefer:
- “Build research plan”
- “Review estimated cost”
- “Waiting for approval”
- “Source retrieved at 14:32 UTC”
- “This finding is based on one source”
- “Payment outcome is not yet confirmed”
- “Paid execution is unavailable until receipt verification is configured”

Avoid:
- “AI knows everything”
- “Guaranteed alpha”
- “100% accurate”
- “Payment complete” before verification
- “Autopilot” for actions requiring approval
- “Trustless” unless the specific property is technically established

Use concise sentences, sentence case, and consistent terminology. Explain technical terms in context. Use absolute dates or UTC timestamps when relative time could be ambiguous.

## 9. Empty, loading, error, and partial states

Design each state intentionally.

- **Empty:** Explain the purpose of the section and the next useful action. Do not fabricate sample activity unless explicitly labelled as demo data.
- **Loading:** Identify the operation in progress; provide cancellation when safe.
- **Partial:** Show what succeeded and what remains incomplete.
- **Error:** Provide a plain-language reason where known, a safe next step, and a correlation ID only if useful.
- **Uncertain:** Make uncertainty prominent; do not use success styling.
- **Unavailable:** Explain which prerequisite is missing and avoid implying the feature is active.
- **Offline:** Preserve safe local input where practical and explain whether the operation was sent or not sent.
- **Permission denied:** Explain what permission is needed without asking the user to reveal secrets.

## 10. Responsive behaviour

### Desktop: 1200 px and above
- Use the full workspace with navigation, main research area, and optional context panel.
- Keep content aligned to a stable grid.
- Do not let evidence detail crowd out the main question and report.

### Tablet: 768–1199 px
- Collapse navigation to a compact rail or drawer.
- Make the context panel collapsible.
- Keep primary actions visible without overlapping content.

### Mobile: below 768 px
- Use a single-column flow.
- Place the question and current state first.
- Move secondary details into accessible accordions or dedicated views.
- Keep primary actions reachable and never cover content with sticky controls.
- Use touch-friendly targets and avoid hover-only interactions.
- Ensure long hashes, URLs, and tables cannot break the viewport.

These breakpoints are guidance. Validate the actual layout rather than treating breakpoint numbers as a substitute for testing.

## 11. Accessibility requirements

Target WCAG 2.2 AA.

- Semantic landmarks and heading hierarchy.
- Full keyboard access with a clear focus indicator.
- Text and interactive contrast checked against WCAG requirements.
- Form fields have persistent labels and programmatically associated errors.
- Screen-reader announcements for meaningful async state changes without excessive chatter.
- No colour-only status communication.
- Reduced-motion support.
- Accessible dialogs and menus.
- Alternative text for meaningful imagery; decorative imagery should not create noise.
- Zoom/reflow support and no unintended horizontal page scrolling at narrow widths.
- Plain language for high-impact payment and security decisions.

## 12. Data integrity and truthful visualisation

- Never generate fake charts, transaction hashes, service receipts, wallet balances, provider uptime, or activity records to make the interface look populated.
- Label fixtures and mock responses clearly in development.
- A planned operation is not a running operation; a running operation is not a completed operation.
- A successful HTTP response is not automatically proof of payment settlement.
- Display only metrics that have a defined source, unit, time window, and calculation.
- Keep provenance visible near the claim it supports.
- Show missing or conflicting data rather than silently filling gaps.

## 13. Design-agent workflow

When generating a mockup or modifying UI:

1. Inspect `README.md`, this file, the current app, routes, and available components.
2. Identify what the product can genuinely do today and which screens are only planned.
3. Produce a compact proposal describing screen hierarchy, states, responsive behaviour, and accessibility decisions before redesigning the whole application.
4. Reuse existing tokens and components where possible.
5. Build the smallest complete user journey first: question → plan → review → evidence/report state.
6. Design payment approval and uncertain settlement states even if paid execution remains disabled.
7. Compare implementation against the approved design at desktop and mobile widths.
8. Check keyboard navigation, focus, contrast, overflow, loading, empty, and error states.
9. Do not invent capabilities, data, prices, receipts, or verification indicators.
10. Report what is implemented, what is mocked, and what remains unavailable.

## 14. Design acceptance checklist

- [ ] The product reads as a professional research workspace, not a generic chatbot or trading terminal.
- [ ] The research question and next action are immediately clear.
- [ ] Evidence provenance is visible and easy to inspect.
- [ ] Free and paid steps are distinguishable.
- [ ] Paid execution is impossible to trigger without valid backend approval and spend-cap checks.
- [ ] Disabled or incomplete capabilities are labelled honestly.
- [ ] Loading, empty, partial, failure, and uncertain states are designed.
- [ ] No fabricated activity, receipt, price, or metric is present.
- [ ] Layout works at desktop, tablet, and mobile widths.
- [ ] Keyboard, focus, labels, contrast, and reduced motion have been considered.
- [ ] Text uses consistent terminology and sentence case.
- [ ] Existing functionality and security controls are preserved.
