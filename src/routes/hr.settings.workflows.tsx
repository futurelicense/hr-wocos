import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ConsoleButton,
  DataTable,
  DemoNote,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
import { automationTriggers, candidatePipeline, readinessRequirements } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

const approvalChains = [
  { name: "Workforce request", chain: "Client → Client Manager → HR Manager" },
  { name: "Offer", chain: "Recruiter → HR Manager → Client Manager" },
  { name: "Deployment readiness", chain: "HR Admin → HR Manager" },
  { name: "Timesheet", chain: "Employee → Client Supervisor → HR" },
  { name: "Leave", chain: "Employee → Supervisor → HR" },
  { name: "Payroll batch", chain: "Payroll Officer → HR Manager → Client" },
];

export const Route = createFileRoute("/hr/settings/workflows")({
  head: () => ({
    meta: [
      { title: "Workflow Configuration — WoCOS HR" },
      {
        name: "description",
        content:
          "Configure pipeline stages, deployment requirements, approval chains and the eleven automation triggers that move the workforce lifecycle forward.",
      },
      { property: "og:title", content: "Workflow Configuration — WoCOS HR" },
      { property: "og:description", content: "Stages, approval chains and lifecycle automation triggers." },
    ],
  }),
  component: WorkflowsPage,
});

function WorkflowsPage() {
  return (
    <>
      <PageHeader
        section="Administration"
        title="Workflow Configuration"
        subtitle="11 automation triggers · 6 approval chains · 10 pipeline stages · 11 readiness requirements"
        actions={
          <>
            <Link
              to="/hr/settings"
              className="flex h-9 items-center rounded-md bg-panel2 px-3.5 text-[13px] font-medium text-dim ring-1 ring-line hover:text-fg"
            >
              HR Settings
            </Link>
            <ConsoleButton variant="primary">Publish Workflow</ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Automation Triggers" value={11} note="1 under review" tone="success" />
        <StatTile label="Approval Chains" value={6} note="client-aware" tone="info" />
        <StatTile label="Pipeline Stages" value={10} note="2 client gates" tone="info" />
        <StatTile label="Readiness Rules" value={11} note="all must complete" tone="warning" />
      </div>

      <Panel title="Automation Triggers" meta="event → action">
        <DataTable
          columns={["Event", "Action", "State"]}
          rows={automationTriggers.map((t) => [
            <span className="text-fg">{labelize(t.event)}</span>,
            <span className="text-dim">{labelize(t.action)}</span>,
            <StatusBadge status={t.status} />,
          ])}
        />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Recruitment Stages" meta="10 stages">
          <ol className="space-y-1.5">
            {candidatePipeline.map((s, i) => (
              <li
                key={s}
                className="flex items-center justify-between gap-3 rounded-md bg-panel2 px-2.5 py-1.5 text-[12.5px] ring-1 ring-line"
              >
                <span className="flex items-center gap-2.5">
                  <span className="data-cell text-[10px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                  {labelize(s)}
                </span>
                {s === "client_review" ? <StatusBadge status="client_gate" tone="info" /> : null}
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Deployment Requirements" meta="all required">
          <ol className="space-y-1.5">
            {readinessRequirements.map((r, i) => (
              <li
                key={r}
                className="flex items-center gap-2.5 rounded-md bg-panel2 px-2.5 py-1.5 text-[12.5px] ring-1 ring-line"
              >
                <span className="data-cell text-[10px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                <span className="truncate">{labelize(r)}</span>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Approval Chains" meta="6 chains">
          <ul className="space-y-2">
            {approvalChains.map((c) => (
              <li key={c.name} className="console-inset p-2.5">
                <div className="text-[12.5px] text-fg">{c.name}</div>
                <div className="mt-1 font-mono text-[10px] text-mute">{c.chain}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
