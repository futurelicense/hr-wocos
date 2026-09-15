import { createFileRoute } from "@tanstack/react-router";
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
import { payrollExceptions, payrollStages } from "@/lib/hr/data";

export const Route = createFileRoute("/hr/payroll")({
  head: () => ({
    meta: [
      { title: "Payroll Operations — WoCOS HR" },
      {
        name: "description",
        content:
          "Payroll workflow from timesheets and inputs through exception review, HR and client approval, to handoff and payment status.",
      },
      { property: "og:title", content: "Payroll Operations — WoCOS HR" },
      { property: "og:description", content: "Payroll workflow, exceptions and handoff — not a calculation engine." },
    ],
  }),
  component: PayrollPage,
});

function PayrollPage() {
  return (
    <>
      <PageHeader
        section="HR Operations"
        title="Payroll Operations"
        subtitle="September cycle · 91% ready · 6 exceptions · awaiting HR review"
        actions={
          <>
            <ConsoleButton>Exceptions (6)</ConsoleButton>
            <ConsoleButton variant="primary">Hand Off to Payroll</ConsoleButton>
          </>
        }
      />

      <div className="rounded-lg bg-sky/8 p-3 ring-1 ring-sky/25">
        <p className="text-[12px] leading-relaxed text-dim">
          <span className="font-mono text-[10px] tracking-[0.14em] text-sky uppercase">Scope</span> — WoCOS HR runs the
          payroll <em>workflow</em>: inputs, exceptions, approvals and handoff. Salary calculation itself is performed by
          your payroll system or provider; this module prepares and hands over the approved inputs.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Payroll Readiness" value="91%" note="168 of 186 ready" tone="success" />
        <StatTile label="Exceptions" value={6} note="2 critical" tone="danger" />
        <StatTile label="Awaiting Approval" value={7} note="HR + client" tone="warning" />
        <StatTile label="Handed Off" value={0} note="cycle open" tone="neutral" />
      </div>

      <Panel title="Payroll Workflow" meta="9 stages" bodyClassName="p-4">
        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-9">
          {payrollStages.map((s, i) => (
            <div key={s.id} className="console-inset p-2.5">
              <div className="flex items-center justify-between">
                <span className="data-cell text-[10px] text-mute">0{i + 1}</span>
                <StatusBadge status={s.status} />
              </div>
              <div className="mt-2 truncate text-[12px] text-fg">{s.label}</div>
              <div className="numeral mt-1 text-[16px]">{s.count}</div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Exception Queue" meta="6 items" className="lg:col-span-2">
          <DataTable
            columns={["Employee", "Client", "Issue", "Severity"]}
            rows={payrollExceptions.map((e) => [
              <span className="text-fg">{e.employee}</span>,
              <span className="text-dim">{e.client}</span>,
              <span className="text-dim">{e.issue}</span>,
              <StatusBadge status={e.severity} />,
            ])}
          />
        </Panel>

        <Panel title="Readiness by Client" bodyClassName="space-y-3 p-4">
          {[
            ["Nexa Logistics", 88],
            ["ABC Company", 100],
            ["Kestrel Payroll", 79],
            ["Bluewave Retail", 85],
            ["Harbor Foods", 94],
            ["Solara Energy", 92],
          ].map(([name, pct]) => (
            <div key={name as string}>
              <div className="mb-1.5 flex items-center justify-between font-mono text-[10px]">
                <span className="text-mute">{name}</span>
                <span className="text-fg">{pct}%</span>
              </div>
              <Progress value={pct as number} tone={(pct as number) >= 90 ? "success" : "warning"} />
            </div>
          ))}
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
