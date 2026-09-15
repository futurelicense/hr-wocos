import { roles } from "@/lib/hr/nav";

export type SessionUser = {
  email: string;
  name: string;
  initials: string;
  role: string;
  roleId: string;
  remember: boolean;
};

const SESSION_KEY = "wocos_hr_session";

/** Cached snapshot so useSyncExternalStore getSnapshot stays referentially stable. */
let cachedRaw: string | null | undefined;
let cachedSession: SessionUser | null = null;

export const demoUsersByRole: Record<string, { name: string; email: string }> = {
  hr_admin: { name: "Ada Okonkwo", email: "ada.okonkwo@teamace.com" },
  recruiter: { name: "Chidi Eze", email: "chidi.eze@teamace.com" },
  verification_officer: { name: "Ngozi Bello", email: "ngozi.bello@teamace.com" },
  hr_manager: { name: "Sonia Okafor", email: "sonia.okafor@teamace.com" },
  payroll_officer: { name: "Tunde Balogun", email: "tunde.balogun@teamace.com" },
  operations_manager: { name: "Ifeoma Daniels", email: "ifeoma.daniels@teamace.com" },
  client_manager: { name: "James Adeyemi", email: "james.adeyemi@teamace.com" },
  client_user: { name: "Amaka Client", email: "amaka@abccompany.com" },
  employee: { name: "Emeka Nwosu", email: "emeka.nwosu@teamace.com" },
  executive: { name: "Funke Adebayo", email: "funke.adebayo@teamace.com" },
};

export function roleLabel(roleId: string) {
  return roles.find((r) => r.id === roleId)?.name ?? "HR User";
}

export function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "user";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "WH";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function storage(remember: boolean) {
  if (typeof window === "undefined") return null;
  return remember ? window.localStorage : window.sessionStorage;
}

function parseSession(raw: string | null): SessionUser | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionUser;
    if (!parsed?.email || !parsed?.roleId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
}

function refreshCache(raw: string | null = readRaw()) {
  if (raw === cachedRaw) return cachedSession;
  cachedRaw = raw;
  cachedSession = parseSession(raw);
  return cachedSession;
}

export function readSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  return refreshCache();
}

export function writeSession(user: SessionUser) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
  const raw = JSON.stringify(user);
  storage(user.remember)?.setItem(SESSION_KEY, raw);
  refreshCache(raw);
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
  refreshCache(null);
}

export function buildSession(input: {
  email: string;
  roleId: string;
  remember: boolean;
}): SessionUser {
  const demo = demoUsersByRole[input.roleId];
  const name = demo?.name ?? nameFromEmail(input.email);
  return {
    email: input.email.trim() || demo?.email || "user@teamace.com",
    name,
    initials: initialsFromName(name),
    role: roleLabel(input.roleId),
    roleId: input.roleId,
    remember: input.remember,
  };
}
