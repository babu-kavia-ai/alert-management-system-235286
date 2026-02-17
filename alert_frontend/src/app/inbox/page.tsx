"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { apiRequest } from "@/lib/apiClient";
import { getSession } from "@/lib/auth";

type NotificationOut = {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function InboxPage() {
  const session = getSession();
  const [items, setItems] = React.useState<NotificationOut[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<NotificationOut[]>({
        method: "GET",
        path: "/notifications",
        token: session.token,
      });
      setItems(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function markRead(id: number) {
    if (!session) return;
    setError(null);
    try {
      await apiRequest<NotificationOut>({
        method: "POST",
        path: `/notifications/${id}/read`,
        token: session.token,
      });
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to mark as read");
    }
  }

  return (
    <RouteGuard>
      <AppShell title="Inbox">
        <div className="grid gap-6">
          <section className="card">
            <div className="card-body">
              <h1 className="text-xl font-semibold">Inbox</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">In-app notifications and delivery events.</p>
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
              <div className="space-y-2">
                {loading ? (
                  <div className="text-sm text-[var(--muted)]">Loading…</div>
                ) : items.length === 0 ? (
                  <div className="text-sm text-[var(--muted)]">
                    No notifications yet. Trigger an in-app alert to generate one.
                  </div>
                ) : (
                  items.map((m) => (
                    <div
                      key={m.id}
                      className={`rounded-xl border border-[var(--border)] p-3 ${m.is_read ? "bg-white" : "bg-blue-50"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">{m.title}</div>
                        <div className="text-xs text-[var(--muted)]">{new Date(m.created_at).toLocaleString()}</div>
                      </div>
                      <div className="mt-1 text-xs text-[var(--muted)]">{m.message}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xs text-[var(--muted)]">{m.is_read ? "Read" : "New"}</div>
                        {!m.is_read && (
                          <button
                            className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50"
                            onClick={() => markRead(m.id)}
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
