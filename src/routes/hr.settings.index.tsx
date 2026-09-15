import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ConsoleButton,
  DataTable,
  DemoNote,
  PageHeader,
  Panel,
  StatTile,
  StatusBadge,
} from "@/components/hr/primitives";
import { roles } from "@/lib/hr/nav";
import { configurableItems, lifecycle } from "@/lib/hr/data";

export const Route = createFileRoute("/hr/settings/")({
  head: () => ({
    meta: [
      { title: "HR Settings — WoCOS HR" },
      {
        name: "description",
        content:
          "Configure recruitment stages, scorecards, onboarding checklists, deployment requirements, leave types, approval chains, roles and permissions.",
      },
      { property: "og:title", content: "HR Settings — WoCOS HR" },
      { property: "og:description", content: "Configuration-driven HR: stages, checklists, roles and permissions." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader
        section="Administration"
        title="HR Settings"
        subtitle="15 configurable areas · 10 roles · 84 permission flags"
        actions={
          <>
            <Link
              to="/hr/settings/workflows"
              className="flex h-9 items-center rounded-md bg-panel2 px-3.5 text-[13px] font-medium text-dim ring-1 ring-line hover:text-fg"
            >
              Workflow Configuration
            </Link>
            <ConsoleButton variant="primary">Save Changes</ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Configurable Areas" value={15} note="2 under review" tone="info" />
        <StatTile label="Roles" value={roles.length} note="role-based access" tone="success" />
        <StatTile label="Notification Templates" value={23} note="email + in-app" tone="info" />
        <StatTile label="Client Profiles" value={6} note="custom requirements" tone="success" />
      </div>

      <Panel title="Configuration" meta={`${configurableItems.length} areas`} bodyClassName="p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {configurableItems.map((c) => (
            <button
              key={c.id}
              type="button"
              className="console-inset p-3 text-left transition-colors hover:bg-panel"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[13px] font-medium text-fg">{c.label}</span>
                <StatusBadge status={c.status} />
              </div>
              <div className="mt-1.5 font-mono text-[10px] text-mute">{c.detail}</div>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Roles" meta={`${roles.length} defined`}>
          <DataTable
            columns={["Role", "Identifier", "Scope"]}
            rows={roles.map((r) => [
              <span className="text-fg">{r.name}</span>,
              <span className="data-cell text-[11px] text-sky">{r.id}</span>,
              <span className="text-dim">
                {r.id === "client_user"
                  ? "Client-scoped"
                  : r.id === "employee"
                    ? "Self-scoped"
                    : r.id === "executive"
                      ? "Read-only, organisation-wide"
                      : "Organisation-wide"}
              </span>,
            ])}
          />
        </Panel>

        <Panel title="Lifecycle Stages" meta="16 stages">
          <ul className="grid grid-cols-2 gap-1.5">
            {lifecycle.map((s) => (
              <li key={s.id} className="flex items-center gap-2 rounded-md bg-panel2 px-2.5 py-1.5 ring-1 ring-line">
                <span className="data-cell text-[10px] text-mute">
                  {String(s.order).padStart(2, "0")}
                </span>
                <span className="truncate text-[12px] text-dim">{s.label}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
