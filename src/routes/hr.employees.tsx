import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  BarList,
  ConsoleButton,
  DataTable,
  DemoNote,
  FilterBar,
  KeyValue,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
  Tabs,
  Timeline,
} from "@/components/hr/primitives";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clients, employees, locations } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

type Employee = (typeof employees)[number];

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const Route = createFileRoute("/hr/employees")({
  head: () => ({
    meta: [
      { title: "Employees — WoCOS HR" },
      {
        name: "description",
        content:
          "The TeamAce employee directory with a full Employee 360 record: assignment, documents, attendance, payroll, performance, leave and compliance.",
      },
      { property: "og:title", content: "Employees — WoCOS HR" },
      { property: "og:description", content: "186 employees with Employee 360 records." },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
  const [rows, setRows] = useState<Employee[]>(() => employees);
  const [filter, setFilter] = useState("All");
  const [clientScope, setClientScope] = useState("All");
  const [focusId, setFocusId] = useState(employees[0]!.id);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    client: clients[0]!.name,
    location: locations[0]!.name,
    manager: "",
  });
  const focus = rows.find((e) => e.id === focusId) ?? rows[0]!;

  const scoped = clientScope === "All" ? rows : rows.filter((e) => e.client === clientScope);
  const filtered = filter === "All" ? scoped : scoped.filter((e) => labelize(e.status) === filter);

  const exportDirectory = () => {
    downloadCsv("employee-directory.csv", [
      ["ID", "Name", "Role", "Client", "Location", "Status"],
      ...filtered.map((e) => [e.id, e.name, e.role, e.client, e.location, labelize(e.status)]),
    ]);
    toast.success(`Exported ${filtered.length} employee${filtered.length === 1 ? "" : "s"} to CSV`);
  };

  const addEmployee = () => {
    if (!form.name.trim() || !form.role.trim()) {
      toast.error("Name and role are required");
      return;
    }
    const initials = form.name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const id = `EMP-${10000 + rows.length + 1}`;
    const created: Employee = {
      id,
      name: form.name.trim(),
      initials,
      role: form.role.trim(),
      client: form.client,
      location: form.location,
      manager: form.manager.trim() || "Unassigned",
      start: new Date().toISOString().slice(0, 10),
      status: "active",
      contract: "Full-time · 12 months",
      compliance: "pending",
    };
    setRows((prev) => [created, ...prev]);
    setFocusId(id);
    setAddOpen(false);
    setForm({
      name: "",
      role: "",
      client: clients[0]!.name,
      location: locations[0]!.name,
      manager: "",
    });
    toast.success(`${created.name} added to the directory`, { description: id });
  };

  return (
    <>
      <PageHeader
        section="Workforce"
        title="Employees"
        subtitle="186 employees · 6 clients · 5 locations · 172 actively deployed"
        actions={
          <>
            <ConsoleButton onClick={exportDirectory}>Export directory</ConsoleButton>
            <ConsoleButton variant="primary" onClick={() => setAddOpen(true)}>
              + Add Employee
            </ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Active" value={168} note="90% of workforce" tone="success" />
        <StatTile label="On Leave" value={12} note="9 annual" tone="warning" />
        <StatTile label="Suspended" value={2} note="under review" tone="danger" />
        <StatTile label="Reassignment" value={2} note="pending client" tone="warning" />
        <StatTile label="Exiting" value={2} note="notice served" tone="danger" />
        <StatTile label="Exited (90d)" value={14} note="7.4% turnover" tone="neutral" />
      </div>

      <FilterBar
        filters={["All", "Active", "On Leave", "Suspended", "Reassignment", "Exiting"]}
        value={filter}
        onChange={setFilter}
        right={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ConsoleButton className="h-8 px-2.5 text-[11px]">
                Client: {clientScope}
              </ConsoleButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setClientScope("All")}>All</DropdownMenuItem>
              {clients.map((c) => (
                <DropdownMenuItem key={c.name} onClick={() => setClientScope(c.name)}>
                  {c.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <Panel title="Directory" meta={`${filtered.length} shown of 186`}>
        <DataTable
          columns={[
            "Employee",
            "Role",
            "Client",
            "Location",
            "Manager",
            "Start",
            "Contract",
            "Compliance",
            "Status",
          ]}
          rows={filtered.map((e) => [
            <button
              type="button"
              onClick={() => setFocusId(e.id)}
              className="flex items-center gap-2 text-left"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-panel2 font-mono text-[9px] ring-1 ring-line">
                {e.initials}
              </span>
              <span>
                <span className={e.id === focus.id ? "block text-teal" : "block text-fg"}>
                  {e.name}
                </span>
                <span className="data-cell block text-[10px] text-mute">{e.id}</span>
              </span>
            </button>,
            e.role,
            <span className="text-dim">{e.client}</span>,
            <span className="text-dim">{e.location}</span>,
            <span className="text-dim">{e.manager}</span>,
            <span className="data-cell text-[11px]">{e.start}</span>,
            <span className="text-dim">{e.contract}</span>,
            <StatusBadge status={e.compliance} />,
            <StatusBadge status={e.status} />,
          ])}
        />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Workforce by Client" meta="headcount">
          <BarList items={clients.map((c) => ({ label: c.name, value: c.headcount }))} />
        </Panel>
        <Panel title="Workforce by Location" meta="headcount">
          <BarList
            items={locations.map((l) => ({ label: l.name, value: l.headcount }))}
            tone="info"
          />
        </Panel>
      </div>

      <Panel
        title={`Employee 360 · ${focus.name}`}
        meta={focus.id}
        action={<StatusBadge status={focus.status} />}
        bodyClassName="space-y-4 p-4"
      >
        <Tabs
          tabs={[
            "overview",
            "assignment",
            "documents",
            "attendance",
            "timesheets",
            "payroll",
            "performance",
            "leave",
            "hr_requests",
            "compliance",
            "activity",
            "notes",
          ]}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="console-inset flex items-center gap-3 p-3">
              <span className="grid size-11 place-items-center rounded-full bg-teal/12 font-mono text-[13px] font-semibold text-teal ring-1 ring-teal/30">
                {focus.initials}
              </span>
              <span>
                <span className="font-display block text-[15px] font-semibold">{focus.name}</span>
                <span className="block font-mono text-[10px] text-mute">
                  {focus.role} · {focus.id}
                </span>
              </span>
            </div>
            <KeyValue
              rows={[
                { k: "Client assignment", v: focus.client },
                { k: "Deployment location", v: focus.location },
                { k: "Reporting manager", v: focus.manager },
                {
                  k: "Start date",
                  v: <span className="data-cell text-[11px]">{focus.start}</span>,
                },
                { k: "Contract", v: focus.contract },
                { k: "Compliance", v: <StatusBadge status={focus.compliance} /> },
                { k: "Employment status", v: <StatusBadge status={focus.status} /> },
              ]}
            />
          </div>

          <div className="space-y-3">
            <div className="console-label">Operational Snapshot</div>
            <KeyValue
              rows={[
                { k: "Attendance (30d)", v: "97.8% present" },
                { k: "Timesheet", v: <StatusBadge status="approved" /> },
                { k: "Payroll input", v: <StatusBadge status="ready" /> },
                { k: "Leave balance", v: <span className="data-cell">18 days</span> },
                { k: "Open HR requests", v: <span className="data-cell">0</span> },
                { k: "Performance cycle", v: "Probation · check-in" },
                { k: "Documents", v: "14 on file · all current" },
              ]}
            />
          </div>

          <div>
            <div className="console-label mb-2">Activity</div>
            <Timeline
              items={[
                { time: "14 Sep 09:38", text: "Activated as employee EMP-10442", actor: "System" },
                {
                  time: "14 Sep 09:38",
                  text: "Client assignment created · ABC Company",
                  actor: "System",
                },
                { time: "12 Sep 16:02", text: "Onboarding completed", actor: "HR Admin" },
                { time: "10 Sep 11:20", text: "Offer accepted", actor: "Candidate" },
                { time: "05 Sep 09:10", text: "Verification cleared", actor: "V. Officer" },
              ]}
            />
          </div>
        </div>
      </Panel>

      <DemoNote />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add employee</DialogTitle>
            <DialogDescription>Creates a new record directly in the directory.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="emp-name">Full name</Label>
              <Input
                id="emp-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-role">Role</Label>
              <Input
                id="emp-role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emp-manager">Reporting manager</Label>
              <Input
                id="emp-manager"
                value={form.manager}
                onChange={(e) => setForm({ ...form, manager: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <ConsoleButton onClick={() => setAddOpen(false)}>Cancel</ConsoleButton>
            <ConsoleButton variant="primary" onClick={addEmployee}>
              Add Employee
            </ConsoleButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
