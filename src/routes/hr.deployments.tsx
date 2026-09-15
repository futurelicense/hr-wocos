import { createFileRoute } from "@tanstack/react-router";
import {
  ConsoleButton,
  DataTable,
  DemoNote,
  FilterBar,
  KeyValue,
  PageHeader,
  Panel,
  Progress,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
import { clients, deployments } from "@/lib/hr/data";

export const Route = createFileRoute("/hr/deployments")({
  head: () => ({
    meta: [
      { title: "Client Deployments — WoCOS HR" },
      {
        name: "description",
        content:
          "Deploy, transfer, replace, extend or end client assignments across every site, with supervisor and contract detail per deployment.",
      },
      { property: "og:title", content: "Client Deployments — WoCOS HR" },
      { property: "og:description", content: "Assignment control across six clients and five sites." },
    ],
  }),
  component: DeploymentsPage,
});

function DeploymentsPage() {
  const focus = deployments[1]!;

  return (
    <>
      <PageHeader
        section="Workforce"
        title="Client Deployments"
        subtitle="172 active assignments · 6 clients · 12 contracts expiring within 30 days"
        actions={
          <>
            <ConsoleButton>Transfer</ConsoleButton>
            <ConsoleButton variant="primary">Deploy Employee</ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Active Deployments" value={172} note="+7 this month" tone="success" />
        <StatTile label="Ready to Deploy" value={7} note="3 start Monday" tone="info" />
        <StatTile label="Reassignments" value={2} note="client requested" tone="warning" />
        <StatTile label="Ending Soon" value={12} note="within 30 days" tone="warning" />
      </div>

      <Panel title="Client Summary" meta="headcount vs open positions">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((c) => (
            <div key={c.name} className="console-inset p-3">
              <div className="flex items-start justify-between gap-2">
                <span>
                  <span className="block text-[13px] font-medium text-fg">{c.name}</span>
                  <span className="block font-mono text-[10px] text-mute">{c.locations.join(" · ")}</span>
                </span>
                <span className="numeral text-[20px]">{c.headcount}</span>
              </div>
              <div className="mt-3">
                <Progress value={(c.headcount / 68) * 100} />
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-mute">
                <span>{c.vacancies} open positions</span>
                <span className="text-teal">deployed</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <FilterBar filters={["All", "Deployed", "Reassignment", "On Leave", "Exiting", "Suspended"]} />

      <Panel title="Deployment Board" meta={`${deployments.length} shown`}>
        <DataTable
          columns={["Employee", "Client", "Department", "Location", "Supervisor", "Start", "End", "Contract", "Status"]}
          rows={deployments.map((d) => [
            <span className="text-fg">{d.employee}</span>,
            <span className="text-dim">{d.client}</span>,
            d.department,
            <span className="text-dim">{d.location}</span>,
            <span className="text-dim">{d.supervisor}</span>,
            <span className="data-cell text-[11px]">{d.start}</span>,
            <span className="data-cell text-[11px]">{d.end}</span>,
            d.contract,
            <StatusBadge status={d.status} />,
          ])}
        />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title={`Deployment · ${focus.employee}`} meta={focus.client} className="lg:col-span-2">
          <KeyValue
            rows={[
              { k: "Client", v: focus.client },
              { k: "Department", v: focus.department },
              { k: "Location", v: focus.location },
              { k: "Supervisor", v: focus.supervisor },
              { k: "Contract type", v: focus.contract },
              { k: "Start date", v: <span className="data-cell text-[11px]">{focus.start}</span> },
              { k: "End date", v: <span className="data-cell text-[11px]">{focus.end}</span> },
              { k: "Deployment status", v: <StatusBadge status={focus.status} /> },
            ]}
          />
        </Panel>

        <Panel title="Assignment Actions">
          <div className="space-y-2">
            {["Deploy employee", "Transfer employee", "Replace employee", "Extend assignment", "End assignment"].map(
              (a, i) => (
                <button
                  key={a}
                  type="button"
                  className={
                    i === 0
                      ? "w-full rounded-md bg-teal px-3 py-2 text-left text-[12.5px] font-semibold text-ink ring-1 ring-teal"
                      : "w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
                  }
                >
                  {a}
                </button>
              ),
            )}
          </div>
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
