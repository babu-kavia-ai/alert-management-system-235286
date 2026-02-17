"use client";

import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";

export default function AdminPage() {
  return (
    <RouteGuard requiredRole="admin">
      <AppShell title="Admin">
        <div className="grid gap-6">
          <section className="card">
            <div className="card-body">
              <h1 className="text-xl font-semibold">Admin</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage users, roles, and system settings (RBAC protected).
              </p>
            </div>
          </section>

          <section className="card">
            <div className="card-body">
              <div className="text-sm font-semibold">System</div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--border)] p-3">
                  <div className="text-xs text-[var(--muted)]">Role enforcement</div>
                  <div className="mt-1 text-sm">Only admins can access /admin</div>
                </div>
                <div className="rounded-xl border border-[var(--border)] p-3">
                  <div className="text-xs text-[var(--muted)]">Audit logs</div>
                  <div className="mt-1 text-sm">Coming soon (backend endpoint needed)</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
