"use client";

import Link from "next/link";
import { clearSession, getSession } from "@/lib/auth";

export default function UnauthorizedPage() {
  const session = getSession();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-6">
      <section className="w-full max-w-lg card">
        <div className="card-body">
          <h1 className="text-xl font-semibold">Unauthorized</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Your account doesn’t have access to this page.
          </p>

          <div className="mt-4 rounded-xl border border-[var(--border)] bg-gray-50 p-3 text-sm">
            <div className="text-xs text-[var(--muted)]">Current session</div>
            <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(session, null, 2)}</pre>
          </div>

          <div className="mt-5 flex gap-3 flex-wrap">
            <Link
              href="/"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm hover:bg-white"
            >
              Go to dashboard
            </Link>
            <button
              className="rounded-xl bg-[var(--danger)] px-4 py-2 text-sm text-white hover:opacity-95"
              onClick={() => {
                clearSession();
                window.location.href = "/login";
              }}
            >
              Sign in with a different role
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
