import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { org } from "@/lib/hr/data";
import { roles } from "@/lib/hr/nav";
import { cn } from "@/lib/utils";
import { DemoNote } from "@/components/hr/primitives";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — WoCOS HR Workforce Console" },
      {
        name: "description",
        content:
          "Demo sign-in for the WoCOS HR workforce operations console. Choose a role to explore the TeamAce prototype.",
      },
      { property: "og:title", content: "Sign in — WoCOS HR Workforce Console" },
      {
        property: "og:description",
        content: "Demo sign-in for the WoCOS HR workforce operations console.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sonia.okafor@teamace.com");
  const [password, setPassword] = useState("demo1234");
  const [roleId, setRoleId] = useState("hr_manager");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate({ to: "/hr" });
  }

  return (
    <div className="flex min-h-screen bg-ink font-sans text-fg">
      <aside className="hidden flex-1 flex-col justify-between border-r border-line bg-panel p-10 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-teal/12 ring-1 ring-teal/30">
            <span className="font-mono text-[13px] font-semibold text-teal">W</span>
          </span>
          <span className="leading-tight">
            <span className="font-display block text-[13px] font-semibold tracking-tight">{org.product}</span>
            <span className="block font-mono text-[9px] tracking-[0.18em] text-mute uppercase">{org.name}</span>
          </span>
        </div>

        <div className="max-w-md">
          <div className="console-label">Workforce Operations</div>
          <h2 className="font-display mt-3 text-[30px] leading-tight font-semibold tracking-tight">
            From workforce request to client deployment, in one console.
          </h2>
          <p className="mt-4 text-[13px] leading-relaxed text-dim">
            Recruitment, verification, onboarding, deployment readiness and workforce operations for the full
            employee lifecycle.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { label: "Workforce", value: "186" },
              { label: "Vacancies", value: "14" },
              { label: "Deploy ready", value: "7" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-panel2 p-3 ring-1 ring-line">
                <div className="numeral text-[20px] leading-none">{s.value}</div>
                <div className="console-label mt-2 truncate">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <DemoNote />
      </aside>

      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="console-label">Secure Access</div>
          <h1 className="font-display mt-1.5 text-[22px] leading-none font-semibold">Sign in to WoCOS HR</h1>
          <p className="mt-2 font-mono text-[11px] text-mute">Demo sign-in — no credentials are verified.</p>

          <form onSubmit={onSubmit} className="console-panel mt-5 space-y-4 p-4">
            <label className="block">
              <span className="console-label">Work email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="mt-1.5 h-9 w-full rounded-md bg-panel2 px-3 text-[13px] text-fg ring-1 ring-line outline-none focus:ring-teal/50"
              />
            </label>

            <label className="block">
              <span className="console-label">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-1.5 h-9 w-full rounded-md bg-panel2 px-3 text-[13px] text-fg ring-1 ring-line outline-none focus:ring-teal/50"
              />
            </label>

            <label className="block">
              <span className="console-label">Sign in as</span>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-md bg-panel2 px-2.5 text-[13px] text-fg ring-1 ring-line outline-none focus:ring-teal/50"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center justify-between font-mono text-[11px]">
              <label className="flex items-center gap-2 text-mute">
                <input type="checkbox" defaultChecked className="size-3 accent-teal" />
                Keep me signed in
              </label>
              <span className="text-mute">Forgot password?</span>
            </div>

            <button
              type="submit"
              className={cn(
                "h-9 w-full rounded-md bg-teal text-[13px] font-medium text-ink ring-1 ring-teal transition-colors hover:bg-teal/90",
              )}
            >
              Enter console
            </button>
          </form>

          <p className="mt-4 font-mono text-[10px] tracking-[0.1em] text-mute uppercase">
            Prototype access — authentication not operational
          </p>
        </div>
      </main>
    </div>
  );
}
