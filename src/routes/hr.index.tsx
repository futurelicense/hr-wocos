import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  BarList,
  ColumnChart,
  ConsoleButton,
  DemoNote,
  Dot,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
  Timeline,
} from "@/components/hr/primitives";
import { LifecycleRail } from "@/components/hr/LifecycleRail";
import {
  attentionRequired,
  clients,
  hiringTrend,
  metrics,
  org,
  pendingApprovals,
  pipelineFunnel,
  recentActivity,
  soniaBrief,
  soniaPrompts,
} from "@/lib/hr/data";

export const Route = createFileRoute("/hr/")({
  head: () => ({
    meta: [
      { title: "HR Command Center — WoCOS HR" },
      {
        name: "description",
        content:
          "Live workforce overview for TeamAce: headcount, open vacancies, pipeline, verification, deployment readiness, payroll exceptions and approvals.",
      },
      { property: "og:title", content: "HR Command Center — WoCOS HR" },
      {
        property: "og:description",
        content: "Workforce operations at a glance across every client.",
      },
    ],
  }),
  component: CommandCenter,
});

function exportOverviewCsv() {
  const rows = [
    ["Pending Approvals", "", ""],
    ...pendingApprovals.map((a) => [a.title, a.meta, a.status]),
    ["Attention Required", "", ""],
    ...attentionRequired.map((a) => [a.title, a.meta, a.tone]),
  ];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const csv = [["Item", "Detail", "Status"], ...rows]
    .map((r) => r.map(escape).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "workforce-overview.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${pendingApprovals.length + attentionRequired.length} overview items`);
}

function CommandCenter() {
  return (
    <>
      <PageHeader
        section="Overview"
        title="Workforce operations at a glance"
        subtitle={`Live · ${org.today} · ${org.clock} · updated 2m ago`}
        actions={
          <>
            <ConsoleButton onClick={exportOverviewCsv}>Export</ConsoleButton>
            <Link
              to="/hr/workforce-requests"
              className="flex h-9 items-center rounded-md bg-teal px-4 text-[13px] font-semibold text-ink ring-1 ring-teal transition-colors hover:bg-teal/90"
            >
              + New Workforce Request
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatTile
          label="Total Workforce"
          value={metrics.total_workforce}
          note="▲ 6 this month"
          tone="success"
        />
        <StatTile
          label="Open Vacancies"
          value={metrics.open_vacancies}
          note="across 6 clients"
          tone="info"
        />
        <StatTile
          label="In Pipeline"
          value={metrics.candidates_in_pipeline}
          note="Sourcing → Offer"
          tone="info"
        />
        <StatTile
          label="Verification Pending"
          value={metrics.verification_pending}
          note="3 awaiting consent"
          tone="warning"
        />
        <StatTile
          label="Deployment Ready"
          value={metrics.deployment_ready}
          note="cleared for dispatch"
          tone="success"
        />
        <StatTile
          label="Payroll Exceptions"
          value={metrics.payroll_exceptions}
          note="2 critical"
          tone="danger"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatTile
          label="Interviews Today"
          value={metrics.interviews_today}
          note="2 with client panels"
          tone="info"
        />
        <StatTile
          label="Onboarding"
          value={metrics.employees_onboarding}
          note="2 blocked"
          tone="warning"
        />
        <StatTile
          label="Active Deployments"
          value={metrics.active_deployments}
          note="6 clients · 5 sites"
          tone="success"
        />
        <StatTile
          label="Open HR Requests"
          value={metrics.open_hr_requests}
          note="3 overdue"
          tone="warning"
        />
        <StatTile
          label="Compliance Alerts"
          value={metrics.compliance_alerts}
          note="3 expired"
          tone="danger"
        />
        <StatTile
          label="Contracts Expiring"
          value={metrics.contracts_expiring}
          note="within 30 days"
          tone="warning"
        />
      </div>

      <LifecycleRail />

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Workforce by Client" meta="headcount">
          <BarList items={clients.map((c) => ({ label: c.name, value: c.headcount }))} />
        </Panel>
        <Panel title="Recruitment Pipeline" meta="47 active">
          <ColumnChart
            items={pipelineFunnel.map((s, i) => ({
              label: s.short,
              value: s.count,
              tone: i > 3 ? ("warning" as const) : ("info" as const),
            }))}
          />
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel
          title="Pending Approvals"
          action={<StatusBadge status="awaiting_approval" tone="warning" />}
        >
          <ul className="space-y-2 text-[12px]">
            {pendingApprovals.map((a) => (
              <li
                key={a.title}
                className="flex items-center justify-between gap-3 border-b border-line/70 py-1.5 last:border-0"
              >
                <span>
                  <span className="block text-fg">{a.title}</span>
                  <span className="block font-mono text-[10px] text-mute">{a.meta}</span>
                </span>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Attention Required" action={<StatusBadge status="critical" tone="danger" />}>
          <ul className="space-y-2 text-[12px]">
            {attentionRequired.map((a) => (
              <li
                key={a.title}
                className="flex gap-2.5 border-b border-line/70 py-1.5 last:border-0"
              >
                <span className="mt-1.5">
                  <Dot tone={a.tone} />
                </span>
                <span>
                  <span className="block text-fg">{a.title}</span>
                  <span className="block font-mono text-[10px] text-mute">{a.meta}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title={
            <span className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-md bg-sky/12 ring-1 ring-sky/30">
                <span className="font-mono text-[11px] text-sky">S</span>
              </span>
              Sonia · Daily Brief
            </span>
          }
        >
          <div className="space-y-2.5 text-[12px] leading-relaxed text-dim">
            {soniaBrief.slice(0, 2).map((p) => (
              <p key={p} className="text-pretty">
                {p}
              </p>
            ))}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {soniaPrompts.slice(3, 5).map((p) => (
                <Link
                  key={p}
                  to="/hr/sonia"
                  className="rounded bg-panel2 px-2 py-1 font-mono text-[10px] text-mute ring-1 ring-line hover:text-fg"
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Recent Activity" className="lg:col-span-2">
          <Timeline items={recentActivity} />
        </Panel>
        <Panel title="Monthly Hiring Trend" meta="hires">
          <ColumnChart
            items={hiringTrend.map((h) => ({
              label: h.month,
              value: h.hires,
              tone: "success" as const,
            }))}
          />
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
