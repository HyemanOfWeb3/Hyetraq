const presentations = {
  planned: { label: "Planned", className: "status-muted", icon: "planned" },
  "awaiting-live-catalog": {
    label: "Awaiting live catalogue",
    className: "status-pending",
    icon: "pending",
  },
  "blocked-by-zero-cap": {
    label: "Blocked by zero cap",
    className: "status-muted",
    icon: "blocked",
  },
  "not-started": {
    label: "Not started",
    className: "status-muted",
    icon: "planned",
  },
  completed: {
    label: "Completed",
    className: "status-ready",
    icon: "complete",
  },
  failed: { label: "Failed", className: "status-pending", icon: "failed" },
};

export function workflowStatusPresentation(status) {
  return (
    presentations[status] || {
      label: "Unknown status",
      className: "status-pending",
      icon: "unknown",
    }
  );
}
