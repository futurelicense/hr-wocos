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
import { attendanceRows, attendanceToday, clients } from "@/lib/hr/data";

export const Route = createFileRoute("/hr/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — WoCOS HR" },
      {
        name: "description",
        content:
          "Daily, weekly and monthly attendance across every client site, with exception queues for missing clock-ins and unexplained absence.",
      },
      { property: "og:title", content: "Attendance — WoCOS HR" },
      { property: "og:description", content: "Daily attendance and exception queues by client site." },
    ],
  }),
  component: AttendancePage,
});

function AttendancePage() {
  return (
    <>
      <PageHeader
        section="Workforce"
        title="Attendance"
        subtitle="14 Sep 2026 · 163 of 186 accounted for · 5 exceptions to clear"
        actions={
          <>
            <ConsoleButton>Weekly</ConsoleButton>
            <ConsoleButton variant="primary">Exceptions (5)</ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        <StatTile label="Present" value={attendanceToday.present} note="82.8%" tone="success" />
        <StatTile label="Remote" value={attendanceToday.remote} note="approved" tone="info" />
        <StatTile label="On Leave" value={attendanceToday.leave} note="scheduled" tone="warning" />
        <StatTile label="Late" value={attendanceToday.late} note="over 30 min" tone="warning" />
        <StatTile label="Absent" value={attendanceToday.absent} note="unexplained" tone="danger" />
        <StatTile label="Exceptions" value={attendanceToday.exception} note="missing clock-out" tone="danger" />
      </div>

      <FilterBar filters={["Daily", "Weekly", "Monthly", "Exceptions"]} right={<ConsoleButton className="h-8 px-2.5 text-[11px]">Site: All</ConsoleButton>} />

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Attendance Register" meta="14 Sep 2026" className="lg:col-span-2">
          <DataTable
            columns={["Employee", "Client", "Clock In", "Clock Out", "Hours", "Status"]}
            rows={attendanceRows.map((r) => [
              <span className="text-fg">{r.employee}</span>,
              <span className="text-dim">{r.client}</span>,
              <span className="data-cell text-[11px]">{r.in}</span>,
              <span className="data-cell text-[11px]">{r.out}</span>,
              <span className="data-cell text-[11px]">{r.hours}</span>,
              <StatusBadge status={r.status} />,
            ])}
          />
        </Panel>

        <Panel title="Present by Client" meta="today">
          <BarList
            items={clients.map((c) => ({ label: c.name, value: Math.round(c.headcount * 0.9) }))}
            tone="success"
          />
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
