import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ConsoleButton,
  DataTable,
  DemoNote,
  FilterBar,
  PageHeader,
  Panel,
  Progress,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { leaveBalances, leaveRequests as initialLeaveRequests } from "@/lib/hr/data";

const VIEWS = ["Requests", "Calendar", "Balances"];
const LEAVE_TYPES = ["Annual", "Sick", "Compassionate", "Study", "Maternity"];

export const Route = createFileRoute("/hr/leave")({
  head: () => ({
    meta: [
      { title: "Leave — WoCOS HR" },
      {
        name: "description",
        content:
          "Leave requests, calendar coverage and balances with an employee to supervisor to HR approval workflow across all client sites.",
      },
      { property: "og:title", content: "Leave — WoCOS HR" },
      { property: "og:description", content: "Leave requests, coverage calendar and balances." },
    ],
  }),
  component: LeavePage,
});

const calendar = [
  { employee: "Musa Danjuma", days: [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0] },
  { employee: "Grace Umeh", days: [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0] },
  { employee: "Chioma Nnaji", days: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3] },
  { employee: "Daniel Aluko", days: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
];

export function LeaveCalendar() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[620px] space-y-1.5">
        <div className="flex gap-1 pl-32">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} className="w-6 text-center font-mono text-[9px] text-mute">
              {i + 10}
            </span>
          ))}
        </div>
        {calendar.map((row) => (
          <div key={row.employee} className="flex items-center gap-1">
            <span className="w-32 shrink-0 truncate pr-2 text-[12px] text-dim">{row.employee}</span>
            {row.days.map((d, i) => (
              <span
                key={i}
                className={
                  d === 1
                    ? "h-5 w-6 rounded-sm bg-teal/70"
                    : d === 2
                      ? "h-5 w-6 rounded-sm bg-amber/70"
                      : d === 3
                        ? "h-5 w-6 rounded-sm bg-sky/70"
                        : "h-5 w-6 rounded-sm bg-line/60"
                }
              />
            ))}
          </div>
        ))}
        <div className="flex gap-4 pt-2 pl-32 font-mono text-[10px] text-mute">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-teal" />
            Approved
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-amber" />
            HR review
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-sky" />
            Manager review
          </span>
        </div>
      </div>
    </div>
  );
}

function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState(() => initialLeaveRequests);
  const [view, setView] = useState<string>(VIEWS[0]!);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState({ employee: "", type: LEAVE_TYPES[0]!, from: "", to: "" });

  const submitRequest = () => {
    if (!form.employee.trim() || !form.from || !form.to) {
      toast.error("Employee, from and to dates are required");
      return;
    }
    const id = `LV-${600 + leaveRequests.length + 1}`;
    const from = new Date(form.from);
    const to = new Date(form.to);
    const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1);
    setLeaveRequests((prev) => [
      {
        id,
        employee: form.employee.trim(),
        type: form.type,
        from: form.from,
        to: form.to,
        days,
        status: "submitted",
      },
      ...prev,
    ]);
    setNewOpen(false);
    setForm({ employee: "", type: LEAVE_TYPES[0]!, from: "", to: "" });
    setView("Requests");
    toast.success(`Leave request ${id} submitted`, {
      description: `${form.employee} · ${days} day(s)`,
    });
  };

  return (
    <>
      <PageHeader
        section="Workforce"
        title="Leave"
        subtitle="12 employees on leave today · 3 requests awaiting review · 2 coverage conflicts"
        actions={
          <>
            <ConsoleButton onClick={() => setView("Calendar")}>Calendar</ConsoleButton>
            <ConsoleButton variant="primary" onClick={() => setNewOpen(true)}>
              + New Request
            </ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="On Leave Today" value={12} note="9 annual" tone="warning" />
        <StatTile label="Manager Review" value={1} note="Bluewave Retail" tone="warning" />
        <StatTile label="HR Review" value={1} note="sick leave" tone="warning" />
        <StatTile label="Approved (30d)" value={28} note="92% within SLA" tone="success" />
      </div>

      <FilterBar filters={VIEWS} value={view} onChange={setView} />

      {view === "Requests" ? (
        <Panel title="Leave Requests" meta={`${leaveRequests.length} records`}>
          <DataTable
            columns={["Request", "Employee", "Type", "From", "To", "Days", "Status"]}
            rows={leaveRequests.map((l) => [
              <span className="data-cell text-[11px] text-sky">{l.id}</span>,
              <span className="text-fg">{l.employee}</span>,
              l.type,
              <span className="data-cell text-[11px]">{l.from}</span>,
              <span className="data-cell text-[11px]">{l.to}</span>,
              <span className="data-cell">{l.days}</span>,
              <StatusBadge status={l.status} />,
            ])}
          />
        </Panel>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-3">
        {view !== "Balances" ? (
          <Panel
            title="Coverage Calendar"
            meta="10 – 23 Sep"
            className={view === "Requests" ? "lg:col-span-2" : "lg:col-span-3"}
          >
            <LeaveCalendar />
          </Panel>
        ) : null}

        {view !== "Calendar" ? (
          <Panel
            title="Balances · Grace Umeh"
            bodyClassName="space-y-3 p-4"
            className={view === "Requests" ? "" : "lg:col-span-3"}
          >
            {leaveBalances.map((b) => (
              <div key={b.type}>
                <div className="mb-1.5 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-mute">{b.type}</span>
                  <span className="text-fg">
                    {b.balance} of {b.entitled} left
                  </span>
                </div>
                <Progress
                  value={(b.taken / b.entitled) * 100}
                  tone={b.balance === 0 ? "danger" : "success"}
                />
              </div>
            ))}
          </Panel>
        ) : null}
      </div>

      {view === "Requests" ? null : (
        <p className="font-mono text-[10px] tracking-[0.1em] text-mute uppercase">
          Focused view · {view}
        </p>
      )}

      <DemoNote />

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New leave request</DialogTitle>
          </DialogHeader>
          <div className="space-y-2.5">
            <input
              autoFocus
              value={form.employee}
              onChange={(e) => setForm((f) => ({ ...f, employee: e.target.value }))}
              placeholder="Employee name"
              className="h-9 w-full rounded-md bg-panel2 px-3 text-[13px] text-fg ring-1 ring-line outline-none focus:ring-teal/50"
            />
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="h-9 w-full rounded-md bg-panel2 px-3 text-[13px] text-fg ring-1 ring-line outline-none focus:ring-teal/50"
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="flex gap-2.5">
              <input
                type="date"
                value={form.from}
                onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                className="h-9 w-full rounded-md bg-panel2 px-3 text-[13px] text-fg ring-1 ring-line outline-none focus:ring-teal/50"
              />
              <input
                type="date"
                value={form.to}
                onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                className="h-9 w-full rounded-md bg-panel2 px-3 text-[13px] text-fg ring-1 ring-line outline-none focus:ring-teal/50"
              />
            </div>
          </div>
          <DialogFooter>
            <ConsoleButton variant="primary" onClick={submitRequest}>
              Submit request
            </ConsoleButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
