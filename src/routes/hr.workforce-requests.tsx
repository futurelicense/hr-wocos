import { createFileRoute } from "@tanstack/react-router";
import {
  ConsoleButton,
  DataTable,
  DemoNote,
  FilterBar,
  KeyValue,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
import { workforceRequests } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

const statuses = ["draft", "submitted", "under_review", "approved", "recruiting", "partially_filled", "filled", "closed"];

export const Route = createFileRoute("/hr/workforce-requests")({
  head: () => ({
    meta: [
      { title: "Workforce Requests — WoCOS HR" },
      {
        name: "description",
        content:
          "Raise, review and approve client workforce requests, then activate vacancies and assign recruiters across the TeamAce workforce.",
      },
      { property: "og:title", content: "Workforce Requests — WoCOS HR" },
      { property: "og:description", content: "From client request to vacancy activation." },
    ],
  }),
  component: WorkforceRequestsPage,
});

function WorkforceRequestsPage() {
  const selected = workforceRequests[1];

  return (
    <>
      <PageHeader
        section="Talent"
        title="Workforce Requests"
        subtitle="18 requests this quarter · 26 positions requested · 3 awaiting your approval"
        actions={
          <>
            <ConsoleButton>Save Draft</ConsoleButton>
            <ConsoleButton variant="primary">+ New Request</ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Awaiting Approval" value={3} note="oldest 2 days" tone="warning" />
        <StatTile label="Recruiting" value={6} note="26 positions" tone="info" />
        <StatTile label="Partially Filled" value={2} note="9 of 14 filled" tone="warning" />
        <StatTile label="Filled This Month" value={7} note="avg 24 days" tone="success" />
      </div>

      <Panel
        title="All Requests"
        meta={`${workforceRequests.length} shown`}
        bodyClassName="space-y-3 p-4"
        action={<ConsoleButton className="h-8 px-2.5 text-[11px]">Saved view: Open</ConsoleButton>}
      >
        <FilterBar filters={["All", ...statuses.slice(0, 5).map(labelize)]} />
        <DataTable
          columns={["Request", "Client", "Role", "Qty", "Location", "Priority", "Recruiter", "Target Start", "Status"]}
          rows={workforceRequests.map((r) => [
            <span className="data-cell text-[11px] text-sky">{r.id}</span>,
            r.client,
            <span className="text-fg">{r.title}</span>,
            <span className="data-cell">{r.quantity}</span>,
            <span className="text-dim">{r.location}</span>,
            <StatusBadge status={r.priority} />,
            <span className="text-dim">{r.recruiter}</span>,
            <span className="data-cell text-[11px] text-dim">{r.target_start}</span>,
            <StatusBadge status={r.status} />,
          ])}
        />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title={`Request ${selected.id}`} meta="detail" className="lg:col-span-2">
          <KeyValue
            rows={[
              { k: "Client", v: selected.client },
              { k: "Job title", v: selected.title },
              { k: "Quantity", v: `${selected.quantity} positions` },
              { k: "Location", v: selected.location },
              { k: "Employment type", v: selected.employment_type },
              { k: "Experience", v: selected.experience },
              { k: "Salary budget", v: <span className="data-cell">{selected.salary_budget}</span> },
              { k: "Target start date", v: <span className="data-cell">{selected.target_start}</span> },
              { k: "Assigned recruiter", v: selected.recruiter },
              { k: "Priority", v: <StatusBadge status={selected.priority} /> },
              {
                k: "Required skills",
                v: (
                  <span className="flex flex-wrap justify-end gap-1">
                    {selected.skills.map((s) => (
                      <span key={s} className="rounded bg-panel2 px-1.5 py-0.5 font-mono text-[10px] text-dim ring-1 ring-line">
                        {s}
                      </span>
                    ))}
                  </span>
                ),
              },
              { k: "Documents", v: <span className="text-dim">Job spec · Client SLA · Site profile</span> },
            ]}
          />
          <p className="mt-3 text-[12.5px] leading-relaxed text-dim">
            Supervise inbound and outbound goods flow across two Lagos hubs, lead a team of 9 handlers, own daily cycle
            counts and enforce site safety procedures. Reports to the client operations supervisor.
          </p>
        </Panel>

        <Panel title="Workflow Actions">
          <div className="space-y-2">
            {["Submit", "Approve", "Reject", "Assign recruiter", "Activate vacancy"].map((a, i) => (
              <button
                key={a}
                type="button"
                className={
                  i === 4
                    ? "w-full rounded-md bg-teal px-3 py-2 text-left text-[12.5px] font-semibold text-ink ring-1 ring-teal"
                    : "w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
                }
              >
                {a}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-md bg-panel2 p-3 ring-1 ring-line">
            <div className="console-label">Automation</div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-dim">
              On approval, a vacancy is created automatically and the assigned recruiter is notified.
            </p>
          </div>
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
