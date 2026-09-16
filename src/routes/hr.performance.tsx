import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ConsoleButton,
  DataTable,
  DemoNote,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { performanceReviews } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

const cycle = [
  "objectives_set",
  "check_in",
  "manager_review",
  "employee_feedback",
  "final_review",
  "development_plan",
];

const modules = [
  { id: "probation_reviews", label: "Probation reviews", count: 8, status: "in_progress" },
  { id: "performance_reviews", label: "Performance reviews", count: 52, status: "in_progress" },
  { id: "objectives", label: "Objectives", count: 214, status: "active" },
  { id: "kpis", label: "KPIs", count: 46, status: "active" },
  { id: "client_feedback", label: "Client feedback", count: 31, status: "active" },
  { id: "improvement_plans", label: "Improvement plans", count: 4, status: "under_review" },
  { id: "development_actions", label: "Development actions", count: 27, status: "active" },
];

export const Route = createFileRoute("/hr/performance")({
  head: () => ({
    meta: [
      { title: "Performance — WoCOS HR" },
      {
        name: "description",
        content:
          "Probation and performance reviews, objectives, KPIs, client feedback, improvement plans and development actions across the deployed workforce.",
      },
      { property: "og:title", content: "Performance — WoCOS HR" },
      { property: "og:description", content: "Review cycles, objectives and client feedback." },
    ],
  }),
  component: PerformancePage,
});

function PerformancePage() {
  const [activePhase, setActivePhase] = useState(2);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cadence, setCadence] = useState("Bi-annual");
  const [reminderDays, setReminderDays] = useState(5);

  const advanceCycle = () => {
    setConfirmOpen(false);
    if (activePhase >= cycle.length - 1) {
      toast.info("Review cycle already at final phase");
      return;
    }
    const nextPhase = activePhase + 1;
    setActivePhase(nextPhase);
    toast.success(`Cycle advanced to ${labelize(cycle[nextPhase]!)}`, {
      description: "52 reviews moved forward",
    });
  };

  const saveSettings = () => {
    setSettingsOpen(false);
    toast.success("Cycle settings saved", {
      description: `${cadence} · reminders ${reminderDays}d before due`,
    });
  };

  return (
    <>
      <PageHeader
        section="HR Operations"
        title="Performance"
        subtitle="H2 2026 cycle · 52 reviews in flight · 8 probation checks · avg rating 4.1"
        actions={
          <>
            <ConsoleButton onClick={() => setSettingsOpen(true)}>Cycle settings</ConsoleButton>
            <ConsoleButton variant="primary" onClick={() => setConfirmOpen(true)}>
              Start Review Cycle
            </ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Reviews In Flight" value={52} note="H2 2026" tone="info" />
        <StatTile label="Probation Checks" value={8} note="2 due this week" tone="warning" />
        <StatTile label="Improvement Plans" value={4} note="2 new" tone="danger" />
        <StatTile label="Avg Rating" value="4.1" note="of 5.0" tone="success" />
      </div>

      <Panel title="Review Cycle" meta="6 phases" bodyClassName="p-4">
        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {cycle.map((phase, i) => (
            <div key={phase} className="console-inset p-2.5">
              <div className="flex items-center justify-between">
                <span className="data-cell text-[10px] text-mute">0{i + 1}</span>
                <StatusBadge
                  status={
                    i < activePhase
                      ? "completed"
                      : i === activePhase
                        ? "in_progress"
                        : "not_started"
                  }
                />
              </div>
              <div className="mt-2 text-[12px] text-fg">{labelize(phase)}</div>
              <div className="mt-2">
                <Progress
                  value={i < activePhase ? 100 : i === activePhase ? 54 : 0}
                  tone={i < activePhase ? "success" : "warning"}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel
          title="Active Reviews"
          meta={`${performanceReviews.length} shown`}
          className="lg:col-span-2"
        >
          <DataTable
            columns={["Employee", "Client", "Cycle", "Phase", "Objectives", "Rating", "Status"]}
            rows={performanceReviews.map((r) => [
              <span className="text-fg">{r.employee}</span>,
              <span className="text-dim">{r.client}</span>,
              r.cycle,
              <span className="text-dim">{labelize(r.stage)}</span>,
              <span className="data-cell">{r.objectives}</span>,
              <span className="data-cell text-teal">{r.rating}</span>,
              <StatusBadge status={r.status} />,
            ])}
          />
        </Panel>

        <Panel title="Modules">
          <ul className="space-y-1.5">
            {modules.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 border-b border-line/60 py-1.5 text-[12.5px] last:border-0"
              >
                <span>{m.label}</span>
                <span className="flex items-center gap-2">
                  <span className="data-cell text-[11px] text-dim">{m.count}</span>
                  <StatusBadge status={m.status} />
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <DemoNote />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Advance the review cycle?</AlertDialogTitle>
            <AlertDialogDescription>
              All 52 in-flight reviews move from {labelize(cycle[activePhase]!)} to{" "}
              {activePhase < cycle.length - 1 ? labelize(cycle[activePhase + 1]!) : "completion"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={advanceCycle}>Advance</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cycle settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-2.5">
            <label className="block text-[12px] text-dim">
              Cadence
              <select
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
                className="mt-1 h-9 w-full rounded-md bg-panel2 px-3 text-[13px] text-fg ring-1 ring-line outline-none focus:ring-teal/50"
              >
                <option>Quarterly</option>
                <option>Bi-annual</option>
                <option>Annual</option>
              </select>
            </label>
            <label className="block text-[12px] text-dim">
              Reminder (days before due)
              <input
                type="number"
                min={1}
                max={30}
                value={reminderDays}
                onChange={(e) => setReminderDays(Number(e.target.value))}
                className="mt-1 h-9 w-full rounded-md bg-panel2 px-3 text-[13px] text-fg ring-1 ring-line outline-none focus:ring-teal/50"
              />
            </label>
          </div>
          <DialogFooter>
            <ConsoleButton variant="primary" onClick={saveSettings}>
              Save
            </ConsoleButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
