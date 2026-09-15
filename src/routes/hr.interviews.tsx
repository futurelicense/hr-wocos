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
import { interviews, scorecardCriteria } from "@/lib/hr/data";

const week = [
  { day: "Mon 14", date: "2026-09-14" },
  { day: "Tue 15", date: "2026-09-15" },
  { day: "Wed 16", date: "2026-09-16" },
  { day: "Thu 17", date: "2026-09-17" },
  { day: "Fri 18", date: "2026-09-18" },
];

export const Route = createFileRoute("/hr/interviews")({
  head: () => ({
    meta: [
      { title: "Interviews — WoCOS HR" },
      {
        name: "description",
        content:
          "Schedule interviews, run structured scorecards across five criteria and record hire recommendations for every candidate.",
      },
      { property: "og:title", content: "Interviews — WoCOS HR" },
      { property: "og:description", content: "Interview calendar and structured scorecards." },
    ],
  }),
  component: InterviewsPage,
});

function InterviewsPage() {
  const total = scorecardCriteria.reduce((s, c) => s + c.score, 0);

  return (
    <>
      <PageHeader
        section="Talent"
        title="Interviews & Assessment"
        subtitle="5 interviews today · 2 with client panels · 1 scorecard awaiting submission"
        actions={
          <>
            <ConsoleButton>List view</ConsoleButton>
            <ConsoleButton variant="primary">+ Schedule Interview</ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Today" value={5} note="09:00 – 16:30" tone="info" />
        <StatTile label="This Week" value={14} note="3 rescheduled" tone="info" />
        <StatTile label="Scorecards Due" value={2} note="1 overdue" tone="warning" />
        <StatTile label="Recommend Hire" value={6} note="of 9 completed" tone="success" />
      </div>

      <FilterBar filters={["Week", "Day", "Month", "Unscored"]} right={<ConsoleButton className="h-8 px-2.5 text-[11px]">Interviewer: All</ConsoleButton>} />

      <Panel title="Interview Calendar" meta="14 – 18 Sep 2026" bodyClassName="p-4">
        <div className="grid gap-3 md:grid-cols-5">
          {week.map((d) => {
            const dayItems = interviews.filter((i) => i.date === d.date);
            return (
              <div key={d.day} className="console-inset min-h-40 p-2.5">
                <div className="console-label mb-2">{d.day}</div>
                <div className="space-y-2">
                  {dayItems.map((i) => (
                    <article key={i.candidate + i.time} className="rounded-md bg-panel p-2.5 ring-1 ring-line">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-teal">{i.time}</span>
                        <span className="text-mute">{i.format}</span>
                      </div>
                      <div className="mt-1 truncate text-[12px] font-medium text-fg">{i.candidate}</div>
                      <div className="truncate font-mono text-[9px] text-mute">{i.vacancy}</div>
                    </article>
                  ))}
                  {dayItems.length === 0 ? (
                    <p className="py-3 text-center font-mono text-[10px] text-mute">no interviews</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Interview List" meta={`${interviews.length} scheduled`} className="lg:col-span-2">
          <DataTable
            columns={["Candidate", "Vacancy", "Interviewer", "Date", "Time", "Format", "Status"]}
            rows={interviews.map((i) => [
              <span className="text-fg">{i.candidate}</span>,
              <span className="text-dim">{i.vacancy}</span>,
              <span className="text-dim">{i.interviewer}</span>,
              <span className="data-cell text-[11px]">{i.date}</span>,
              <span className="data-cell text-[11px]">{i.time}</span>,
              i.format,
              <StatusBadge status={i.status} />,
            ])}
          />
        </Panel>

        <Panel title="Scorecard · Yusuf Ibrahim" meta={`${total} / 25`} bodyClassName="space-y-3 p-4">
          {scorecardCriteria.map((c) => (
            <div key={c.id}>
              <div className="mb-1.5 flex items-center justify-between font-mono text-[10px]">
                <span className="text-mute">{c.label}</span>
                <span className="text-fg">{c.score} / 5</span>
              </div>
              <Progress value={(c.score / 5) * 100} tone={c.score >= 4 ? "success" : "warning"} />
            </div>
          ))}
          <div className="border-t border-line pt-3">
            <div className="console-label mb-2">Recommendation</div>
            <div className="flex flex-wrap gap-1.5">
              {["strong_hire", "hire", "consider", "no_hire"].map((r, i) => (
                <StatusBadge key={r} status={r} className={i === 1 ? "ring-2" : "opacity-50"} />
              ))}
            </div>
            <ConsoleButton variant="primary" className="mt-3 w-full">
              Submit Scorecard
            </ConsoleButton>
          </div>
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
