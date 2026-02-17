"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { getHealth } from "@/lib/apiClient";

export default function DashboardPage() {
  const [health, setHealth] = React.useState<{
    loading: boolean;
    ok: boolean;
    payload?: unknown;
    error?: string;
  }>({ loading: true, ok: false });

  React.useEffect(() => {
    let mounted = true;
    getHealth()
      .then((payload) => {
        if (!mounted) return;
        setHealth({ loading: false, ok: true, payload });
      })
      .catch((e) => {
        if (!mounted) return;
        setHealth({ loading: false, ok: false, error: e?.message ?? "Unable to reach backend" });
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <RouteGuard>
      <AppShell title="Dashboard">
        <div className="grid gap-6">
          <section className="card">
            <div className="card-body">
              <h1 className="text-xl font-semibold">Overview</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage alerts, templates, and notification preferences. Admins can review system
                usage and analytics.
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Active Alerts", value: "12", hint: "+2 this week" },
              { label: "Queued Notifications", value: "48", hint: "Last 24h" },
              { label: "Delivery Success", value: "98.3%", hint: "All channels" },
            ].map((kpi) => (
              <section key={kpi.label} className="card">
                <div className="card-body">
                  <div className="text-sm text-[var(--muted)]">{kpi.label}</div>
                  <div className="mt-2 text-3xl font-semibold">{kpi.value}</div>
                  <div className="mt-1 text-xs text-[var(--muted)]">{kpi.hint}</div>
                </div>
              </section>
            ))}
          </div>

          <section className="card">
            <div className="card-body">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-sm font-semibold">Backend connection</div>
                  <div className="text-xs text-[var(--muted)]">
                    Uses NEXT_PUBLIC_API_BASE_URL (defaults to http://localhost:3001)
                  </div>
                </div>
                <div
                  className={`rounded-full px-3 py-1 text-sm border ${
                    health.loading
                      ? "border-gray-200 text-gray-700"
                      : health.ok
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {health.loading ? "Checking…" : health.ok ? "Connected" : "Disconnected"}
                </div>
              </div>

              {!health.loading && !health.ok && (
                <div className="mt-3 text-sm text-[var(--danger)]">{health.error}</div>
              )}
              {!health.loading && health.ok && (
                <pre className="mt-3 text-xs overflow-auto rounded-xl border border-[var(--border)] bg-gray-50 p-3">
                  {JSON.stringify(health.payload, null, 2)}
                </pre>
              )}
            </div>
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
