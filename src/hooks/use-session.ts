import { useSyncExternalStore } from "react";
import { clearSession, readSession, type SessionUser, writeSession } from "@/lib/hr/session";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): SessionUser | null {
  return readSession();
}

function getServerSnapshot(): SessionUser | null {
  return null;
}

export function useSession() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function signIn(user: SessionUser) {
  writeSession(user);
  emit();
}

export function signOut() {
  clearSession();
  emit();
}
