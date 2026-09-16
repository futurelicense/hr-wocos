import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { leaveBalances, soniaPrompts } from "@/lib/hr/data";

const documentOptions = [
  "Employment confirmation letter",
  "Payslip · September 2026",
  "Tax clearance certificate",
  "Bank verification letter",
];

export const Route = createFileRoute("/hr/employee-portal")({
  head: () => ({
    meta: [
      { title: "Employee Self-Service — WoCOS HR" },
      {
        name: "description",
        content:
          "Employees see their assignment, tasks, attendance, timesheets, payslips, leave, documents, performance and HR requests in one place.",
      },
      { property: "og:title", content: "Employee Self-Service — WoCOS HR" },
      {
        property: "og:description",
        content: "One place for assignment, tasks, leave and documents.",
      },
    ],
  }),
  component: EmployeePortalPage,
});

function EmployeePortalPage() {
  const [docOpen, setDocOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [openRequests, setOpenRequests] = useState(0);

  function requestDocument(doc: string) {
    setDocOpen(false);
    toast.success("Document request submitted", {
      description: `${doc} · HR will notify you when ready`,
    });
  }

  function raiseRequest(e: FormEvent) {
    e.preventDefault();
    if (!category.trim() || !subject.trim()) return;
    setOpenRequests((n) => n + 1);
    toast.success(`HR-${8000 + openRequests} raised`, { description: subject.trim() });
    setCategory("");
    setSubject("");
    setRequestOpen(false);
  }

  return (
    <>
      <PageHeader
        section="Portals"
        title="Employee Self-Service"
        subtitle="Viewing as Sarah Adeyemi · EMP-10442 · ABC Company, Lagos"
        actions={
          <>
            <ConsoleButton onClick={() => setDocOpen(true)}>Request document</ConsoleButton>
            <ConsoleButton variant="primary" onClick={() => setRequestOpen(true)}>
              + Raise HR Request
            </ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Open Tasks" value={2} note="induction feedback" tone="warning" />
        <StatTile label="Attendance (30d)" value="97.8%" note="1 late" tone="success" />
        <StatTile label="Leave Balance" value="18 d" note="annual" tone="info" />
        <StatTile
          label="HR Requests"
          value={openRequests}
          note={openRequests === 0 ? "none open" : `${openRequests} awaiting HR`}
          tone={openRequests === 0 ? "success" : "warning"}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="My Assignment" className="lg:col-span-2">
          <KeyValue
            rows={[
              { k: "Employee ID", v: <span className="data-cell">EMP-10442</span> },
              { k: "Role", v: "Customer Service Executive" },
              { k: "Client", v: "ABC Company" },
              { k: "Department", v: "Customer Experience" },
              { k: "Location", v: "Lagos" },
              { k: "Reporting manager", v: "Grace Umeh" },
              { k: "Start date", v: <span className="data-cell text-[11px]">2026-09-28</span> },
              { k: "Contract", v: "Full-time · 12 months" },
              { k: "Employment status", v: <StatusBadge status="active" /> },
            ]}
          />
        </Panel>

        <Panel title="My Tasks">
          <Checklist
            items={[
              { label: "Confirm emergency contact", status: "approved" },
              { label: "Acknowledge code of conduct", status: "approved" },
              { label: "Complete site induction feedback", status: "pending" },
              { label: "Upload HMO dependant details", status: "submitted" },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Leave Balances" bodyClassName="space-y-3 p-4">
          {leaveBalances.map((b) => (
            <div key={b.type}>
              <div className="mb-1.5 flex items-center justify-between font-mono text-[10px]">
                <span className="text-mute">{b.type}</span>
                <span className="text-fg">
                  {b.balance} / {b.entitled}
                </span>
              </div>
              <Progress
                value={(b.taken / b.entitled) * 100}
                tone={b.balance === 0 ? "danger" : "success"}
              />
            </div>
          ))}
        </Panel>

        <Panel title="Documents & Payroll">
          <Checklist
            items={[
              { label: "Employment contract", status: "approved" },
              { label: "Identification (NIN)", status: "approved" },
              { label: "Bank details", status: "approved" },
              { label: "Tax information", status: "approved" },
              { label: "Payslip · August 2026", status: "completed" },
              { label: "Payslip · September 2026", status: "pending" },
            ]}
          />
        </Panel>

        <Panel title="Announcements & Sonia" bodyClassName="space-y-3 p-4">
          <div className="console-inset p-3">
            <div className="console-label">Announcement</div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-dim">
              ABC Company site induction runs every Monday at 08:30. Bring your ID card and signed
              contract copy.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {soniaPrompts.slice(0, 3).map((p) => (
              <Link
                key={p}
                to="/hr/sonia"
                className="rounded bg-panel2 px-2 py-1 font-mono text-[10px] text-mute ring-1 ring-line hover:text-fg"
              >
                {p}
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <DemoNote />

      <Dialog open={docOpen} onOpenChange={setDocOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a document</DialogTitle>
            <DialogDescription>Choose a document to request from HR.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            {documentOptions.map((doc) => (
              <button
                key={doc}
                type="button"
                onClick={() => requestDocument(doc)}
                className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line transition-colors hover:text-fg"
              >
                {doc}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise an HR request</DialogTitle>
            <DialogDescription>
              Sends a request to your HR team (demo data, local only).
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-3" onSubmit={raiseRequest}>
            <label className="block space-y-1 text-[12px] text-dim">
              <span>Category</span>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Leave, Payroll, Contract"
                className="h-9 w-full rounded-md bg-panel2 px-3 text-[12.5px] text-fg ring-1 ring-line outline-none focus:ring-teal/40"
                required
              />
            </label>
            <label className="block space-y-1 text-[12px] text-dim">
              <span>Subject</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-9 w-full rounded-md bg-panel2 px-3 text-[12.5px] text-fg ring-1 ring-line outline-none focus:ring-teal/40"
                required
              />
            </label>
            <DialogFooter>
              <ConsoleButton variant="primary" type="submit">
                Submit request
              </ConsoleButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
