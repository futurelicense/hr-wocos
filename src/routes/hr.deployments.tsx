import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { clients, deployments } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

type Deployment = (typeof deployments)[number];
type PendingAction = { title: string; description: string; onConfirm: () => void } | null;

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
      {
        property: "og:description",
        content: "Assignment control across six clients and five sites.",
      },
    ],
  }),
  component: DeploymentsPage,
});

function DeploymentsPage() {
  const [rows, setRows] = useState<Deployment[]>(() => deployments);
  const [filter, setFilter] = useState("All");
  const [focusEmployee, setFocusEmployee] = useState(deployments[1]!.employee);
  const [pending, setPending] = useState<PendingAction>(null);
  const focus = rows.find((d) => d.employee === focusEmployee) ?? rows[0]!;
  const filtered = filter === "All" ? rows : rows.filter((d) => labelize(d.status) === filter);

  const updateFocus = (updater: (d: Deployment) => Deployment) => {
    setRows((prev) => prev.map((d) => (d.employee === focus.employee ? updater(d) : d)));
  };

  const deployEmployee = () => {
    if (focus.status === "deployed") {
      toast.info(`${focus.employee} is already deployed`);
      return;
    }
    updateFocus((d) => ({ ...d, status: "deployed" }));
    toast.success(`${focus.employee} deployed`, { description: focus.client });
  };

  const transferEmployee = () => {
    updateFocus((d) => ({ ...d, status: "reassignment" }));
    toast.success(`${focus.employee} flagged for transfer`, { description: focus.client });
  };

  const replaceEmployee = () => {
    setPending({
      title: "Replace employee?",
      description: `${focus.employee}'s assignment at ${focus.client} will be ended and marked for replacement.`,
      onConfirm: () => {
        updateFocus((d) => ({ ...d, status: "exiting" }));
        toast.success(`Replacement initiated for ${focus.employee}`);
      },
    });
  };

  const extendAssignment = () => {
    const nextEnd = new Date(focus.end);
    nextEnd.setFullYear(nextEnd.getFullYear() + 1);
    const formatted = nextEnd.toISOString().slice(0, 10);
    updateFocus((d) => ({ ...d, end: formatted }));
    toast.success(`Assignment extended to ${formatted}`, { description: focus.employee });
  };

  const endAssignment = () => {
    setPending({
      title: "End assignment?",
      description: `${focus.employee}'s deployment at ${focus.client} will be ended.`,
      onConfirm: () => {
        updateFocus((d) => ({ ...d, status: "exiting" }));
        toast.success(`Assignment ended for ${focus.employee}`);
      },
    });
  };

  const assignmentActions: Record<string, () => void> = {
    "Deploy employee": deployEmployee,
    "Transfer employee": transferEmployee,
    "Replace employee": replaceEmployee,
    "Extend assignment": extendAssignment,
    "End assignment": endAssignment,
  };

  return (
    <>
      <PageHeader
        section="Workforce"
        title="Client Deployments"
        subtitle="172 active assignments · 6 clients · 12 contracts expiring within 30 days"
        actions={
          <>
            <ConsoleButton onClick={transferEmployee}>Transfer</ConsoleButton>
            <ConsoleButton variant="primary" onClick={deployEmployee}>
              Deploy Employee
            </ConsoleButton>
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
                  <span className="block font-mono text-[10px] text-mute">
                    {c.locations.join(" · ")}
                  </span>
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

      <FilterBar
        filters={["All", "Deployed", "Reassignment", "On Leave", "Exiting", "Suspended"]}
        value={filter}
        onChange={setFilter}
      />

      <Panel title="Deployment Board" meta={`${filtered.length} shown`}>
        <DataTable
          columns={[
            "Employee",
            "Client",
            "Department",
            "Location",
            "Supervisor",
            "Start",
            "End",
            "Contract",
            "Status",
          ]}
          rows={filtered.map((d) => [
            <button
              type="button"
              onClick={() => setFocusEmployee(d.employee)}
              className={
                d.employee === focus.employee
                  ? "text-teal hover:underline"
                  : "text-fg hover:underline"
              }
            >
              {d.employee}
            </button>,
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
        <Panel
          title={`Deployment · ${focus.employee}`}
          meta={focus.client}
          className="lg:col-span-2"
        >
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
            {[
              "Deploy employee",
              "Transfer employee",
              "Replace employee",
              "Extend assignment",
              "End assignment",
            ].map((a, i) => (
              <button
                key={a}
                type="button"
                onClick={assignmentActions[a]}
                className={
                  i === 0
                    ? "w-full rounded-md bg-teal px-3 py-2 text-left text-[12.5px] font-semibold text-ink ring-1 ring-teal"
                    : "w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
                }
              >
                {a}
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <DemoNote />

      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pending?.title}</AlertDialogTitle>
            <AlertDialogDescription>{pending?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => pending?.onConfirm()}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
