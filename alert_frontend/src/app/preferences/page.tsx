"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { apiRequest } from "@/lib/apiClient";
import { getSession } from "@/lib/auth";

type ChannelType = "in_app" | "email" | "sms" | "push";
type PreferenceOut = { id: number; user_id: number; channel: ChannelType; enabled: boolean; config: Record<string, any> };

const channelOptions: Array<{ key: ChannelType; label: string; desc: string }> = [
  { key: "in_app", label: "In-app", desc: "Receive notifications in your inbox." },
  { key: "email", label: "Email", desc: "Send to your primary email." },
  { key: "sms", label: "SMS", desc: "Text messages (if configured)." },
  { key: "push", label: "Push", desc: "Mobile push notifications." },
];

export default function PreferencesPage() {
  const session = getSession();
  const [prefs, setPrefs] = React.useState<Record<ChannelType, boolean>>({
    in_app: true,
    email: true,
    sms: false,
    push: false,
  });

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<PreferenceOut[]>({ method: "GET", path: "/preferences", token: session.token });
      const next = { ...prefs };
      for (const p of data) next[p.channel] = p.enabled;
      setPrefs(next);
    } catch (err: any) {
      setError(err?.message || "Failed to load preferences");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveAll() {
    if (!session) return;
    setSaving(true);
    setError(null);
    try {
      for (const ch of Object.keys(prefs) as ChannelType[]) {
        await apiRequest<PreferenceOut>({
          method: "PUT",
          path: "/preferences",
          token: session.token,
          body: { channel: ch, enabled: prefs[ch], config: {} },
        });
      }
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RouteGuard>
      <AppShell title="Preferences">
        <div className="grid gap-6">
          <section className="card">
            <div className="card-body">
              <h1 className="text-xl font-semibold">Notification preferences</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">Choose which channels you want to receive notifications on.</p>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-5 grid gap-3">
                {channelOptions.map((c) => (
                  <label key={c.key} className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-3">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={prefs[c.key]}
                      disabled={loading}
                      onChange={(e) => setPrefs((prev) => ({ ...prev, [c.key]: e.target.checked }))}
                    />
                    <div>
                      <div className="text-sm font-medium">{c.label}</div>
                      <div className="text-xs text-[var(--muted)]">{c.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                className="mt-5 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white hover:opacity-95 disabled:opacity-60"
                onClick={saveAll}
                disabled={saving || loading}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
