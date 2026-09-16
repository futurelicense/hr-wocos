import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Checklist,
  ConsoleButton,
  DataTable,
  DemoNote,
  FilterBar,
  PageHeader,
  Panel,
  Progress,
  StatTile,
  StatusBadge,
  Timeline,
} from "@/components/hr/primitives";
import { onboardingCases, onboardingChecklist } from "@/lib/hr/data";
import { labelize } from "@/lib/hr/status";

type OnboardingCase = (typeof onboardingCases)[number];

export const Route = createFileRoute("/hr/onboarding")({
  head: () => ({
    meta: [
      { title: "Digital Onboarding — WoCOS HR" },
      {
        name: "description",
        content:
          "A twelve-item digital onboarding checklist per hire: documents, contract, bank, tax, pension, policies, client requirements and induction.",
      },
      { property: "og:title", content: "Digital Onboarding — WoCOS HR" },
      {
        property: "og:description",
        content: "Twelve-item onboarding checklists with document review.",
      },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const [cases, setCases] = useState<OnboardingCase[]>(() => onboardingCases);
  const [filter, setFilter] = useState("All");
  const blocked = cases.filter((c) => c.status === "blocked");
  const filtered = filter === "All" ? cases : cases.filter((c) => labelize(c.status) === filter);
  const workingCase = cases.find((c) => c.status !== "completed") ?? cases[0]!;

  const updateCase = (candidate: string, updater: (c: OnboardingCase) => OnboardingCase) => {
    setCases((prev) => prev.map((c) => (c.candidate === candidate ? updater(c) : c)));
  };

  const sendReminders = () => {
    toast.success(
      `Reminders sent to ${blocked.length} blocked case${blocked.length === 1 ? "" : "s"}`,
    );
  };

  const openReviewQueue = () => {
    setFilter("Under Review");
    toast.info("Filtered to the review queue");
  };

  const requestDocument = () => {
    toast.info("Document request sent", { description: workingCase.candidate });
  };

  const reviewDocument = () => {
    updateCase(workingCase.candidate, (c) => ({
      ...c,
      status: c.status === "blocked" ? "under_review" : c.status,
    }));
    toast.success("Marked for HR review", { description: workingCase.candidate });
  };

  const approveItem = () => {
    updateCase(workingCase.candidate, (c) => {
      const progress = Math.min(100, c.progress + 25);
      return {
        ...c,
        progress,
        status: progress === 100 ? "completed" : c.status === "blocked" ? "under_review" : c.status,
      };
    });
    toast.success("Checklist item approved", { description: workingCase.candidate });
  };

  const completeOnboarding = () => {
    updateCase(workingCase.candidate, (c) => ({ ...c, progress: 100, status: "completed" }));
    toast.success("Onboarding completed", { description: workingCase.candidate });
  };

  const rowActions: Record<string, () => void> = {
    "Request document": requestDocument,
    "Review document": reviewDocument,
    "Approve item": approveItem,
    "Complete onboarding": completeOnboarding,
  };

  return (
    <>
      <PageHeader
        section="Onboard"
        title="Digital Onboarding"
        subtitle="11 cases in flight · 81% average completion · 2 blocked on missing bank details"
        actions={
          <>
            <ConsoleButton onClick={sendReminders}>Send reminders</ConsoleButton>
            <ConsoleButton variant="primary" onClick={openReviewQueue}>
              Review Queue (4)
            </ConsoleButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile label="Not Started" value={1} note="starts 12 Oct" tone="neutral" />
        <StatTile label="In Progress" value={2} note="on track" tone="info" />
        <StatTile label="Blocked" value={2} note="missing documents" tone="danger" />
        <StatTile label="Under Review" value={1} note="HR verifying" tone="warning" />
        <StatTile label="Completed" value={1} note="ready for readiness check" tone="success" />
      </div>

      <FilterBar
        filters={["All", "In Progress", "Blocked", "Under Review", "Completed"]}
        value={filter}
        onChange={setFilter}
      />

      <Panel title="Onboarding Cases" meta={`${filtered.length} shown`}>
        <DataTable
          columns={["Candidate", "Client", "Start Date", "Completion", "Status"]}
          widths={["24%", "20%", "14%", "26%", "16%"]}
          rows={filtered.map((c) => [
            <span className="text-fg">{c.candidate}</span>,
            <span className="text-dim">{c.client}</span>,
            <span className="data-cell text-[11px]">{c.start}</span>,
            <span className="flex items-center gap-2">
              <Progress
                value={c.progress}
                tone={
                  c.progress === 100 ? "success" : c.status === "blocked" ? "danger" : "warning"
                }
              />
              <span className="data-cell w-9 shrink-0 text-right text-[11px]">{c.progress}%</span>
            </span>,
            <StatusBadge status={c.status} />,
          ])}
        />
      </Panel>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Checklist · Sarah Adeyemi" meta="12 of 12 approved" className="lg:col-span-2">
          <Checklist
            items={onboardingChecklist.map((i) => ({ label: i.label, status: i.status }))}
          />
        </Panel>

        <Panel title="Blocked Items" bodyClassName="space-y-4 p-4">
          <ul className="space-y-2">
            {blocked.map((b) => (
              <li key={b.candidate} className="rounded-md bg-coral/8 p-3 ring-1 ring-coral/25">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12.5px] text-fg">{b.candidate}</span>
                  <StatusBadge status="blocked" />
                </div>
                <p className="mt-1 font-mono text-[10px] text-mute">
                  {b.client} · bank details and statutory information outstanding
                </p>
              </li>
            ))}
          </ul>
          <Timeline
            items={[
              { time: "14 Sep 08:20", text: "Reminder sent to Ngozi Eze", actor: "System" },
              { time: "13 Sep 17:41", text: "Contract signed by Emeka Nwosu", actor: "Candidate" },
              {
                time: "12 Sep 16:02",
                text: "Onboarding completed for Sarah Adeyemi",
                actor: "HR Admin",
              },
            ]}
          />
          <div className="space-y-2">
            {["Request document", "Review document", "Approve item", "Complete onboarding"].map(
              (a) => (
                <button
                  key={a}
                  type="button"
                  onClick={rowActions[a]}
                  className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12.5px] text-dim ring-1 ring-line hover:text-fg"
                >
                  {a}
                </button>
              ),
            )}
          </div>
        </Panel>
      </div>

      <DemoNote />
    </>
  );
}
