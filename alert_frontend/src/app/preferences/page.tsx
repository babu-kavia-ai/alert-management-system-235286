"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";

type ChannelKey = "inApp" | "email" | "sms" | "push";

type ChannelState = Record<ChannelKey, boolean>;

const channelOptions: Array<{ key: ChannelKey; label: string; desc: string }> = [
  { key: "inApp", label: "In-app", desc: "Receive notifications in your inbox." },
  { key: "email", label: "Email", desc: "Send to your primary email." },
  { key: "sms", label: "SMS", desc: "Text messages (if configured)." },
  { key: "push", label: "Push", desc: "Mobile push notifications." },
];

export default function PreferencesPage() {
  const [channels, setChannels] = React.useState<ChannelState>({
    inApp: true,
    email: true,
    sms: false,
    push: false,
  });

  return (
    <RouteGuard>
      <AppShell title="Preferences">
        <div className="grid gap-6">
          <section className="card">
            <div className="card-body">
              <h1 className="text-xl font-semibold">Notification preferences</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Choose which channels you want to receive notifications on.
              </p>

              <div className="mt-5 grid gap-3">
                {channelOptions.map((c) => (
                  <label
                    key={c.key}
                    className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-3"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={channels[c.key]}
                      onChange={(e) =>
                        setChannels((prev) => ({ ...prev, [c.key]: e.target.checked }))
                      }
                    />
                    <div>
                      <div className="text-sm font-medium">{c.label}</div>
                      <div className="text-xs text-[var(--muted)]">{c.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <button className="mt-5 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white hover:opacity-95">
                Save changes
              </button>
            </div>
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
