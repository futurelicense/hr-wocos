import { createFileRoute } from "@tanstack/react-router";
import {
  Checklist,
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
import { verificationCases } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

const checkOrder = ["identity", "education", "employment", "references", "address", "other_required_checks"] as const;

export const Route = createFileRoute("/hr/verification")({
  head: () => ({
    meta: [
      { title: "Background Verification — WoCOS HR" },
      {
        name: "description",
        content:
          "Run identity, education, employment, reference and address checks with consent tracking, exception handling and clearance decisions.",
      },
      { property: "og:title", content: "Background Verification — WoCOS HR" },
      { property: "og:description", content: "Six-check verification cases with exception handling." },
    ],
  }),
  component: VerificationPage,
});

function VerificationPage() {
  const focus = verificationCases[2];

  return (
    <>
      <PageHeader
        section="Talent"
        title="Background Verification"
        subtitle="8 cases pending · 3 awaiting consent · 1 exception escalated"
        actions={
          <>
            <ConsoleButton>Request consent</ConsoleButton>
            <ConsoleButton variant="primary">+ New Case</ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile label="Awaiting Consent" value={3} note="reminders sent" tone="warning" />
        <StatTile label="In Progress" value={4} note="avg 4.2 days" tone="info" />
        <StatTile label="Exceptions" value={1} note="employment check" tone="danger" />
        <StatTile label="Cleared (30d)" value={19} note="94% pass rate" tone="success" />
        <StatTile label="Failed (30d)" value={2} note="withdrawn" tone="danger" />
      </div>

      <FilterBar filters={["All", "Awaiting Consent", "In Progress", "Exception", "Cleared"]} />

      <Panel title="Verification Cases" meta={`${verificationCases.length} open`}>
        <DataTable
          columns={["Case", "Candidate", "Role", "Client", ...checkOrder.map((c) => labelize(c).slice(0, 9)), "Status"]}
          rows={verificationCases.map((c) => [
            <span className="data-cell text-[11px] text-sky">{c.id}</span>,
            <span className="text-fg">{c.candidate}</span>,
            <span className="text-dim">{c.role}</span>,
            <span className="text-dim">{c.client}</span>,
            ...checkOrder.map((k) => <StatusBadge key={k} status={c.checks[k]} />),
            <StatusBadge status={c.status} />,
          ])}
        />
      </Panel>

      <Panel
        title={`Case ${focus.id} · ${focus.candidate}`}
        meta={`opened ${focus.opened}`}
        action={<StatusBadge status={focus.status} />}
        bodyClassName="space-y-4 p-4"
      >
        <Tabs
          tabs={["overview", "identity", "education", "employment", "references", "exceptions", "documents", "activity"]}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <KeyValue
            rows={[
              { k: "Candidate", v: focus.candidate },
              { k: "Role", v: focus.role },
              { k: "Client", v: focus.client },
              { k: "Consent", v: <StatusBadge status="approved" /> },
              { k: "Opened", v: <span className="data-cell text-[11px]">{focus.opened}</span> },
              { k: "Officer", v: "Ada Nwachukwu" },
              { k: "SLA", v: <span className="text-coral">2 days overdue</span> },
            ]}
          />

          <div>
            <div className="console-label mb-2">Check Results</div>
            <Checklist items={checkOrder.map((k) => ({ label: labelize(k), status: focus.checks[k] }))} />
          </div>

          <div className="space-y-3">
            <div className="rounded-md bg-coral/8 p-3 ring-1 ring-coral/25">
              <div className="console-label text-coral">Exception</div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-dim">
                Previous employer could not confirm the stated role or dates for Jan 2023 – Mar 2024. Candidate has been
                asked to supply an alternative reference and a payslip from that period.
              </p>
            </div>
            <Timeline
              items={[
                { time: "13 Sep 15:02", text: "Exception raised on employment check", actor: "V. Officer" },
                { time: "11 Sep 10:31", text: "Education check cleared", actor: "V. Officer" },
                { time: "08 Sep 09:12", text: "Identity check cleared · NIN matched", actor: "System" },
                { time: "05 Sep 08:40", text: "Consent received from candidate", actor: "Candidate" },
              ]}
            />
            <div className="space-y-2">
              {["Update check", "Add finding", "Escalate", "Clear candidate", "Fail verification"].map((a) => (
                <button
                  key={a}
                  type="button"
                  className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <DemoNote />
    </>
  );
}
