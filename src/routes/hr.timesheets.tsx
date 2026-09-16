import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ConsoleButton,
  DataTable,
  DemoNote,
  FilterBar,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
import { labelize } from "@/lib/hr/status";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { timesheets as initialTimesheets } from "@/lib/hr/data";

const FILTERS = ["All", "Submitted", "Pending Approval", "Approved", "Rejected", "Locked"];

export const Route = createFileRoute("/hr/timesheets")({
  head: () => ({
    meta: [
      { title: "Timesheets — WoCOS HR" },
      {
        name: "description",
        content:
          "Submit, query, approve and lock timesheets by period. Approved timesheets mark payroll inputs ready automatically.",
      },
      { property: "og:title", content: "Timesheets — WoCOS HR" },
      {
        property: "og:description",
        content: "Period timesheet approval feeding payroll readiness.",
      },
    ],
  }),
  component: TimesheetsPage,
});

function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState(() => initialTimesheets);
  const [filter, setFilter] = useState("All");
  const [queryOpen, setQueryOpen] = useState(false);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    return timesheets.filter((t) => {
      if (filter !== "All" && labelize(t.status) !== filter) return false;
      if (
        query.trim() &&
        !`${t.employee} ${t.id}`.toLowerCase().includes(query.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [timesheets, filter, query]);

  const approveBatch = () => {
    const approvable = timesheets.filter(
      (t) => t.status === "submitted" || t.status === "pending_approval",
    );
    if (approvable.length === 0) {
      toast.info("Nothing to approve", { description: "No timesheets are awaiting approval" });
      return;
    }
    setTimesheets((prev) =>
      prev.map((t) =>
        t.status === "submitted" || t.status === "pending_approval"
          ? { ...t, status: "approved" }
          : t,
      ),
    );
    toast.success(`Approved ${approvable.length} timesheet${approvable.length === 1 ? "" : "s"}`, {
      description: "Payroll inputs marked ready",
    });
  };

  return (
    <>
      <PageHeader
        section="Workforce"
        title="Timesheets"
        subtitle="Period 01–14 Sep 2026 · 172 submitted · 1 pending your approval"
        actions={
          <>
            <ConsoleButton onClick={() => setQueryOpen(true)}>Query</ConsoleButton>
            <ConsoleButton variant="primary" onClick={approveBatch}>
              Approve Batch
            </ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Draft" value={4} note="not submitted" tone="neutral" />
        <StatTile label="Submitted" value={11} note="awaiting review" tone="warning" />
        <StatTile label="Pending Approval" value={9} note="supervisor queue" tone="warning" />
        <StatTile label="Approved" value={142} note="payroll ready" tone="success" />
        <StatTile label="Rejected" value={3} note="resubmission needed" tone="danger" />
        <StatTile label="Locked" value={7} note="period closed" tone="success" />
      </div>

      <FilterBar filters={FILTERS} value={filter} onChange={setFilter} />

      <Panel title="Timesheet Register" meta={`${rows.length} of ${timesheets.length}`}>
        <DataTable
          columns={["Timesheet", "Employee", "Client", "Period", "Hours", "Overtime", "Status"]}
          rows={rows.map((t) => [
            <span className="data-cell text-[11px] text-sky">{t.id}</span>,
            <span className="text-fg">{t.employee}</span>,
            <span className="text-dim">{t.client}</span>,
            <span className="data-cell text-[11px]">{t.period}</span>,
            <span className="data-cell">{t.hours}</span>,
            <span className="data-cell">{t.overtime}</span>,
            <StatusBadge status={t.status} />,
          ])}
        />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Approval Workflow">
          <ol className="space-y-2 text-[12.5px]">
            {[
              ["Employee submits", "approved"],
              ["Client supervisor approves", "approved"],
              ["HR review", "pending"],
              ["Locked for payroll", "not_started"],
            ].map((row, i) => (
              <li
                key={row[0]}
                className="flex items-center justify-between gap-3 border-b border-line/60 py-1.5 last:border-0"
              >
                <span className="flex items-center gap-2.5">
                  <span className="data-cell text-[10px] text-mute">0{i + 1}</span>
                  {row[0]}
                </span>
                <StatusBadge status={row[1]!} />
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Automation">
          <p className="text-[12.5px] leading-relaxed text-dim">
            When a timesheet is approved, the matching payroll input is marked ready and appears in
            Payroll Operations. Rejected timesheets block payroll readiness until resubmitted and
            approved.
          </p>
          <div className="mt-3 rounded-md bg-panel2 p-3 ring-1 ring-line">
            <div className="console-label">Blocking payroll now</div>
            <p className="mt-1.5 text-[12px] text-dim">
              TS-8836 · Chioma Nnaji — rejected and not resubmitted.
            </p>
          </div>
        </Panel>
      </div>

      <DemoNote />

      <Dialog open={queryOpen} onOpenChange={setQueryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Query timesheets</DialogTitle>
          </DialogHeader>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by employee or timesheet ID…"
            className="h-9 w-full rounded-md bg-panel2 px-3 text-[13px] text-fg ring-1 ring-line outline-none focus:ring-teal/50"
          />
          <DialogFooter>
            <ConsoleButton
              variant="primary"
              onClick={() => {
                setQueryOpen(false);
                toast.info(query.trim() ? `Filtered to "${query.trim()}"` : "Query cleared");
              }}
            >
              Apply
            </ConsoleButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
