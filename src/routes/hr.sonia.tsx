import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ConsoleButton, DemoNote, PageHeader, Panel, StatusBadge } from "@/components/hr/primitives";
import { soniaBrief, soniaPrompts } from "@/lib/hr/data";

type Message = { role: "sonia" | "user"; text: string };

const answers: Record<string, string> = {
  "What requires my attention today?":
    "Four things. One verification exception (Tobi Balogun, employment check failed). Two onboarding cases blocked on bank details. Twelve contracts expiring within 14 days. Three HR requests past SLA and already escalated to you.",
  "Which candidates are awaiting verification?":
    "Five cases are open: Ifeoma Chukwu (in progress), Tobi Balogun (exception), Aisha Bello (awaiting consent), Chinedu Okafor (pending) and one Bluewave candidate not yet consented. Three of the eight pending checks are stuck on consent.",
  "Show employees whose onboarding is incomplete.":
    "Six cases are short of complete: Emeka Nwosu 75%, Yusuf Ibrahim 92% (under review), Aisha Bello 58%, Ngozi Eze 42% (blocked), Fatima Sani 33% (blocked) and Kelechi Obi 17% (not started).",
  "Who is ready for deployment?":
    "Seven candidates are cleared. Sarah Adeyemi (ABC Company, 28 Sep) and Yusuf Ibrahim (Harbor Foods, 21 Sep) have all eleven clearances and can be activated now. Three of the seven can start Monday.",
  "Why are some employees not deployment-ready?":
    "Missing clearances cluster in three places: bank and statutory information (4 cases), client-specific requirements and site induction (3 cases), and background verification not yet cleared (2 cases).",
  "Which client has the most open vacancies?":
    "Nexa Logistics with 4 open positions across Lagos and Ibadan, followed by ABC Company and Bluewave Retail with 3 each.",
  "Which contracts expire within the next 30 days?":
    "Twelve. The nearest are Daniel Aluko (24 Sep), Esther Bassey's HSE certification (30 Sep) and the Nexa Logistics site induction batch (14 Oct). Three items have already expired and need immediate action.",
  "Summarize unresolved payroll issues.":
    "Six exceptions, two critical: Peter Ndu has three shifts with no clock-out, and Chioma Nnaji's rejected timesheet has not been resubmitted. Both block the Nexa and Bluewave batches. Overall readiness is 91%.",
  "Which HR requests are overdue?":
    "Three: HR-7705 (workplace concern, 5 days, critical), HR-7699 (leave balance mismatch, 7 days) and HR-7694 (contract renewal terms, 9 days). All have been escalated automatically.",
  "Prepare today's HR management briefing.":
    "Headcount 186, up 6 this month. 14 vacancies open, 47 candidates in pipeline, 24-day average time to fill. 7 cleared for deployment, 11 onboarding with 2 blocked. Payroll readiness 91% with 6 exceptions. Compliance at 94% with 3 expired items. Priority actions: clear the verification exception, unblock the two onboarding cases, resolve the two critical payroll exceptions.",
};

export const Route = createFileRoute("/hr/sonia")({
  head: () => ({
    meta: [
      { title: "Sonia AI — WoCOS HR" },
      {
        name: "description",
        content:
          "Sonia is the WoCOS HR intelligence assistant: ask about attention items, verification, onboarding, deployment readiness, payroll and compliance.",
      },
      { property: "og:title", content: "Sonia AI — WoCOS HR" },
      { property: "og:description", content: "Ask about readiness, verification, payroll and compliance." },
    ],
  }),
  component: SoniaPage,
});

function SoniaPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "sonia", text: soniaBrief[0]! },
    { role: "sonia", text: soniaBrief[2]! },
  ]);
  const [draft, setDraft] = useState("");

  function ask(question: string) {
    const reply =
      answers[question] ??
      "In this prototype I answer from the illustrative demo dataset. Try one of the suggested questions to see a full response.";
    setMessages((m) => [...m, { role: "user", text: question }, { role: "sonia", text: reply }]);
    setDraft("");
  }

  return (
    <>
      <PageHeader
        section="Intelligence"
        title="Sonia · HR Intelligence Assistant"
        subtitle="Demo assistant · answers are generated from the illustrative demo dataset"
        actions={<ConsoleButton>Clear thread</ConsoleButton>}
      />

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel
          title={
            <span className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-md bg-sky/12 ring-1 ring-sky/30">
                <span className="font-mono text-[11px] text-sky">S</span>
              </span>
              Conversation
            </span>
          }
          action={<StatusBadge status="demo_assistant" tone="info" />}
          className="lg:col-span-2"
          bodyClassName="flex flex-col gap-3 p-4"
        >
          <div className="max-h-[480px] space-y-3 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-lg bg-teal/12 px-3 py-2 text-[12.5px] text-fg ring-1 ring-teal/25"
                    : "max-w-[85%] rounded-lg bg-panel2 px-3 py-2 text-[12.5px] leading-relaxed text-dim ring-1 ring-line"
                }
              >
                {m.role === "sonia" ? <span className="console-label mb-1 block text-sky">Sonia</span> : null}
                {m.text}
              </div>
            ))}
          </div>

          <form
            className="flex gap-2 border-t border-line pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) ask(draft.trim());
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask Sonia about your workforce…"
              className="h-9 flex-1 rounded-md bg-panel2 px-3 text-[12.5px] text-fg ring-1 ring-line outline-none placeholder:text-mute focus:ring-teal/40"
            />
            <ConsoleButton variant="primary" className="px-4">
              Ask
            </ConsoleButton>
          </form>
        </Panel>

        <Panel title="Suggested Questions" bodyClassName="space-y-1.5 p-4">
          {soniaPrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => ask(p)}
              className="w-full rounded-md bg-panel2 px-3 py-2 text-left text-[12px] text-dim ring-1 ring-line transition-colors hover:text-fg"
            >
              {p}
            </button>
          ))}
        </Panel>
      </div>

      <div className="rounded-lg bg-sky/8 p-3 ring-1 ring-sky/25">
        <p className="text-[12px] leading-relaxed text-dim">
          <span className="font-mono text-[10px] tracking-[0.14em] text-sky uppercase">Proposed capability</span> — in
          this prototype Sonia responds from the demo dataset. Live reasoning over your real workforce data is proposed,
          not yet operational.
        </p>
      </div>

      <DemoNote />
    </>
  );
}
