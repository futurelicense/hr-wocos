import { createFileRoute } from "@tanstack/react-router";
import {
  BarList,
  ConsoleButton,
  DataTable,
  DemoNote,
  FilterBar,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
import { complianceAlertWindows, complianceItems } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

export const Route = createFileRoute("/hr/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance — WoCOS HR" },
      {
        name: "description",
        content:
          "Track contracts, identity documents, tax, pension, health benefits, certifications, background checks and client requirements with expiry alerting.",
      },
      { property: "og:title", content: "Compliance — WoCOS HR" },
      { property: "og:description", content: "Document and certification compliance with expiry alerting." },
    ],
  }),
  component: CompliancePage,
});

function CompliancePage() {
  return (
    <>
      <PageHeader
        section="HR Operations"
        title="Compliance"
        subtitle="94% compliance rate · 12 items expiring within 30 days · 3 already expired"
        actions={
          <>
            <ConsoleButton>Alert settings</ConsoleButton>
            <ConsoleButton variant="primary">Expired (3)</ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile label="Compliant" value={174} note="94% of workforce" tone="success" />
        <StatTile label="Expiring" value={12} note="within 30 days" tone="warning" />
        <StatTile label="Expired" value={3} note="action required" tone="danger" />
        <StatTile label="Missing" value={5} note="never supplied" tone="danger" />
        <StatTile label="Under Review" value={4} note="HR verifying" tone="warning" />
      </div>

      <Panel title="Alert Windows" meta="contract and document expiry" bodyClassName="p-4">
        <div className="grid gap-3 sm:grid-cols-4">
          {complianceAlertWindows.map((w) => (
            <div key={w.window} className="console-inset p-3">
              <div className="console-label">{w.window}</div>
              <div className="numeral mt-2 text-[22px]">{w.count}</div>
              <div className="mt-2">
                <StatusBadge status={w.tone === "danger" ? "expired" : "expiring"} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <FilterBar filters={["All", "Compliant", "Expiring", "Expired", "Missing", "Under Review"]} />

      <Panel title="Compliance Register" meta={`${complianceItems.length} shown`}>
        <DataTable
          columns={["Category", "Item", "Expires", "Status"]}
          rows={complianceItems.map((c) => [
            <span className="text-dim">{labelize(c.category)}</span>,
            <span className="text-fg">{c.item}</span>,
            <span className="data-cell text-[11px]">{c.expires}</span>,
            <StatusBadge status={c.status} />,
          ])}
        />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Compliance by Category" meta="items on file">
          <BarList
            items={[
              { label: "Employment contracts", value: 186 },
              { label: "Identity documents", value: 181 },
              { label: "Tax", value: 178 },
              { label: "Pension", value: 174 },
              { label: "Health benefits", value: 169 },
              { label: "Certifications", value: 92 },
              { label: "Background checks", value: 186 },
              { label: "Client requirements", value: 141 },
            ]}
          />
        </Panel>

        <Panel title="Automation">
          <p className="text-[12.5px] leading-relaxed text-dim">
            Contracts and certifications nearing expiry raise a compliance alert at 30, 14 and 7 days, and again on the
            expiry date. Alerts surface on the command center and in the responsible manager's queue.
          </p>
          <div className="mt-3 space-y-2">
            {["30 days", "14 days", "7 days", "Expired"].map((w, i) => (
              <div key={w} className="flex items-center justify-between rounded-md bg-panel2 px-3 py-2 ring-1 ring-line">
                <span className="text-[12.5px] text-dim">{w} before expiry</span>
                <StatusBadge status={i === 3 ? "expired" : "expiring"} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
