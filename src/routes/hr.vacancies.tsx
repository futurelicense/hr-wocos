import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
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
import { vacancies as initialVacancies } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Vacancy = (typeof initialVacancies)[number];

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

let nextVacancySeq = 130;

function VacanciesPage() {
  const [vacancyList, setVacancyList] = useState<Vacancy[]>(initialVacancies);
  const [tableOnly, setTableOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);

  const clients = Array.from(new Set(vacancyList.map((v) => v.client)));
  const filtered = vacancyList.filter(
    (v) =>
      (statusFilter === "All" || labelize(v.status) === statusFilter) &&
      (clientFilter === "All" || v.client === clientFilter),
  );

  const addVacancy = (form: FormData) => {
    const title = String(form.get("title") ?? "").trim();
    const client = String(form.get("client") ?? "").trim();
    if (!title || !client) return;
    const required = Number(form.get("required") ?? 1) || 1;
    const created: Vacancy = {
      id: `VAC-${nextVacancySeq++}`,
      title,
      client,
      location: String(form.get("location") ?? "").trim() || "—",
      required,
      applications: 0,
      screened: 0,
      shortlisted: 0,
      interviewed: 0,
      selected: 0,
      filled: 0,
      status: "draft",
      recruiter: "—",
      opened: "2026-09-16",
    };
    setVacancyList((prev) => [created, ...prev]);
    setAddOpen(false);
    toast.success(`${title} vacancy created`, { description: created.id });
  };

  return (
    <>
      <PageHeader
        section="Talent"
        title="Vacancies"
        subtitle="14 open positions · 284 applications · avg time to fill 24 days"
        actions={
          <>
            <ConsoleButton onClick={() => setTableOnly((v) => !v)}>
              {tableOnly ? "Card view" : "Table view"}
            </ConsoleButton>
            <ConsoleButton variant="primary" onClick={() => setAddOpen(true)}>
              + Create Vacancy
            </ConsoleButton>
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
        value={statusFilter}
        onChange={setStatusFilter}
        right={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ConsoleButton className="h-8 px-2.5 text-[11px]">
                Client: {clientFilter}
              </ConsoleButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setClientFilter("All")}>All</DropdownMenuItem>
              {clients.map((c) => (
                <DropdownMenuItem key={c} onClick={() => setClientFilter(c)}>
                  {c}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      {!tableOnly && (
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => (
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
                <Progress
                  value={(v.filled / v.required) * 100}
                  tone={v.filled === v.required ? "success" : "warning"}
                />
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
      )}

      <Panel title="Vacancy Table" meta={`${filtered.length} of ${vacancyList.length} shown`}>
        <DataTable
          columns={[
            "Vacancy",
            "Role",
            "Client",
            "Required",
            "Applications",
            "Shortlisted",
            "Selected",
            "Status",
          ]}
          rows={filtered.map((v) => [
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

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Vacancy</DialogTitle>
            <DialogDescription>Opens a new draft vacancy in the register.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              addVacancy(new FormData(e.currentTarget));
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="vac-title">Job title</Label>
              <Input id="vac-title" name="title" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vac-client">Client</Label>
                <Input id="vac-client" name="client" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vac-location">Location</Label>
                <Input id="vac-location" name="location" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vac-required">Positions required</Label>
              <Input id="vac-required" name="required" type="number" min={1} defaultValue={1} />
            </div>
            <DialogFooter>
              <ConsoleButton type="submit" variant="primary">
                Create Vacancy
              </ConsoleButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
