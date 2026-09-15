import { createFileRoute } from "@tanstack/react-router";
import {
  ConsoleButton,
  DataTable,
  DemoNote,
  KeyValue,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
import { candidates, deployments } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

const modules = [
  "dashboard",
  "workforce_requests",
  "candidate_approvals",
  "active_workforce",
  "attendance",
  "timesheet_approvals",
  "payroll_approvals",
  "performance",
  "reports",
  "support_requests",
];

export const Route = createFileRoute("/hr/client-portal")({
  head: () => ({
    meta: [
      { title: "Client Portal — WoCOS HR" },
      {
        name: "description",
        content:
          "A client-scoped view of workforce requests, candidate approvals, deployed staff, attendance, timesheet and payroll approvals.",
      },
      { property: "og:title", content: "Client Portal — WoCOS HR" },
      { property: "og:description", content: "Client-scoped workforce visibility and approvals." },
    ],
  }),
  component: ClientPortalPage,
});

function ClientPortalPage() {
  const clientName = "ABC Company";
  const clientStaff = deployments.filter((d) => d.client === clientName);
  const approvals = candidates.filter((c) => c.client === clientName && ["client_review", "selected"].includes(c.stage));

  return (
    <>
      <PageHeader
        section="Portals"
        title="Client Portal"
        subtitle={`Viewing as ${clientName} · client-scoped visibility only`}
        actions={
          <>
            <ConsoleButton>Switch client</ConsoleButton>
            <ConsoleButton variant="primary">+ Raise Workforce Request</ConsoleButton>
          </>
        }
      />

      <div className="rounded-lg bg-sky/8 p-3 ring-1 ring-sky/25">
        <p className="text-[12px] leading-relaxed text-dim">
          <span className="font-mono text-[10px] tracking-[0.14em] text-sky uppercase">Scope</span> — clients only ever
          see their own workforce, requests and approvals. Nothing from other clients is visible in this view.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Deployed Staff" value={48} note="2 sites" tone="success" />
        <StatTile label="Open Requests" value={3} note="1 partially filled" tone="warning" />
        <StatTile label="Candidates To Review" value={approvals.length} note="awaiting your decision" tone="warning" />
        <StatTile label="Approvals Due" value={2} note="timesheets + payroll" tone="warning" />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Candidate Approvals" meta={`${approvals.length} pending`} className="lg:col-span-2">
          <DataTable
            columns={["Candidate", "Role", "Experience", "Score", "Stage"]}
            rows={approvals.map((c) => [
              <span className="text-fg">{c.name}</span>,
              c.role,
              <span className="data-cell">{c.experience}</span>,
              <span className="data-cell text-teal">{c.score ?? "—"}</span>,
              <StatusBadge status={c.stage} />,
            ])}
          />
          <div className="mt-3 flex gap-2">
            <ConsoleButton variant="primary">Approve Selected</ConsoleButton>
            <ConsoleButton>Request Another Interview</ConsoleButton>
          </div>
        </Panel>

        <Panel title="Portal Modules">
          <ul className="space-y-1.5">
            {modules.map((m, i) => (
              <li
                key={m}
                className="flex items-center justify-between gap-3 border-b border-line/60 py-1.5 text-[12.5px] last:border-0"
              >
                <span>{labelize(m)}</span>
                <StatusBadge status={i > 6 ? "under_review" : "active"} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Active Workforce" meta={`${clientStaff.length} shown of 48`} className="lg:col-span-2">
          <DataTable
            columns={["Employee", "Department", "Location", "Supervisor", "Start", "Status"]}
            rows={clientStaff.map((d) => [
              <span className="text-fg">{d.employee}</span>,
              d.department,
              <span className="text-dim">{d.location}</span>,
              <span className="text-dim">{d.supervisor}</span>,
              <span className="data-cell text-[11px]">{d.start}</span>,
              <StatusBadge status={d.status} />,
            ])}
          />
        </Panel>

        <Panel title="This Period">
          <KeyValue
            rows={[
              { k: "Attendance", v: "96.4% present" },
              { k: "Timesheets to approve", v: <span className="data-cell">1 batch</span> },
              { k: "Payroll approval", v: <StatusBadge status="awaiting_approval" /> },
              { k: "Support requests", v: <span className="data-cell">2 open</span> },
              { k: "Performance reviews", v: <span className="data-cell">6 in cycle</span> },
              { k: "Contracts expiring", v: <span className="text-amber">3 within 30 days</span> },
            ]}
          />
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
