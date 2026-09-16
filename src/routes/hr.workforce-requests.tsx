import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ConsoleButton,
  DataTable,
  DemoNote,
  FilterBar,
  KeyValue,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
import { workforceRequests as initialRequests } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type WorkforceRequest = (typeof initialRequests)[number];

const statuses = [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "recruiting",
  "partially_filled",
  "filled",
  "closed",
];

export const Route = createFileRoute("/hr/workforce-requests")({
  head: () => ({
    meta: [
      { title: "Workforce Requests — WoCOS HR" },
      {
        name: "description",
        content:
          "Raise, review and approve client workforce requests, then activate vacancies and assign recruiters across the TeamAce workforce.",
      },
      { property: "og:title", content: "Workforce Requests — WoCOS HR" },
      { property: "og:description", content: "From client request to vacancy activation." },
    ],
  }),
  component: WorkforceRequestsPage,
});

let nextRequestSeq = 2050;

function WorkforceRequestsPage() {
  const [requestList, setRequestList] = useState<WorkforceRequest[]>(initialRequests);
  const [focusId, setFocusId] = useState(initialRequests[1]!.id);
  const [statusFilter, setStatusFilter] = useState("All");
  const [openOnly, setOpenOnly] = useState(true);
  const [newOpen, setNewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const selected = requestList.find((r) => r.id === focusId) ?? requestList[0]!;
  const recruiters = Array.from(
    new Set(initialRequests.map((r) => r.recruiter).filter((r) => r !== "—")),
  );

  const visible = requestList.filter((r) => {
    if (openOnly && (r.status === "filled" || r.status === "closed")) return false;
    return statusFilter === "All" || labelize(r.status) === statusFilter;
  });

  const updateSelected = (patch: Partial<WorkforceRequest>) => {
    setRequestList((prev) => prev.map((r) => (r.id === selected.id ? { ...r, ...patch } : r)));
  };

  const submitRequest = () => {
    if (selected.status !== "draft") {
      toast.info(`${selected.id} is already ${labelize(selected.status)}`);
      return;
    }
    updateSelected({ status: "submitted" });
    toast.success(`${selected.id} submitted for review`);
  };

  const approveRequest = () => {
    if (selected.status !== "submitted" && selected.status !== "under_review") {
      toast.info(`${selected.id} is not awaiting approval`);
      return;
    }
    updateSelected({ status: "approved" });
    toast.success(`${selected.id} approved`, {
      description: "A vacancy will be raised automatically",
    });
  };

  const rejectRequest = () => {
    updateSelected({ status: "draft" });
    setRejectOpen(false);
    toast.success(`${selected.id} sent back to draft`);
  };

  const activateVacancy = () => {
    if (selected.status !== "approved") {
      toast.info("Approve the request before activating a vacancy");
      return;
    }
    updateSelected({ status: "recruiting" });
    toast.success(`Vacancy activated for ${selected.title}`, { description: selected.client });
  };

  const addRequest = (form: FormData) => {
    const title = String(form.get("title") ?? "").trim();
    const client = String(form.get("client") ?? "").trim();
    if (!title || !client) return;
    const created: WorkforceRequest = {
      id: `WR-${nextRequestSeq++}`,
      client,
      title,
      quantity: Number(form.get("quantity") ?? 1) || 1,
      location: String(form.get("location") ?? "").trim() || "—",
      employment_type: String(form.get("employment_type") ?? "Full-time"),
      priority: String(form.get("priority") ?? "medium"),
      recruiter: "—",
      target_start: String(form.get("target_start") ?? "—"),
      status: "draft",
      salary_budget: "—",
      experience: "—",
      skills: [],
    };
    setRequestList((prev) => [created, ...prev]);
    setFocusId(created.id);
    setNewOpen(false);
    toast.success(`${created.id} created`, { description: title });
  };

  return (
    <>
      <PageHeader
        section="Talent"
        title="Workforce Requests"
        subtitle="18 requests this quarter · 26 positions requested · 3 awaiting your approval"
        actions={
          <>
            <ConsoleButton onClick={() => toast.success("Draft saved")}>Save Draft</ConsoleButton>
            <ConsoleButton variant="primary" onClick={() => setNewOpen(true)}>
              + New Request
            </ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Awaiting Approval" value={3} note="oldest 2 days" tone="warning" />
        <StatTile label="Recruiting" value={6} note="26 positions" tone="info" />
        <StatTile label="Partially Filled" value={2} note="9 of 14 filled" tone="warning" />
        <StatTile label="Filled This Month" value={7} note="avg 24 days" tone="success" />
      </div>

      <Panel
        title="All Requests"
        meta={`${visible.length} of ${requestList.length} shown`}
        bodyClassName="space-y-3 p-4"
        action={
          <ConsoleButton className="h-8 px-2.5 text-[11px]" onClick={() => setOpenOnly((v) => !v)}>
            Saved view: {openOnly ? "Open" : "All"}
          </ConsoleButton>
        }
      >
        <FilterBar
          filters={["All", ...statuses.slice(0, 5).map(labelize)]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <DataTable
          columns={[
            "Request",
            "Client",
            "Role",
            "Qty",
            "Location",
            "Priority",
            "Recruiter",
            "Target Start",
            "Status",
          ]}
          rows={visible.map((r) => [
            <span className="data-cell text-[11px] text-sky">{r.id}</span>,
            r.client,
            <span className="text-fg">{r.title}</span>,
            <span className="data-cell">{r.quantity}</span>,
            <span className="text-dim">{r.location}</span>,
            <StatusBadge status={r.priority} />,
            <span className="text-dim">{r.recruiter}</span>,
            <span className="data-cell text-[11px] text-dim">{r.target_start}</span>,
            <StatusBadge status={r.status} />,
          ])}
        />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel
          title={`Request ${selected.id}`}
          meta="detail"
          action={<StatusBadge status={selected.status} />}
          className="lg:col-span-2"
        >
          <KeyValue
            rows={[
              { k: "Client", v: selected.client },
              { k: "Job title", v: selected.title },
              { k: "Quantity", v: `${selected.quantity} positions` },
              { k: "Location", v: selected.location },
              { k: "Employment type", v: selected.employment_type },
              { k: "Experience", v: selected.experience },
              {
                k: "Salary budget",
                v: <span className="data-cell">{selected.salary_budget}</span>,
              },
              {
                k: "Target start date",
                v: <span className="data-cell">{selected.target_start}</span>,
              },
              { k: "Assigned recruiter", v: selected.recruiter },
              { k: "Priority", v: <StatusBadge status={selected.priority} /> },
              {
                k: "Required skills",
                v: (
                  <span className="flex flex-wrap justify-end gap-1">
                    {selected.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-panel2 px-1.5 py-0.5 font-mono text-[10px] text-dim ring-1 ring-line"
                      >
                        {s}
                      </span>
                    ))}
                  </span>
                ),
              },
              {
                k: "Documents",
                v: <span className="text-dim">Job spec · Client SLA · Site profile</span>,
              },
            ]}
          />
          <p className="mt-3 text-[12.5px] leading-relaxed text-dim">
            Supervise inbound and outbound goods flow across two Lagos hubs, lead a team of 9
            handlers, own daily cycle counts and enforce site safety procedures. Reports to the
            client operations supervisor.
          </p>
        </Panel>

        <Panel title="Workflow Actions">
          <div className="space-y-2">
            <button
              type="button"
              onClick={submitRequest}
              className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={approveRequest}
              className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => setRejectOpen(true)}
              className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => setAssignOpen(true)}
              className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
            >
              Assign recruiter
            </button>
            <button
              type="button"
              onClick={activateVacancy}
              className="w-full rounded-md bg-teal px-3 py-2 text-left text-[12.5px] font-semibold text-ink ring-1 ring-teal"
            >
              Activate vacancy
            </button>
          </div>
          <div className="mt-4 rounded-md bg-panel2 p-3 ring-1 ring-line">
            <div className="console-label">Automation</div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-dim">
              On approval, a vacancy is created automatically and the assigned recruiter is
              notified.
            </p>
          </div>
        </Panel>
      </div>

      <DemoNote />

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Workforce Request</DialogTitle>
            <DialogDescription>Raises a draft request for client approval.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              addRequest(new FormData(e.currentTarget));
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="wr-client">Client</Label>
                <Input id="wr-client" name="client" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wr-title">Job title</Label>
                <Input id="wr-title" name="title" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="wr-quantity">Quantity</Label>
                <Input id="wr-quantity" name="quantity" type="number" min={1} defaultValue={1} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wr-location">Location</Label>
                <Input id="wr-location" name="location" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="wr-start">Target start date</Label>
              <Input id="wr-start" name="target_start" type="date" />
            </div>
            <DialogFooter>
              <ConsoleButton type="submit" variant="primary">
                Create Request
              </ConsoleButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Recruiter · {selected.id}</DialogTitle>
            <DialogDescription>Choose a recruiter to own this request.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            {recruiters.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  updateSelected({ recruiter: name });
                  setAssignOpen(false);
                  toast.success(`${name} assigned to ${selected.id}`);
                }}
                className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
              >
                {name}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject {selected.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              This sends "{selected.title}" for {selected.client} back to draft. This can be undone
              by resubmitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={rejectRequest}>Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
