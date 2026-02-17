"use client";

import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";

const demoMessages = [
  { title: "High CPU on api-01", time: "2m ago", read: false },
  { title: "Latency spike resolved", time: "1h ago", read: true },
  { title: "Weekly digest is ready", time: "Yesterday", read: true },
];

export default function InboxPage() {
  return (
    <RouteGuard>
      <AppShell title="Inbox">
        <div className="grid gap-6">
          <section className="card">
            <div className="card-body">
              <h1 className="text-xl font-semibold">Inbox</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                In-app notifications and delivery events.
              </p>
            </div>
          </section>

          <section className="card">
            <div className="card-body">
              <div className="space-y-2">
                {demoMessages.map((m) => (
                  <div
                    key={m.title}
                    className={`rounded-xl border border-[var(--border)] p-3 ${
                      m.read ? "bg-white" : "bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold">{m.title}</div>
                      <div className="text-xs text-[var(--muted)]">{m.time}</div>
                    </div>
                    <div className="mt-1 text-xs text-[var(--muted)]">
                      {m.read ? "Read" : "New"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
