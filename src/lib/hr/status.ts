export type Tone = "success" | "warning" | "danger" | "neutral" | "info";

const SUCCESS = [
  "approved",
  "cleared",
  "completed",
  "ready_for_deployment",
  "active",
  "accepted",
  "filled",
  "deployed",
  "compliant",
  "present",
  "resolved",
  "processed",
  "handed_off",
  "strong_hire",
  "hire",
  "selected",
  "ready",
  "locked",
];

const WARNING = [
  "pending",
  "under_review",
  "expiring",
  "awaiting_approval",
  "awaiting_consent",
  "in_progress",
  "submitted",
  "manager_review",
  "hr_review",
  "pending_approval",
  "pending_requirements",
  "partially_filled",
  "paused",
  "late",
  "investigating",
  "awaiting_response",
  "assigned",
  "recruiting",
  "screening",
  "consider",
  "exception",
  "on_leave",
  "reassignment",
];

const DANGER = [
  "rejected",
  "failed",
  "expired",
  "blocked",
  "critical",
  "declined",
  "absent",
  "missing",
  "no_hire",
  "not_cleared",
  "suspended",
  "exiting",
  "high",
];

export function toneFor(status: string): Tone {
  const key = status.toLowerCase().replace(/\s+/g, "_");
  if (SUCCESS.includes(key)) return "success";
  if (WARNING.includes(key)) return "warning";
  if (DANGER.includes(key)) return "danger";
  return "neutral";
}

export function labelize(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bHr\b/g, "HR")
    .replace(/\bCv\b/g, "CV")
    .replace(/\bKpis\b/g, "KPIs");
}

export const toneClasses: Record<Tone, string> = {
  success: "bg-teal/12 text-teal ring-teal/25",
  warning: "bg-amber/12 text-amber ring-amber/25",
  danger: "bg-coral/12 text-coral ring-coral/25",
  info: "bg-sky/12 text-sky ring-sky/25",
  neutral: "bg-panel2 text-dim ring-line",
};

export const toneBar: Record<Tone, string> = {
  success: "bg-teal",
  warning: "bg-amber",
  danger: "bg-coral",
  info: "bg-sky",
  neutral: "bg-line",
};
