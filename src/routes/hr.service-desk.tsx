import { createFileRoute } from "@tanstack/react-router";
import {
  BarList,
  ConsoleButton,
  DataTable,
  DemoNote,
  FilterBar,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
import { serviceDeskTickets } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

export const Route = createFileRoute("/hr/service-desk")({
  head: () => ({
    meta: [
      { title: "HR Service Desk — WoCOS HR" },
      {
        name: "description",
        content:
          "Employee HR cases across payroll, benefits, leave, contracts and workplace concerns, with priority, SLA and escalation tracking.",
      },
      { property: "og:title", content: "HR Service Desk — WoCOS HR" },
      { property: "og:description", content: "Employee HR cases with SLA and escalation tracking." },
    ],
  }),
  component: ServiceDeskPage,
});

function ServiceDeskPage() {
  return (
    <>
      <PageHeader
        section="HR Operations"
        title="HR Service Desk"
        subtitle="19 open cases · 3 overdue and auto-escalated · avg resolution 2.6 days"
        actions={
          <>
            <ConsoleButton>Overdue (3)</ConsoleButton>
            <ConsoleButton variant="primary">+ Log Case</ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Open" value={6} note="2 unassigned" tone="warning" />
        <StatTile label="Assigned" value={5} note="in queue" tone="info" />
        <StatTile label="Investigating" value={4} note="with HR" tone="warning" />
        <StatTile label="Awaiting Response" value={4} note="employee side" tone="warning" />
        <StatTile label="Resolved (30d)" value={41} note="94% in SLA" tone="success" />
        <StatTile label="Critical" value={1} note="workplace concern" tone="danger" />
      </div>

      <FilterBar filters={["All", "Open", "Assigned", "Investigating", "Awaiting Response", "Resolved"]} />

      <Panel title="Case Register" meta={`${serviceDeskTickets.length} shown`}>
        <DataTable
          columns={["Case", "Employee", "Category", "Subject", "Priority", "Age", "Status"]}
          rows={serviceDeskTickets.map((t) => [
            <span className="data-cell text-[11px] text-sky">{t.id}</span>,
            <span className="text-fg">{t.employee}</span>,
            <span className="text-dim">{labelize(t.category)}</span>,
            t.subject,
            <StatusBadge status={t.priority} />,
            <span className="data-cell text-[11px]">{t.age}</span>,
            <StatusBadge status={t.status} />,
          ])}
        />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Cases by Category" meta="last 30 days">
          <BarList
            items={[
              { label: "Payroll issue", value: 14 },
              { label: "Benefits", value: 9 },
              { label: "Leave", value: 8 },
              { label: "Contract", value: 6 },
              { label: "Document request", value: 5 },
              { label: "Workplace concern", value: 3 },
              { label: "Manager issue", value: 2 },
              { label: "General HR", value: 4 },
            ]}
            tone="info"
          />
        </Panel>

        <Panel title="Escalations">
          <p className="text-[12.5px] leading-relaxed text-dim">
            Cases that pass their SLA are escalated automatically to the HR Manager and appear in Attention Required on
            the command center.
          </p>
          <ul className="mt-3 space-y-2">
            {serviceDeskTickets
              .filter((t) => Number.parseInt(t.age) >= 5)
              .map((t) => (
                <li key={t.id} className="rounded-md bg-amber/8 p-3 ring-1 ring-amber/25">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12.5px] text-fg">{t.subject}</span>
                    <StatusBadge status="escalated" tone="warning" />
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-mute">
                    {t.id} · {t.employee} · open {t.age}
                  </p>
                </li>
              ))}
          </ul>
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
