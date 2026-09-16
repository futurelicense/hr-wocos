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
  Timeline,
} from "@/components/hr/primitives";
import { offers as initialOffers } from "@/lib/hr/data";
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

type Offer = (typeof initialOffers)[number];

export const Route = createFileRoute("/hr/offers")({
  head: () => ({
    meta: [
      { title: "Offers — WoCOS HR" },
      {
        name: "description",
        content:
          "Generate, approve, send and track employment offers. Accepted offers automatically open a digital onboarding case.",
      },
      { property: "og:title", content: "Offers — WoCOS HR" },
      { property: "og:description", content: "Offer approval, dispatch and acceptance tracking." },
    ],
  }),
  component: OffersPage,
});

let nextOfferSeq = 990;

function OffersPage() {
  const [offerList, setOfferList] = useState<Offer[]>(initialOffers);
  const [statusFilter, setStatusFilter] = useState("All");
  const [generateOpen, setGenerateOpen] = useState(false);
  const focus = offerList[0]!;
  const filtered = offerList.filter(
    (o) => statusFilter === "All" || labelize(o.status) === statusFilter,
  );

  const requestApproval = () => {
    const draft = offerList.find((o) => o.status === "draft");
    if (!draft) {
      toast.info("No draft offers waiting on approval");
      return;
    }
    setOfferList((prev) =>
      prev.map((o) => (o.id === draft.id ? { ...o, status: "awaiting_approval" } : o)),
    );
    toast.success(`Approval requested for ${draft.candidate}`, { description: draft.id });
  };

  const generateOffer = (form: FormData) => {
    const candidate = String(form.get("candidate") ?? "").trim();
    const position = String(form.get("position") ?? "").trim();
    if (!candidate || !position) return;
    const created: Offer = {
      id: `OFR-${nextOfferSeq--}`,
      candidate,
      position,
      client: String(form.get("client") ?? "").trim() || "—",
      salary: String(form.get("salary") ?? "").trim() || "—",
      employment_type: String(form.get("employment_type") ?? "Full-time"),
      start_date: String(form.get("start_date") ?? "—"),
      offer_date: "—",
      expiry: "—",
      status: "draft",
    };
    setOfferList((prev) => [created, ...prev]);
    setGenerateOpen(false);
    toast.success(`Offer generated for ${candidate}`, { description: created.id });
  };

  return (
    <>
      <PageHeader
        section="Talent"
        title="Offers"
        subtitle="5 offers in flight · 88% acceptance rate · 1 expired without response"
        actions={
          <>
            <ConsoleButton onClick={requestApproval}>Request approval</ConsoleButton>
            <ConsoleButton variant="primary" onClick={() => setGenerateOpen(true)}>
              + Generate Offer
            </ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile label="Draft" value={1} note="awaiting salary sign-off" tone="neutral" />
        <StatTile label="Awaiting Approval" value={1} note="HR Manager" tone="warning" />
        <StatTile label="Sent" value={1} note="expires in 7 days" tone="info" />
        <StatTile label="Accepted" value={1} note="onboarding opened" tone="success" />
        <StatTile label="Expired" value={1} note="re-issue or close" tone="danger" />
      </div>

      <FilterBar
        filters={["All", "Awaiting Approval", "Sent", "Accepted", "Declined", "Expired"]}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <Panel title="Offer Register" meta={`${filtered.length} of ${offerList.length} shown`}>
        <DataTable
          columns={[
            "Offer",
            "Candidate",
            "Position",
            "Client",
            "Salary",
            "Type",
            "Start",
            "Expiry",
            "Status",
          ]}
          rows={filtered.map((o) => [
            <span className="data-cell text-[11px] text-sky">{o.id}</span>,
            <span className="text-fg">{o.candidate}</span>,
            o.position,
            <span className="text-dim">{o.client}</span>,
            <span className="data-cell text-[11px]">{o.salary}</span>,
            <span className="text-dim">{o.employment_type}</span>,
            <span className="data-cell text-[11px]">{o.start_date}</span>,
            <span className="data-cell text-[11px] text-dim">{o.expiry}</span>,
            <StatusBadge status={o.status} />,
          ])}
        />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel
          title={`Offer ${focus.id}`}
          meta={focus.candidate}
          action={<StatusBadge status={focus.status} />}
          className="lg:col-span-2"
        >
          <KeyValue
            rows={[
              { k: "Candidate", v: focus.candidate },
              { k: "Position", v: focus.position },
              { k: "Client", v: focus.client },
              { k: "Salary", v: <span className="data-cell">{focus.salary}</span> },
              { k: "Employment type", v: focus.employment_type },
              {
                k: "Offer date",
                v: <span className="data-cell text-[11px]">{focus.offer_date}</span>,
              },
              {
                k: "Expiry date",
                v: <span className="data-cell text-[11px]">{focus.expiry}</span>,
              },
              {
                k: "Start date",
                v: <span className="data-cell text-[11px]">{focus.start_date}</span>,
              },
              { k: "Verification", v: <StatusBadge status="cleared" /> },
              { k: "Approval chain", v: "Recruiter → HR Manager → Client Manager" },
            ]}
          />
        </Panel>

        <Panel title="Offer Trail" bodyClassName="space-y-4 p-4">
          <Timeline
            items={[
              { time: "10 Sep 11:20", text: "Offer accepted by candidate", actor: "Candidate" },
              { time: "08 Sep 14:05", text: "Offer sent via email", actor: "HR Admin" },
              { time: "08 Sep 09:48", text: "Approved by HR Manager", actor: "S. Okafor" },
              { time: "07 Sep 16:12", text: "Offer generated from template", actor: "Recruiter" },
            ]}
          />
          <div className="rounded-md bg-teal/8 p-3 ring-1 ring-teal/25">
            <div className="console-label text-teal">Automation fired</div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-dim">
              Offer accepted → digital onboarding case created for Sarah Adeyemi with the ABC
              Company checklist variant.
            </p>
          </div>
        </Panel>
      </div>

      <DemoNote />

      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Offer</DialogTitle>
            <DialogDescription>Creates a new draft offer in the register.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              generateOffer(new FormData(e.currentTarget));
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="ofr-candidate">Candidate</Label>
              <Input id="ofr-candidate" name="candidate" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ofr-position">Position</Label>
              <Input id="ofr-position" name="position" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ofr-client">Client</Label>
                <Input id="ofr-client" name="client" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ofr-salary">Salary</Label>
                <Input id="ofr-salary" name="salary" placeholder="₦0 / mo" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ofr-start">Start date</Label>
              <Input id="ofr-start" name="start_date" type="date" />
            </div>
            <DialogFooter>
              <ConsoleButton type="submit" variant="primary">
                Generate Offer
              </ConsoleButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
