import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Checklist,
  ConsoleButton,
  DataTable,
  DemoNote,
  KeyValue,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
  Tabs,
  Timeline,
} from "@/components/hr/primitives";
import {
  candidatePipeline,
  candidates as initialCandidates,
  org,
  type Candidate,
} from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/hr/candidates")({
  head: () => ({
    meta: [
      { title: "Candidates — WoCOS HR" },
      {
        name: "description",
        content:
          "Move candidates through a ten-stage pipeline with a full Candidate 360 record: CV, interviews, assessments, verification and documents.",
      },
      { property: "og:title", content: "Candidates — WoCOS HR" },
      {
        property: "og:description",
        content: "A ten-stage recruitment pipeline with Candidate 360 records.",
      },
    ],
  }),
  component: CandidatesPage,
});

let nextCandidateSeq = 5000;

function CandidatesPage() {
  const [candidateList, setCandidateList] = useState<Candidate[]>(initialCandidates);
  const [showTalentPool, setShowTalentPool] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [notes, setNotes] = useState<{ time: string; text: string; actor?: string }[]>([]);
  const focus = candidateList[0]!;

  const moveStage = () => {
    const idx = candidatePipeline.indexOf(focus.stage);
    if (idx === -1 || idx === candidatePipeline.length - 1) {
      toast.info(`${focus.name} is already at the final pipeline stage`);
      return;
    }
    const nextStage = candidatePipeline[idx + 1]!;
    setCandidateList((prev) =>
      prev.map((c) => (c.id === focus.id ? { ...c, stage: nextStage } : c)),
    );
    toast.success(`${focus.name} moved to ${labelize(nextStage)}`);
  };

  const addCandidate = (form: FormData) => {
    const name = String(form.get("name") ?? "").trim();
    const role = String(form.get("role") ?? "").trim();
    if (!name || !role) return;
    const client = String(form.get("client") ?? "").trim() || "Unassigned";
    const location = String(form.get("location") ?? "").trim() || "—";
    const id = `CAN-${nextCandidateSeq++}`;
    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join("");
    const created: Candidate = {
      id,
      name,
      initials,
      role,
      client,
      location,
      experience: "—",
      education: "—",
      skills: [],
      source: "Manual entry",
      recruiter: "You",
      stage: "applied",
      email: "—",
      phone: "—",
      applied: org.today,
    };
    setCandidateList((prev) => [created, ...prev]);
    setAddOpen(false);
    toast.success(`${name} added to the pipeline`, { description: id });
  };

  return (
    <>
      <PageHeader
        section="Talent"
        title="Candidates"
        subtitle="47 candidates in pipeline · 12 shown on board · 3 client reviews pending"
        actions={
          <>
            <ConsoleButton onClick={() => setShowTalentPool((v) => !v)}>
              {showTalentPool ? "Pipeline board" : "Talent pool"}
            </ConsoleButton>
            <ConsoleButton variant="primary" onClick={() => setAddOpen(true)}>
              + Add Candidate
            </ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="New This Week" value={9} note="4 referrals" tone="info" />
        <StatTile label="In Interview" value={11} note="5 scheduled today" tone="info" />
        <StatTile label="Awaiting Client" value={3} note="Solara · Nexa" tone="warning" />
        <StatTile label="Offer Stage" value={5} note="1 accepted" tone="success" />
      </div>

      {showTalentPool ? (
        <Panel title="Talent Pool" meta={`${candidateList.length} candidates`} bodyClassName="p-4">
          <DataTable
            columns={["Candidate", "Role Applied", "Client", "Location", "Source", "Stage"]}
            rows={[...candidateList]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => [
                <span className="text-fg">{c.name}</span>,
                c.role,
                <span className="text-dim">{c.client}</span>,
                <span className="text-dim">{c.location}</span>,
                <span className="text-dim">{c.source}</span>,
                <StatusBadge status={c.stage} />,
              ])}
          />
        </Panel>
      ) : (
        <Panel title="Pipeline Board" meta="drag-free demo view" bodyClassName="p-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {candidatePipeline.map((stage) => {
              const inStage = candidateList.filter((c) => c.stage === stage);
              return (
                <div key={stage} className="console-inset w-56 shrink-0 p-2.5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="console-label truncate">{labelize(stage)}</span>
                    <span className="data-cell text-[10px] text-dim">{inStage.length}</span>
                  </div>
                  <div className="space-y-2">
                    {inStage.map((c) => (
                      <article
                        key={c.id}
                        className="rounded-md bg-panel p-2.5 ring-1 ring-line hover:ring-teal/30"
                      >
                        <div className="flex items-center gap-2">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-panel2 font-mono text-[9px] ring-1 ring-line">
                            {c.initials}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[12px] font-medium text-fg">
                              {c.name}
                            </span>
                            <span className="block truncate font-mono text-[9px] text-mute">
                              {c.id}
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 truncate text-[11px] text-dim">{c.role}</div>
                        <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] text-mute">
                          <span className="truncate">{c.client}</span>
                          {c.score ? <span className="text-teal">{c.score}</span> : null}
                        </div>
                      </article>
                    ))}
                    {inStage.length === 0 ? (
                      <p className="py-3 text-center font-mono text-[10px] text-mute">empty</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      <Panel title="Candidate Table" meta={`${candidateList.length} records`}>
        <DataTable
          columns={[
            "Candidate",
            "Role Applied",
            "Client",
            "Location",
            "Experience",
            "Source",
            "Recruiter",
            "Stage",
          ]}
          rows={candidateList.map((c) => [
            <span>
              <span className="block text-fg">{c.name}</span>
              <span className="data-cell block text-[10px] text-mute">{c.id}</span>
            </span>,
            c.role,
            <span className="text-dim">{c.client}</span>,
            <span className="text-dim">{c.location}</span>,
            <span className="data-cell">{c.experience}</span>,
            <span className="text-dim">{c.source}</span>,
            <span className="text-dim">{c.recruiter}</span>,
            <StatusBadge status={c.stage} />,
          ])}
        />
      </Panel>

      <Panel
        title={`Candidate 360 · ${focus.name}`}
        meta={focus.id}
        action={<StatusBadge status={focus.stage} />}
        bodyClassName="space-y-4 p-4"
      >
        <Tabs
          tabs={[
            "overview",
            "cv",
            "interviews",
            "assessments",
            "verification",
            "documents",
            "notes",
            "activity",
          ]}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="console-inset flex items-center gap-3 p-3">
              <span className="grid size-11 place-items-center rounded-full bg-teal/12 font-mono text-[13px] font-semibold text-teal ring-1 ring-teal/30">
                {focus.initials}
              </span>
              <span>
                <span className="block font-display text-[15px] font-semibold">{focus.name}</span>
                <span className="block font-mono text-[10px] text-mute">
                  {focus.role} · {focus.location}
                </span>
              </span>
            </div>
            <KeyValue
              rows={[
                { k: "Email", v: <span className="data-cell text-[11px]">{focus.email}</span> },
                { k: "Phone", v: <span className="data-cell text-[11px]">{focus.phone}</span> },
                { k: "Client", v: focus.client },
                { k: "Experience", v: focus.experience },
                { k: "Education", v: focus.education },
                { k: "Source", v: focus.source },
                { k: "Recruiter", v: focus.recruiter },
                { k: "Applied", v: <span className="data-cell text-[11px]">{focus.applied}</span> },
                { k: "Score", v: <span className="numeral text-teal">{focus.score}</span> },
              ]}
            />
          </div>

          <div className="space-y-3">
            <div>
              <div className="console-label mb-2">Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {focus.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded bg-panel2 px-2 py-1 font-mono text-[10px] text-dim ring-1 ring-line"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="console-label mb-2">Stage Progress</div>
              <Checklist
                items={[
                  { label: "Screening", status: "approved" },
                  { label: "Interview & assessment", status: "approved" },
                  { label: "Client review", status: "approved" },
                  { label: "Background verification", status: "cleared" },
                  { label: "Offer", status: "accepted" },
                  { label: "Digital onboarding", status: "completed" },
                ]}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="console-label mb-2">Activity</div>
              <Timeline
                items={[
                  ...notes,
                  { time: "14 Sep 09:38", text: "Marked ready for deployment", actor: "System" },
                  {
                    time: "12 Sep 16:02",
                    text: "Onboarding checklist completed",
                    actor: "HR Admin",
                  },
                  { time: "10 Sep 11:20", text: "Offer accepted", actor: "Candidate" },
                  { time: "05 Sep 09:10", text: "Verification cleared", actor: "V. Officer" },
                  { time: "29 Aug 15:44", text: "Client approved shortlist", actor: "ABC Company" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={moveStage}
                className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
              >
                Move stage
              </button>
              <button
                type="button"
                onClick={() =>
                  toast.success(`Interview requested for ${focus.name}`, {
                    description: "Recruiter will confirm a slot",
                  })
                }
                className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
              >
                Schedule interview
              </button>
              <button
                type="button"
                onClick={() =>
                  toast.success(`Verification requested for ${focus.name}`, {
                    description: "Case opened for background checks",
                  })
                }
                className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
              >
                Request verification
              </button>
              <button
                type="button"
                onClick={() => setNoteOpen(true)}
                className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
              >
                Add note
              </button>
            </div>
          </div>
        </div>
      </Panel>

      <DemoNote />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>
              Creates a new candidate record at the top of the pipeline.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              addCandidate(new FormData(e.currentTarget));
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="candidate-name">Full name</Label>
              <Input id="candidate-name" name="name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="candidate-role">Role applied</Label>
              <Input id="candidate-role" name="role" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="candidate-client">Client</Label>
                <Input id="candidate-client" name="client" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="candidate-location">Location</Label>
                <Input id="candidate-location" name="location" />
              </div>
            </div>
            <DialogFooter>
              <ConsoleButton type="submit" variant="primary">
                Add Candidate
              </ConsoleButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note · {focus.name}</DialogTitle>
            <DialogDescription>Logged to this candidate's activity timeline.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const text = String(form.get("note") ?? "").trim();
              if (!text) return;
              setNotes((prev) => [
                { time: "just now", text: `Note: ${text}`, actor: "You" },
                ...prev,
              ]);
              setNoteOpen(false);
              toast.success("Note added");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="candidate-note">Note</Label>
              <textarea
                id="candidate-note"
                name="note"
                required
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <DialogFooter>
              <ConsoleButton type="submit" variant="primary">
                Save Note
              </ConsoleButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
