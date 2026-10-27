import test from "node:test";
import assert from "node:assert/strict";
import { workflowStatusPresentation } from "./workflowStatus.js";

test("planned operations are not presented as successful", () => {
  assert.deepEqual(workflowStatusPresentation("planned"), {
    label: "Planned",
    className: "status-muted",
    icon: "planned",
  });
  assert.notEqual(
    workflowStatusPresentation("planned").className,
    "status-ready",
  );
});

test("awaiting operations are clearly described as waiting", () => {
  assert.deepEqual(workflowStatusPresentation("awaiting-live-catalog"), {
    label: "Awaiting live catalogue",
    className: "status-pending",
    icon: "pending",
  });
});

test("unknown workflow states fail visibly instead of implying completion", () => {
  assert.deepEqual(workflowStatusPresentation("unexpected"), {
    label: "Unknown status",
    className: "status-pending",
    icon: "unknown",
  });
});
