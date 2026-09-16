import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { verificationCases } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

const checkOrder = [
  "identity",
  "education",
  "employment",
  "references",
  "address",
  "other_required_checks",
] as const;

type VerificationCase = (typeof verificationCases)[number];
type PendingAction = { title: string; description: string; onConfirm: () => void } | null;

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
      {
        property: "og:description",
        content: "Six-check verification cases with exception handling.",
      },
    ],
  }),
  component: VerificationPage,
});

function VerificationPage() {
  const [cases, setCases] = useState<VerificationCase[]>(() => verificationCases);
  const [focusId, setFocusId] = useState(verificationCases[2]!.id);
  const [filter, setFilter] = useState("All");
  const [newCaseOpen, setNewCaseOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newClient, setNewClient] = useState("");
  const [pending, setPending] = useState<PendingAction>(null);

  const focus = cases.find((c) => c.id === focusId) ?? cases[0]!;
  const filtered = filter === "All" ? cases : cases.filter((c) => labelize(c.status) === filter);

  const updateFocus = (updater: (c: VerificationCase) => VerificationCase) => {
    setCases((prev) => prev.map((c) => (c.id === focus.id ? updater(c) : c)));
  };

  const requestConsent = () => {
    const awaiting = cases.filter((c) => c.status === "awaiting_consent").length || 1;
    toast.success(`Consent reminder sent to ${awaiting} candidate${awaiting === 1 ? "" : "s"}`);
  };

  const createCase = () => {
    if (!newCandidate.trim() || !newRole.trim() || !newClient.trim()) {
      toast.error("Candidate, role and client are required");
      return;
    }
    const id = `BV-${3100 + cases.length}`;
    const blankChecks = Object.fromEntries(
      checkOrder.map((k) => [k, "pending"]),
    ) as VerificationCase["checks"];
    const created: VerificationCase = {
      id,
      candidate: newCandidate.trim(),
      role: newRole.trim(),
      client: newClient.trim(),
      status: "awaiting_consent",
      opened: new Date().toISOString().slice(0, 10),
      checks: blankChecks,
    };
    setCases((prev) => [created, ...prev]);
    setFocusId(id);
    setNewCaseOpen(false);
    setNewCandidate("");
    setNewRole("");
    setNewClient("");
    toast.success(`Case ${id} opened`, { description: created.candidate });
  };

  const advanceCheck = () => {
    const nextKey = checkOrder.find((k) => focus.checks[k] !== "cleared");
    if (!nextKey) {
      toast.info("All checks already cleared for this case");
      return;
    }
    updateFocus((c) => ({ ...c, checks: { ...c.checks, [nextKey]: "cleared" } }));
    toast.success(`${labelize(nextKey)} check cleared`, { description: focus.candidate });
  };

  const addFinding = () => {
    toast.info("Finding logged", { description: `Added to case ${focus.id}` });
  };

  const escalate = () => {
    setPending({
      title: "Escalate case?",
      description: `${focus.candidate}'s case will be flagged as an exception and routed to a senior verification officer.`,
      onConfirm: () => {
        updateFocus((c) => ({ ...c, status: "exception" }));
        toast.success("Case escalated", { description: focus.candidate });
      },
    });
  };

  const clearCandidate = () => {
    updateFocus((c) => ({
      ...c,
      status: "cleared",
      checks: Object.fromEntries(
        checkOrder.map((k) => [k, "cleared"]),
      ) as VerificationCase["checks"],
    }));
    toast.success("Candidate cleared", { description: focus.candidate });
  };

  const failVerification = () => {
    setPending({
      title: "Fail verification?",
      description: `${focus.candidate} will be marked as failed and removed from the deployment pipeline. This cannot be undone.`,
      onConfirm: () => {
        updateFocus((c) => ({ ...c, status: "failed" }));
        toast.error("Verification failed", { description: focus.candidate });
      },
    });
  };

  const rowActions: Record<string, () => void> = {
    "Update check": advanceCheck,
    "Add finding": addFinding,
    Escalate: escalate,
    "Clear candidate": clearCandidate,
    "Fail verification": failVerification,
  };

  return (
    <>
      <PageHeader
        section="Talent"
        title="Background Verification"
        subtitle="8 cases pending · 3 awaiting consent · 1 exception escalated"
        actions={
          <>
            <ConsoleButton onClick={requestConsent}>Request consent</ConsoleButton>
            <ConsoleButton variant="primary" onClick={() => setNewCaseOpen(true)}>
              + New Case
            </ConsoleButton>
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

      <FilterBar
        filters={["All", "Awaiting Consent", "In Progress", "Exception", "Cleared"]}
        value={filter}
        onChange={setFilter}
      />

      <Panel title="Verification Cases" meta={`${filtered.length} open`}>
        <DataTable
          columns={[
            "Case",
            "Candidate",
            "Role",
            "Client",
            ...checkOrder.map((c) => labelize(c).slice(0, 9)),
            "Status",
          ]}
          rows={filtered.map((c) => [
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
          tabs={[
            "overview",
            "identity",
            "education",
            "employment",
            "references",
            "exceptions",
            "documents",
            "activity",
          ]}
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
            <Checklist
              items={checkOrder.map((k) => ({ label: labelize(k), status: focus.checks[k] }))}
            />
          </div>

          <div className="space-y-3">
            <div className="rounded-md bg-coral/8 p-3 ring-1 ring-coral/25">
              <div className="console-label text-coral">Exception</div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-dim">
                Previous employer could not confirm the stated role or dates for Jan 2023 – Mar
                2024. Candidate has been asked to supply an alternative reference and a payslip from
                that period.
              </p>
            </div>
            <Timeline
              items={[
                {
                  time: "13 Sep 15:02",
                  text: "Exception raised on employment check",
                  actor: "V. Officer",
                },
                { time: "11 Sep 10:31", text: "Education check cleared", actor: "V. Officer" },
                {
                  time: "08 Sep 09:12",
                  text: "Identity check cleared · NIN matched",
                  actor: "System",
                },
                {
                  time: "05 Sep 08:40",
                  text: "Consent received from candidate",
                  actor: "Candidate",
                },
              ]}
            />
            <div className="space-y-2">
              {[
                "Update check",
                "Add finding",
                "Escalate",
                "Clear candidate",
                "Fail verification",
              ].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={rowActions[a]}
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

      <Dialog open={newCaseOpen} onOpenChange={setNewCaseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open a new verification case</DialogTitle>
            <DialogDescription>
              Starts a fresh six-check case awaiting candidate consent.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="bv-candidate">Candidate</Label>
              <Input
                id="bv-candidate"
                value={newCandidate}
                onChange={(e) => setNewCandidate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bv-role">Role</Label>
              <Input id="bv-role" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bv-client">Client</Label>
              <Input
                id="bv-client"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <ConsoleButton onClick={() => setNewCaseOpen(false)}>Cancel</ConsoleButton>
            <ConsoleButton variant="primary" onClick={createCase}>
              Open Case
            </ConsoleButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pending?.title}</AlertDialogTitle>
            <AlertDialogDescription>{pending?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => pending?.onConfirm()}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
