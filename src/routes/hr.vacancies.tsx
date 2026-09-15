import { createFileRoute } from "@tanstack/react-router";
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
import { vacancies } from "@/lib/hr/data";

export const Route = createFileRoute("/hr/vacancies")({
  head: () => ({
    meta: [
      { title: "Vacancies — WoCOS HR" },
      {
        name: "description",
        content:
          "Track every active vacancy with live pipeline metrics: applications, screened, shortlisted, interviewed, selected and filled.",
      },
      { property: "og:title", content: "Vacancies — WoCOS HR" },
      { property: "og:description", content: "Live vacancy pipelines across six clients." },
    ],
  }),
  component: VacanciesPage,
});

function VacanciesPage() {
  return (
    <>
      <PageHeader
        section="Talent"
        title="Vacancies"
        subtitle="14 open positions · 284 applications · avg time to fill 24 days"
        actions={
          <>
            <ConsoleButton>Table view</ConsoleButton>
            <ConsoleButton variant="primary">+ Create Vacancy</ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Active" value={3} note="14 positions" tone="success" />
        <StatTile label="Paused" value={1} note="client hold" tone="warning" />
        <StatTile label="Filled" value={1} note="3 of 3 seats" tone="success" />
        <StatTile label="Draft" value={1} note="awaiting publish" tone="neutral" />
      </div>

      <FilterBar
        filters={["All", "Active", "Paused", "Filled", "Draft"]}
        right={<ConsoleButton className="h-8 px-2.5 text-[11px]">Client: All</ConsoleButton>}
      />

      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {vacancies.map((v) => (
          <Panel
            key={v.id}
            title={v.title}
            meta={v.id}
            action={<StatusBadge status={v.status} />}
            bodyClassName="space-y-3 p-4"
          >
            <div className="flex items-center justify-between font-mono text-[10px] text-mute">
              <span>{v.client}</span>
              <span>{v.location}</span>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between font-mono text-[10px]">
                <span className="text-mute">Filled</span>
                <span className="text-fg">
                  {v.filled} / {v.required}
                </span>
              </div>
              <Progress value={(v.filled / v.required) * 100} tone={v.filled === v.required ? "success" : "warning"} />
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-line/70 pt-3 font-mono text-[10px]">
              {[
                ["Applied", v.applications],
                ["Screened", v.screened],
                ["Shortlist", v.shortlisted],
                ["Interviewed", v.interviewed],
                ["Selected", v.selected],
                ["Filled", v.filled],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="text-mute">{label}</div>
                  <div className="numeral text-[15px] text-fg">{value}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-line/70 pt-3 font-mono text-[10px] text-mute">
              <span>{v.recruiter}</span>
              <span>opened {v.opened}</span>
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Vacancy Table" meta="all statuses">
        <DataTable
          columns={["Vacancy", "Role", "Client", "Required", "Applications", "Shortlisted", "Selected", "Status"]}
          rows={vacancies.map((v) => [
            <span className="data-cell text-[11px] text-sky">{v.id}</span>,
            <span className="text-fg">{v.title}</span>,
            v.client,
            <span className="data-cell">{v.required}</span>,
            <span className="data-cell">{v.applications}</span>,
            <span className="data-cell">{v.shortlisted}</span>,
            <span className="data-cell">{v.selected}</span>,
            <StatusBadge status={v.status} />,
          ])}
        />
      </Panel>

      <DemoNote />
    </>
  );
}
