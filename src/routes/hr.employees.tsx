import { createFileRoute } from "@tanstack/react-router";
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
import { clients, employees, locations } from "@/lib/hr/data";

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
  const focus = employees[0];

  return (
    <>
      <PageHeader
        section="Workforce"
        title="Employees"
        subtitle="186 employees · 6 clients · 5 locations · 172 actively deployed"
        actions={
          <>
            <ConsoleButton>Export directory</ConsoleButton>
            <ConsoleButton variant="primary">+ Add Employee</ConsoleButton>
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
        right={<ConsoleButton className="h-8 px-2.5 text-[11px]">Client: All</ConsoleButton>}
      />

      <Panel title="Directory" meta={`${employees.length} shown of 186`}>
        <DataTable
          columns={["Employee", "Role", "Client", "Location", "Manager", "Start", "Contract", "Compliance", "Status"]}
          rows={employees.map((e) => [
            <span className="flex items-center gap-2">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-panel2 font-mono text-[9px] ring-1 ring-line">
                {e.initials}
              </span>
              <span>
                <span className="block text-fg">{e.name}</span>
                <span className="data-cell block text-[10px] text-mute">{e.id}</span>
              </span>
            </span>,
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
          <BarList items={locations.map((l) => ({ label: l.name, value: l.headcount }))} tone="info" />
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
                { k: "Start date", v: <span className="data-cell text-[11px]">{focus.start}</span> },
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
                { time: "14 Sep 09:38", text: "Client assignment created · ABC Company", actor: "System" },
                { time: "12 Sep 16:02", text: "Onboarding completed", actor: "HR Admin" },
                { time: "10 Sep 11:20", text: "Offer accepted", actor: "Candidate" },
                { time: "05 Sep 09:10", text: "Verification cleared", actor: "V. Officer" },
              ]}
            />
          </div>
        </div>
      </Panel>

      <DemoNote />
    </>
  );
}
