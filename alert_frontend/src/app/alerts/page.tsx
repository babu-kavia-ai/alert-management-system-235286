"use client";

import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";

const demoAlerts = [
  { name: "High CPU on api-01", severity: "High", channel: "Email + In-app", status: "Active" },
  { name: "Latency spike on checkout", severity: "Medium", channel: "In-app", status: "Active" },
  { name: "Weekly status digest", severity: "Low", channel: "Email", status: "Paused" },
];

export default function AlertsPage() {
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
              <button className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white hover:opacity-95">
                New alert
              </button>
            </div>
          </section>

          <section className="card">
            <div className="card-body overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-[var(--muted)]">
                  <tr className="border-b border-[var(--border)]">
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 font-medium">Severity</th>
                    <th className="py-2 pr-3 font-medium">Channel</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {demoAlerts.map((a) => (
                    <tr key={a.name} className="border-b border-[var(--border)] last:border-0">
                      <td className="py-3 pr-3 font-medium">{a.name}</td>
                      <td className="py-3 pr-3">{a.severity}</td>
                      <td className="py-3 pr-3">{a.channel}</td>
                      <td className="py-3 pr-3">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 text-xs text-[var(--muted)]">
                Note: wired for backend integration via src/lib/apiClient.ts (backend currently only
                exposes GET / health check).
              </div>
            </div>
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
