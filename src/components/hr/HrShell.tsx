import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/hr/nav";
import { org } from "@/lib/hr/data";
import { toneClasses } from "@/lib/hr/status";
import { signOut, useSession } from "@/hooks/use-session";

function activeLabel(pathname: string) {
  const all = navigation.flatMap((s) => s.items.map((i) => ({ ...i, section: s.section })));
  const match = all
    .filter((i) => pathname === i.route || pathname.startsWith(i.route + "/"))
    .sort((a, b) => b.route.length - a.route.length)[0];
  return match ?? { label: "HR Command Center", section: "Overview", route: "/hr" };
}

export function HrShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = activeLabel(pathname);
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      void navigate({ to: "/login", replace: true });
    }
  }, [session, navigate]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink font-mono text-[12px] text-mute">
        Checking session…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ink font-sans text-fg">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-panel md:flex">
        <Link to="/hr" className="flex h-14 items-center gap-2.5 border-b border-line px-4">
          <span className="grid h-7 min-w-7 place-items-center rounded-md bg-teal/12 px-1.5 ring-1 ring-teal/30">
            <span className="font-mono text-[12px] font-semibold tracking-tight text-teal">WH</span>
          </span>
          <span className="leading-tight">
            <span className="font-display block text-[13px] font-semibold tracking-tight">{org.product}</span>
            <span className="block font-mono text-[9px] tracking-[0.18em] text-mute uppercase">{org.name}</span>
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-2 py-3 text-[13px]">
          {navigation.map((section) => (
            <div key={section.section}>
              <div className="console-label px-2 pt-4 pb-1.5 first:pt-2">{section.section}</div>
              {section.items.map((item) => {
                const isActive =
                  item.route === "/hr" ? pathname === "/hr" : pathname === item.route || pathname.startsWith(item.route + "/");
                return (
                  <Link
                    key={item.id}
                    to={item.route}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 transition-colors",
                      isActive
                        ? "bg-teal/10 font-medium text-teal ring-1 ring-teal/25"
                        : "text-dim hover:bg-panel2/70 hover:text-fg",
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={cn(
                          "font-mono text-[10px]",
                          item.badgeTone === "warning"
                            ? "text-amber"
                            : item.badgeTone === "danger"
                              ? "text-coral"
                              : item.badgeTone === "success"
                                ? "text-teal"
                                : "text-mute",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : item.badgeTone === "info" ? (
                      <span className="size-1.5 rounded-full bg-sky" />
                    ) : isActive ? (
                      <span className="size-1.5 rounded-full bg-teal" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-line px-3 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-panel2 font-mono text-[11px] font-semibold ring-1 ring-line">
              {session.initials}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[12px] font-medium">{session.name}</span>
              <span className="block truncate text-[10px] text-mute">{session.role}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              signOut();
              void navigate({ to: "/login" });
            }}
            className="mt-3 h-7 w-full rounded-md bg-panel2 font-mono text-[10px] tracking-[0.12em] text-mute uppercase ring-1 ring-line hover:text-fg"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-panel/60 px-4 md:px-5">
          <span className="console-label hidden sm:inline">{current.section}</span>
          <span className="hidden text-mute/50 sm:inline">/</span>
          <span className="font-display truncate text-[15px] font-semibold tracking-tight">{current.label}</span>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="hidden h-8 w-56 items-center gap-2 rounded-md bg-panel2 px-3 text-[12px] text-mute ring-1 ring-line lg:flex">
              <span className="font-mono text-[11px]">/</span>
              <span>Search workforce…</span>
            </div>
            <button
              type="button"
              className={cn("h-8 rounded-md px-2 font-mono text-[10px] ring-1", toneClasses.info)}
            >
              {session.role}
            </button>
            <button
              type="button"
              className="h-8 rounded-md bg-panel2 px-2.5 font-mono text-[11px] font-medium text-dim ring-1 ring-line hover:text-fg"
            >
              {org.today}
            </button>
            <button
              type="button"
              className="relative grid size-8 place-items-center rounded-md bg-panel2 text-dim ring-1 ring-line hover:text-fg"
            >
              <span className="font-mono text-[11px]">◍</span>
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-coral" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1560px] space-y-4 px-4 py-5 md:px-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
