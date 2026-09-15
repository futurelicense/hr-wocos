import { createFileRoute } from "@tanstack/react-router";
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
import { offers } from "@/lib/hr/data";

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

function OffersPage() {
  const focus = offers[0];

  return (
    <>
      <PageHeader
        section="Talent"
        title="Offers"
        subtitle="5 offers in flight · 88% acceptance rate · 1 expired without response"
        actions={
          <>
            <ConsoleButton>Request approval</ConsoleButton>
            <ConsoleButton variant="primary">+ Generate Offer</ConsoleButton>
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

      <FilterBar filters={["All", "Awaiting Approval", "Sent", "Accepted", "Declined", "Expired"]} />

      <Panel title="Offer Register" meta={`${offers.length} records`}>
        <DataTable
          columns={["Offer", "Candidate", "Position", "Client", "Salary", "Type", "Start", "Expiry", "Status"]}
          rows={offers.map((o) => [
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
              { k: "Offer date", v: <span className="data-cell text-[11px]">{focus.offer_date}</span> },
              { k: "Expiry date", v: <span className="data-cell text-[11px]">{focus.expiry}</span> },
              { k: "Start date", v: <span className="data-cell text-[11px]">{focus.start_date}</span> },
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
              Offer accepted → digital onboarding case created for Sarah Adeyemi with the ABC Company checklist variant.
            </p>
          </div>
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
