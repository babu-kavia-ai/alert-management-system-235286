"use client";

export type Role = "user" | "admin";

export type AuthSession = {
  token: string;
  email: string;
  role: Role;
};

const STORAGE_KEY = "ams.session.v1";

function safeParse(value: string | null): AuthSession | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as AuthSession;
    if (!parsed?.token || !parsed?.email || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function getSession(): AuthSession | null {
  /** Reads session from localStorage (client-only). */
  if (typeof window === "undefined") return null;
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

// PUBLIC_INTERFACE
export function setSession(session: AuthSession): void {
  /** Writes session to localStorage (client-only). */
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

// PUBLIC_INTERFACE
export function clearSession(): void {
  /** Clears session from localStorage (client-only). */
  window.localStorage.removeItem(STORAGE_KEY);
}

// PUBLIC_INTERFACE
export function hasRole(required: Role | Role[], role: Role): boolean {
  /** Returns true if role satisfies required role(s). */
  const req = Array.isArray(required) ? required : [required];
  return req.includes(role);
}
