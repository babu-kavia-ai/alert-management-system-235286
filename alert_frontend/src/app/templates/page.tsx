"use client";

import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";

const demoTemplates = [
  { name: "Incident: High CPU", channel: "Email", updated: "2026-02-01" },
  { name: "Latency Spike", channel: "In-app", updated: "2026-01-20" },
  { name: "Digest Summary", channel: "Email", updated: "2026-01-02" },
];

export default function TemplatesPage() {
  return (
    <RouteGuard>
      <AppShell title="Templates">
        <div className="grid gap-6">
          <section className="card">
            <div className="card-body flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-semibold">Templates</h1>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Manage reusable content for notifications.
                </p>
              </div>
              <button className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white hover:opacity-95">
                New template
              </button>
            </div>
          </section>

          <section className="card">
            <div className="card-body overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-[var(--muted)]">
                  <tr className="border-b border-[var(--border)]">
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 font-medium">Channel</th>
                    <th className="py-2 pr-3 font-medium">Last updated</th>
                  </tr>
                </thead>
                <tbody>
                  {demoTemplates.map((t) => (
                    <tr key={t.name} className="border-b border-[var(--border)] last:border-0">
                      <td className="py-3 pr-3 font-medium">{t.name}</td>
                      <td className="py-3 pr-3">{t.channel}</td>
                      <td className="py-3 pr-3">{t.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
