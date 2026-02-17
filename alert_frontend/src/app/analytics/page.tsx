"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { apiRequest } from "@/lib/apiClient";
import { getSession } from "@/lib/auth";

type AnalyticsSummary = {
  total_alerts: number;
  active_alerts: number;
  deliveries_total: number;
  deliveries_sent: number;
  deliveries_failed: number;
};

export default function AnalyticsPage() {
  const session = getSession();
  const [summary, setSummary] = React.useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<AnalyticsSummary>({
        method: "GET",
        path: "/analytics/summary",
        token: session.token,
      });
      setSummary(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RouteGuard>
      <AppShell title="Analytics">
        <div className="grid gap-6">
          <section className="card">
            <div className="card-body">
              <h1 className="text-xl font-semibold">Analytics</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">Track notification volume and delivery health.</p>
            </div>
          </section>

          {error && (
            <section className="card">
              <div className="card-body">
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </section>
          )}

          <section className="card">
            <div className="card-body">
              {loading ? (
                <div className="text-sm text-[var(--muted)]">Loading…</div>
              ) : !summary ? (
                <div className="text-sm text-[var(--muted)]">No data.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="rounded-xl border border-[var(--border)] p-3">
                    <div className="text-xs text-[var(--muted)]">Total alerts</div>
                    <div className="mt-1 text-lg font-semibold">{summary.total_alerts}</div>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] p-3">
                    <div className="text-xs text-[var(--muted)]">Active alerts</div>
                    <div className="mt-1 text-lg font-semibold">{summary.active_alerts}</div>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] p-3">
                    <div className="text-xs text-[var(--muted)]">Deliveries total</div>
                    <div className="mt-1 text-lg font-semibold">{summary.deliveries_total}</div>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] p-3">
                    <div className="text-xs text-[var(--muted)]">Sent</div>
                    <div className="mt-1 text-lg font-semibold">{summary.deliveries_sent}</div>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] p-3">
                    <div className="text-xs text-[var(--muted)]">Failed</div>
                    <div className="mt-1 text-lg font-semibold">{summary.deliveries_failed}</div>
                  </div>
                </div>
              )}
              <div className="mt-3 text-xs text-[var(--muted)]">
                This verifies UI → API → DB analytics aggregation.
              </div>
            </div>
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
