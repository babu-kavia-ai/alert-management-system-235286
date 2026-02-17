"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setSession, Role } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();

  const [email, setEmail] = React.useState("admin@example.com");
  const [role, setRole] = React.useState<Role>("admin");
  const [token, setToken] = React.useState("dev-token");

  const next = sp.get("next") || "/";

  return (
    <section className="w-full max-w-md card">
      <div className="card-body">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Dev login (backend auth endpoints not yet available in OpenAPI spec).
        </p>

        <div className="mt-5 space-y-3">
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
            <div className="text-sm font-medium">Role</div>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="block">
            <div className="text-sm font-medium">Token</div>
            <input
              className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Bearer token"
            />
            <div className="mt-1 text-xs text-[var(--muted)]">
              Stored locally; used by the API client as Authorization: Bearer &lt;token&gt;.
            </div>
          </label>

          <button
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2.5 text-white text-sm font-semibold hover:opacity-95"
            onClick={() => {
              setSession({ email, role, token });
              router.replace(next);
            }}
          >
            Continue
          </button>

          <div className="text-xs text-[var(--muted)]">
            Tip: try accessing <span className="font-medium">/admin</span> as role “user” to see
            RBAC redirect.
          </div>
        </div>
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
