import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { serviceDeskTickets as initialTickets } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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
      {
        property: "og:description",
        content: "Employee HR cases with SLA and escalation tracking.",
      },
    ],
  }),
  component: ServiceDeskPage,
});

function ServiceDeskPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [filter, setFilter] = useState("All");
  const [newCaseOpen, setNewCaseOpen] = useState(false);
  const [employee, setEmployee] = useState("");
  const [subject, setSubject] = useState("");

  const filtered = tickets.filter((t) => filter === "All" || labelize(t.status) === filter);
  const overdue = tickets.filter((t) => Number.parseInt(t.age) >= 5);

  function logCase(e: FormEvent) {
    e.preventDefault();
    if (!employee.trim() || !subject.trim()) return;
    const id = `HR-${7700 + tickets.length + 20}`;
    setTickets((prev) => [
      {
        id,
        employee: employee.trim(),
        category: "general_hr",
        subject: subject.trim(),
        priority: "medium",
        status: "open",
        age: "0d",
      },
      ...prev,
    ]);
    setEmployee("");
    setSubject("");
    setNewCaseOpen(false);
    toast.success(`Case ${id} logged`, { description: subject.trim() });
  }

  return (
    <>
      <PageHeader
        section="HR Operations"
        title="HR Service Desk"
        subtitle="19 open cases · 3 overdue and auto-escalated · avg resolution 2.6 days"
        actions={
          <>
            <ConsoleButton onClick={() => setFilter(overdue.length ? "Open" : "All")}>
              Overdue (3)
            </ConsoleButton>
            <ConsoleButton variant="primary" onClick={() => setNewCaseOpen(true)}>
              + Log Case
            </ConsoleButton>
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

      <FilterBar
        filters={["All", "Open", "Assigned", "Investigating", "Awaiting Response", "Resolved"]}
        value={filter}
        onChange={setFilter}
      />

      <Panel
        title="Case Register"
        meta={`${filtered.length} shown`}
        action={
          <ConsoleButton
            className="h-8 px-2.5 text-[11px]"
            onClick={() => {
              downloadCsv("hr-service-desk-cases.csv", [
                ["Case", "Employee", "Category", "Subject", "Priority", "Age", "Status"],
                ...filtered.map((t) => [
                  t.id,
                  t.employee,
                  labelize(t.category),
                  t.subject,
                  t.priority,
                  t.age,
                  t.status,
                ]),
              ]);
              toast.success(`Exported ${filtered.length} cases`);
            }}
          >
            Export
          </ConsoleButton>
        }
      >
        <DataTable
          columns={["Case", "Employee", "Category", "Subject", "Priority", "Age", "Status"]}
          rows={filtered.map((t) => [
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
            Cases that pass their SLA are escalated automatically to the HR Manager and appear in
            Attention Required on the command center.
          </p>
          <ul className="mt-3 space-y-2">
            {overdue.map((t) => (
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

      <Dialog open={newCaseOpen} onOpenChange={setNewCaseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log a new HR case</DialogTitle>
            <DialogDescription>
              Adds a case to the register (demo data, local only).
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-3" onSubmit={logCase}>
            <label className="block space-y-1 text-[12px] text-dim">
              <span>Employee</span>
              <input
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="h-9 w-full rounded-md bg-panel2 px-3 text-[12.5px] text-fg ring-1 ring-line outline-none focus:ring-teal/40"
                required
              />
            </label>
            <label className="block space-y-1 text-[12px] text-dim">
              <span>Subject</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-9 w-full rounded-md bg-panel2 px-3 text-[12.5px] text-fg ring-1 ring-line outline-none focus:ring-teal/40"
                required
              />
            </label>
            <DialogFooter>
              <ConsoleButton variant="primary" type="submit">
                Log case
              </ConsoleButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
