import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ConsoleButton,
  DataTable,
  DemoNote,
  KeyValue,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
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
import { candidatePipeline, candidates, clients, deployments } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

type Candidate = (typeof candidates)[number];

const modules = [
  "dashboard",
  "workforce_requests",
  "candidate_approvals",
  "active_workforce",
  "attendance",
  "timesheet_approvals",
  "payroll_approvals",
  "performance",
  "reports",
  "support_requests",
];

export const Route = createFileRoute("/hr/client-portal")({
  head: () => ({
    meta: [
      { title: "Client Portal — WoCOS HR" },
      {
        name: "description",
        content:
          "A client-scoped view of workforce requests, candidate approvals, deployed staff, attendance, timesheet and payroll approvals.",
      },
      { property: "og:title", content: "Client Portal — WoCOS HR" },
      { property: "og:description", content: "Client-scoped workforce visibility and approvals." },
    ],
  }),
  component: ClientPortalPage,
});

function ClientPortalPage() {
  const [clientName, setClientName] = useState("ABC Company");
  const [pool, setPool] = useState<Candidate[]>(() => candidates);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({ role: "", quantity: "1" });
  const clientStaff = deployments.filter((d) => d.client === clientName);
  const approvals = pool.filter(
    (c) => c.client === clientName && ["client_review", "selected"].includes(c.stage),
  );

  const advanceStage = (c: Candidate) => {
    const idx = candidatePipeline.indexOf(c.stage);
    const next = candidatePipeline[idx + 1];
    return next ?? c.stage;
  };

  const approveSelected = () => {
    if (approvals.length === 0) {
      toast.info("No candidates awaiting approval");
      return;
    }
    setPool((prev) =>
      prev.map((c) =>
        c.client === clientName && ["client_review", "selected"].includes(c.stage)
          ? { ...c, stage: advanceStage(c) }
          : c,
      ),
    );
    toast.success(`Approved ${approvals.length} candidate${approvals.length === 1 ? "" : "s"}`, {
      description: approvals.map((c) => c.name).join(", "),
    });
  };

  const requestAnotherInterview = () => {
    if (approvals.length === 0) {
      toast.info("No candidates in review to schedule");
      return;
    }
    const target = approvals[0]!;
    setPool((prev) => prev.map((c) => (c.id === target.id ? { ...c, stage: "interview" } : c)));
    toast.success(`Additional interview requested for ${target.name}`);
  };

  const raiseRequest = () => {
    if (!requestForm.role.trim()) {
      toast.error("Role is required");
      return;
    }
    toast.success(`Workforce request raised for ${requestForm.quantity}x ${requestForm.role}`, {
      description: `${clientName} · routed to HR for sourcing`,
    });
    setRequestOpen(false);
    setRequestForm({ role: "", quantity: "1" });
  };

  return (
    <>
      <PageHeader
        section="Portals"
        title="Client Portal"
        subtitle={`Viewing as ${clientName} · client-scoped visibility only`}
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ConsoleButton>Switch client</ConsoleButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {clients.map((c) => (
                  <DropdownMenuItem key={c.name} onClick={() => setClientName(c.name)}>
                    {c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ConsoleButton variant="primary" onClick={() => setRequestOpen(true)}>
              + Raise Workforce Request
            </ConsoleButton>
          </>
        }
      />

      <div className="rounded-lg bg-sky/8 p-3 ring-1 ring-sky/25">
        <p className="text-[12px] leading-relaxed text-dim">
          <span className="font-mono text-[10px] tracking-[0.14em] text-sky uppercase">Scope</span>{" "}
          — clients only ever see their own workforce, requests and approvals. Nothing from other
          clients is visible in this view.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Deployed Staff" value={48} note="2 sites" tone="success" />
        <StatTile label="Open Requests" value={3} note="1 partially filled" tone="warning" />
        <StatTile
          label="Candidates To Review"
          value={approvals.length}
          note="awaiting your decision"
          tone="warning"
        />
        <StatTile label="Approvals Due" value={2} note="timesheets + payroll" tone="warning" />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel
          title="Candidate Approvals"
          meta={`${approvals.length} pending`}
          className="lg:col-span-2"
        >
          <DataTable
            columns={["Candidate", "Role", "Experience", "Score", "Stage"]}
            rows={approvals.map((c) => [
              <span className="text-fg">{c.name}</span>,
              c.role,
              <span className="data-cell">{c.experience}</span>,
              <span className="data-cell text-teal">{c.score ?? "—"}</span>,
              <StatusBadge status={c.stage} />,
            ])}
          />
          <div className="mt-3 flex gap-2">
            <ConsoleButton variant="primary" onClick={approveSelected}>
              Approve Selected
            </ConsoleButton>
            <ConsoleButton onClick={requestAnotherInterview}>
              Request Another Interview
            </ConsoleButton>
          </div>
        </Panel>

        <Panel title="Portal Modules">
          <ul className="space-y-1.5">
            {modules.map((m, i) => (
              <li
                key={m}
                className="flex items-center justify-between gap-3 border-b border-line/60 py-1.5 text-[12.5px] last:border-0"
              >
                <span>{labelize(m)}</span>
                <StatusBadge status={i > 6 ? "under_review" : "active"} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel
          title="Active Workforce"
          meta={`${clientStaff.length} shown of 48`}
          className="lg:col-span-2"
        >
          <DataTable
            columns={["Employee", "Department", "Location", "Supervisor", "Start", "Status"]}
            rows={clientStaff.map((d) => [
              <span className="text-fg">{d.employee}</span>,
              d.department,
              <span className="text-dim">{d.location}</span>,
              <span className="text-dim">{d.supervisor}</span>,
              <span className="data-cell text-[11px]">{d.start}</span>,
              <StatusBadge status={d.status} />,
            ])}
          />
        </Panel>

        <Panel title="This Period">
          <KeyValue
            rows={[
              { k: "Attendance", v: "96.4% present" },
              { k: "Timesheets to approve", v: <span className="data-cell">1 batch</span> },
              { k: "Payroll approval", v: <StatusBadge status="awaiting_approval" /> },
              { k: "Support requests", v: <span className="data-cell">2 open</span> },
              { k: "Performance reviews", v: <span className="data-cell">6 in cycle</span> },
              { k: "Contracts expiring", v: <span className="text-amber">3 within 30 days</span> },
            ]}
          />
        </Panel>
      </div>

      <DemoNote />

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise a workforce request</DialogTitle>
            <DialogDescription>Sent to HR for sourcing against {clientName}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="wr-role">Role needed</Label>
              <Input
                id="wr-role"
                value={requestForm.role}
                onChange={(e) => setRequestForm({ ...requestForm, role: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="wr-qty">Headcount</Label>
              <Input
                id="wr-qty"
                type="number"
                min="1"
                value={requestForm.quantity}
                onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <ConsoleButton onClick={() => setRequestOpen(false)}>Cancel</ConsoleButton>
            <ConsoleButton variant="primary" onClick={raiseRequest}>
              Submit Request
            </ConsoleButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
