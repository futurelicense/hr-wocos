import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { navigation, roles } from "@/lib/hr/nav";
import { attentionRequired, org, pendingApprovals } from "@/lib/hr/data";
import { toneClasses } from "@/lib/hr/status";
import { signIn, signOut, useSession } from "@/hooks/use-session";
import { buildSession } from "@/lib/hr/session";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Notification = {
  id: string;
  title: string;
  meta: string;
  tone: "danger" | "warning" | "info";
};

const initialNotifications: Notification[] = [
  ...attentionRequired.map((a, i) => ({
    id: `attn-${i}`,
    title: a.title,
    meta: a.meta,
    tone: a.tone,
  })),
  ...pendingApprovals
    .filter((a) => a.status === "submitted" || a.status === "awaiting_approval")
    .map((a, i) => ({ id: `appr-${i}`, title: a.title, meta: a.meta, tone: "info" as const })),
];

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const unread = notifications.length;

  useEffect(() => {
    if (!session) {
      void navigate({ to: "/login", replace: true });
    }
  }, [session, navigate]);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, []);

  const goTo = (route: string) => {
    setSearchOpen(false);
    void navigate({ to: route });
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const switchRole = (roleId: string) => {
    if (!session || roleId === session.roleId) return;
    const next = buildSession({ email: session.email, roleId, remember: session.remember });
    signIn(next);
    toast.success(`Switched role to ${next.role}`, { description: next.name });
  };

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
            <span className="font-display block text-[13px] font-semibold tracking-tight">
              {org.product}
            </span>
            <span className="block font-mono text-[9px] tracking-[0.18em] text-mute uppercase">
              {org.name}
            </span>
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-2 py-3 text-[13px]">
          {navigation.map((section) => (
            <div key={section.section}>
              <div className="console-label px-2 pt-4 pb-1.5 first:pt-2">{section.section}</div>
              {section.items.map((item) => {
                const isActive =
                  item.route === "/hr"
                    ? pathname === "/hr"
                    : pathname === item.route || pathname.startsWith(item.route + "/");
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
          <span className="font-display truncate text-[15px] font-semibold tracking-tight">
            {current.label}
          </span>
          <div className="ml-auto flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-8 w-56 items-center gap-2 rounded-md bg-panel2 px-3 text-[12px] text-mute ring-1 ring-line transition-colors hover:text-fg lg:flex"
            >
              <span className="font-mono text-[11px]">⌘K</span>
              <span>Search workforce…</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "h-8 rounded-md px-2 font-mono text-[10px] ring-1 transition-opacity hover:opacity-80",
                    toneClasses.info,
                  )}
                >
                  {session.role}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-mono text-[10px] tracking-[0.1em] text-mute uppercase">
                  Switch role (demo)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roles.map((r) => (
                  <DropdownMenuItem key={r.id} onClick={() => switchRole(r.id)}>
                    {r.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="h-8 content-center rounded-md bg-panel2 px-2.5 font-mono text-[11px] font-medium text-dim ring-1 ring-line">
              {org.today}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative grid size-8 place-items-center rounded-md bg-panel2 text-dim ring-1 ring-line transition-colors hover:text-fg"
                >
                  <span className="font-mono text-[11px]">◍</span>
                  {unread > 0 ? (
                    <span className="absolute top-1 right-1 size-1.5 rounded-full bg-coral" />
                  ) : null}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="flex items-center justify-between font-mono text-[10px] tracking-[0.1em] text-mute uppercase">
                  Notifications
                  {unread > 0 ? (
                    <button
                      type="button"
                      onClick={() => setNotifications([])}
                      className="normal-case text-teal hover:underline"
                    >
                      Mark all read
                    </button>
                  ) : null}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="px-2 py-3 text-center font-mono text-[11px] text-mute">
                    You're all caught up
                  </div>
                ) : (
                  notifications.map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      onClick={() => dismissNotification(n.id)}
                      className="flex-col items-start gap-0.5 whitespace-normal"
                    >
                      <span className="text-[12px] text-fg">{n.title}</span>
                      <span className="font-mono text-[10px] text-mute">{n.meta}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1560px] space-y-4 px-4 py-5 md:px-5">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search workforce console…" />
        <CommandList>
          <CommandEmpty>No matches.</CommandEmpty>
          {navigation.map((section) => (
            <CommandGroup key={section.section} heading={section.section}>
              {section.items.map((item) => (
                <CommandItem key={item.id} value={item.label} onSelect={() => goTo(item.route)}>
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
