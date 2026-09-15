import { createFileRoute } from "@tanstack/react-router";
import {
  Checklist,
  ConsoleButton,
  DemoNote,
  KeyValue,
  PageHeader,
  Panel,
  Progress,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
import { activationCreates, readinessCases, readinessRequirements } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

const columns = ["not_cleared", "pending_requirements", "ready_for_deployment", "deployed"];

export const Route = createFileRoute("/hr/deployment-readiness")({
  head: () => ({
    meta: [
      { title: "Deployment Readiness — WoCOS HR" },
      {
        name: "description",
        content:
          "Eleven required clearances decide readiness. When all are complete a candidate is marked ready for deployment and can be activated as an employee.",
      },
      { property: "og:title", content: "Deployment Readiness — WoCOS HR" },
      { property: "og:description", content: "Eleven gates between onboarding and employee activation." },
    ],
  }),
  component: ReadinessPage,
});

function ReadinessPage() {
  const focus = readinessCases[0];

  return (
    <>
      <PageHeader
        section="Onboard"
        title="Deployment Readiness"
        subtitle="7 cleared for deployment · 11 required clearances per candidate · 2 not cleared"
        actions={
          <>
            <ConsoleButton>Send reminders</ConsoleButton>
            <ConsoleButton variant="primary">Activate Employee</ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Not Cleared" value={2} note="early stage" tone="danger" />
        <StatTile label="Pending Requirements" value={2} note="avg 4 items short" tone="warning" />
        <StatTile label="Ready for Deployment" value={7} note="3 start Monday" tone="success" />
        <StatTile label="Deployed (30d)" value={19} note="all clients" tone="success" />
      </div>

      <Panel title="Readiness Board" meta="rule: all required items complete" bodyClassName="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          {columns.map((col) => {
            const items = readinessCases.filter((c) => c.status === col);
            return (
              <div key={col} className="console-inset p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="console-label truncate">{labelize(col)}</span>
                  <span className="data-cell text-[10px] text-dim">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((c) => (
                    <article key={c.candidate} className="rounded-md bg-panel p-2.5 ring-1 ring-line">
                      <div className="text-[12px] font-medium text-fg">{c.candidate}</div>
                      <div className="mt-0.5 font-mono text-[9px] text-mute">
                        {c.client} · {c.location}
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={(c.met.length / readinessRequirements.length) * 100}
                          tone={c.met.length === readinessRequirements.length ? "success" : "warning"}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] text-mute">
                        <span>
                          {c.met.length}/{readinessRequirements.length} items
                        </span>
                        <span>{c.start}</span>
                      </div>
                    </article>
                  ))}
                  {items.length === 0 ? (
                    <p className="py-3 text-center font-mono text-[10px] text-mute">empty</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel
          title={`Readiness Profile · ${focus.candidate}`}
          meta="11 of 11 complete"
          action={<StatusBadge status={focus.status} />}
          className="lg:col-span-2"
        >
          <Checklist
            items={readinessRequirements.map((r) => ({
              label: labelize(r),
              status: focus.met.includes(r) ? "completed" : "pending",
            }))}
          />
        </Panel>

        <Panel title="Employee Activation" bodyClassName="space-y-4 p-4">
          <KeyValue
            rows={[
              { k: "Trigger", v: "Readiness approved" },
              { k: "Transition", v: "Candidate → Employee" },
              { k: "Client assignment", v: focus.client },
              { k: "Deployment location", v: focus.location },
              { k: "Start date", v: <span className="data-cell text-[11px]">{focus.start}</span> },
              { k: "Reporting manager", v: "Grace Umeh" },
            ]}
          />
          <div>
            <div className="console-label mb-2">Activation creates</div>
            <ul className="space-y-1">
              {activationCreates.map((c) => (
                <li key={c} className="flex items-center gap-2 font-mono text-[10px] text-dim">
                  <span className="size-1.5 rounded-full bg-teal" />
                  {labelize(c)}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md bg-panel2 p-3 ring-1 ring-line">
            <div className="console-label">Handoff</div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-dim">
              WoCOS HR Talent &amp; Onboarding → WoCOS Core + WoCOS HR Workforce Operations.
            </p>
          </div>
          <ConsoleButton variant="primary" className="w-full">
            Approve Readiness &amp; Activate
          </ConsoleButton>
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
