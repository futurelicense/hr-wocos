import { createFileRoute } from "@tanstack/react-router";
import {
  BarList,
  ColumnChart,
  ConsoleButton,
  DemoNote,
  PageHeader,
  Panel,
} from "@/components/hr/primitives";
import { analyticsCategories, clients, hiringTrend, locations, pipelineFunnel } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

export const Route = createFileRoute("/hr/analytics")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — WoCOS HR" },
      {
        name: "description",
        content:
          "Recruitment, workforce, operations, compliance and payroll analytics: time to fill, conversion, turnover, readiness and exception trends.",
      },
      { property: "og:title", content: "Reports & Analytics — WoCOS HR" },
      { property: "og:description", content: "Recruitment, workforce, operations, compliance and payroll metrics." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <>
      <PageHeader
        section="Intelligence"
        title="Reports & Analytics"
        subtitle="Rolling 90 days · 5 metric families · exportable to CSV and PDF"
        actions={
          <>
            <ConsoleButton>Date range</ConsoleButton>
            <ConsoleButton variant="primary">Export Report</ConsoleButton>
          </>
        }
      />

      {Object.entries(analyticsCategories).map(([category, items]) => (
        <Panel key={category} title={labelize(category)} meta={`${items.length} metrics`} bodyClassName="p-4">
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {items.map((m) => (
              <div key={m.label} className="console-inset p-3">
                <div className="console-label truncate">{m.label}</div>
                <div className="numeral mt-2 text-[22px] leading-none">{m.value}</div>
                <div
                  className={
                    m.delta.startsWith("+")
                      ? "mt-2 font-mono text-[10px] text-teal"
                      : m.delta.startsWith("-")
                        ? "mt-2 font-mono text-[10px] text-sky"
                        : "mt-2 font-mono text-[10px] text-mute"
                  }
                >
                  {m.delta}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ))}

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Recruitment Funnel" meta="90 days">
          <ColumnChart items={pipelineFunnel.map((p) => ({ label: p.short, value: p.count, tone: "info" as const }))} />
        </Panel>
        <Panel title="Monthly Hiring Trend" meta="hires">
          <ColumnChart items={hiringTrend.map((h) => ({ label: h.month, value: h.hires, tone: "success" as const }))} />
        </Panel>
        <Panel title="Workforce by Client" meta="headcount">
          <BarList items={clients.map((c) => ({ label: c.name, value: c.headcount }))} />
        </Panel>
        <Panel title="Workforce by Location" meta="headcount">
          <BarList items={locations.map((l) => ({ label: l.name, value: l.headcount }))} tone="info" />
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
