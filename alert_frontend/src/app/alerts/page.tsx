"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { apiRequest } from "@/lib/apiClient";
import { getSession } from "@/lib/auth";

type ChannelType = "in_app" | "email" | "sms" | "push";
type AlertStatus = "active" | "paused" | "archived";

type AlertOut = {
  id: number;
  name: string;
  description?: string | null;
  channel: ChannelType;
  status: AlertStatus;
  template_id?: number | null;
  schedule_type: string;
  next_run_at?: string | null;
};

function labelChannel(c: ChannelType) {
  return c === "in_app" ? "In-app" : c.toUpperCase();
}

export default function AlertsPage() {
  const session = getSession();

  const [alerts, setAlerts] = React.useState<AlertOut[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [creating, setCreating] = React.useState(false);

  async function load() {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<AlertOut[]>({
        method: "GET",
        path: "/alerts",
        token: session.token,
      });
      setAlerts(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createDemoAlert() {
    if (!session) return;
    setCreating(true);
    setError(null);
    try {
      await apiRequest<AlertOut>({
        method: "POST",
        path: "/alerts",
        token: session.token,
        body: {
          name: `Demo alert ${new Date().toISOString()}`,
          description: "Triggered from UI to verify dispatch → inbox/logs/analytics.",
          channel: "in_app",
          status: "active",
          schedule_type: "one_time",
          schedule_config: {},
        },
      });
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to create alert");
    } finally {
      setCreating(false);
    }
  }

  async function trigger(alertId: number) {
    if (!session) return;
    setError(null);
    try {
      await apiRequest({
        method: "POST",
        path: `/alerts/${alertId}/trigger`,
        token: session.token,
      });
      // triggering creates delivery log; inbox notification for in_app channel
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to trigger alert");
    }
  }

  return (
    <RouteGuard>
      <AppShell title="Alerts">
        <div className="grid gap-6">
          <section className="card">
            <div className="card-body flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-semibold">Alerts</h1>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Create, schedule, and route notifications across channels.
                </p>
              </div>
              <button
                className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white hover:opacity-95 disabled:opacity-60"
                onClick={createDemoAlert}
                disabled={creating}
              >
                {creating ? "Creating…" : "New alert"}
              </button>
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
            <div className="card-body overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-[var(--muted)]">
                  <tr className="border-b border-[var(--border)]">
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 font-medium">Channel</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">Next run</th>
                    <th className="py-2 pr-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="py-3 pr-3 text-[var(--muted)]" colSpan={5}>
                        Loading…
                      </td>
                    </tr>
                  ) : alerts.length === 0 ? (
                    <tr>
                      <td className="py-3 pr-3 text-[var(--muted)]" colSpan={5}>
                        No alerts yet. Create one to verify dispatch to inbox/logs.
                      </td>
                    </tr>
                  ) : (
                    alerts.map((a) => (
                      <tr key={a.id} className="border-b border-[var(--border)] last:border-0">
                        <td className="py-3 pr-3 font-medium">{a.name}</td>
                        <td className="py-3 pr-3">{labelChannel(a.channel)}</td>
                        <td className="py-3 pr-3">{a.status}</td>
                        <td className="py-3 pr-3 text-xs text-[var(--muted)]">
                          {a.next_run_at ? new Date(a.next_run_at).toLocaleString() : "—"}
                        </td>
                        <td className="py-3 pr-3 text-right">
                          <button
                            className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50"
                            onClick={() => trigger(a.id)}
                          >
                            Trigger now
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
