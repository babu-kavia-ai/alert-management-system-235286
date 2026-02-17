"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/apiClient";
import { setSession, Role } from "@/lib/auth";

type TokenResponse = { access_token: string; token_type?: string };

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();

  const [email, setEmail] = React.useState("admin@example.com");
  const [password, setPassword] = React.useState("change-me-now");
  const [role, setRole] = React.useState<Role>("admin");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const next = sp.get("next") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<TokenResponse>({
        method: "POST",
        path: "/auth/login",
        body: { email, password },
      });

      setSession({ email, role, token: res.access_token });
      router.replace(next);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err ? String((err as any).message) : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-md card">
      <div className="card-body">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Sign in using the backend JWT auth.</p>

        <form className="mt-5 space-y-3" onSubmit={onSubmit}>
          <label className="block">
            <div className="text-sm font-medium">Email</div>
            <input
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium">Password</div>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <div className="mt-1 text-xs text-[var(--muted)]">
              Default dev admin is configured by backend env (BOOTSTRAP_ADMIN_*).
            </div>
          </label>

          <label className="block">
            <div className="text-sm font-medium">Role (UI gating only)</div>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2.5 text-white text-sm font-semibold hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>

          <div className="text-xs text-[var(--muted)]">
            Tip: try accessing <span className="font-medium">/admin</span> as role “user” to see RBAC redirect.
          </div>
        </form>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-6">
      <Suspense
        fallback={
          <section className="w-full max-w-md card">
            <div className="card-body">
              <div className="text-sm text-[var(--muted)]">Loading…</div>
            </div>
          </section>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
