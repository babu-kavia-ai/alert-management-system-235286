"use client";

import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", sent: 120, failed: 3 },
  { day: "Tue", sent: 160, failed: 2 },
  { day: "Wed", sent: 140, failed: 5 },
  { day: "Thu", sent: 210, failed: 4 },
  { day: "Fri", sent: 190, failed: 1 },
  { day: "Sat", sent: 90, failed: 2 },
  { day: "Sun", sent: 110, failed: 3 },
];

export default function AnalyticsPage() {
  return (
    <RouteGuard>
      <AppShell title="Analytics">
        <div className="grid gap-6">
          <section className="card">
            <div className="card-body">
              <h1 className="text-xl font-semibold">Analytics</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Track notification volume and delivery health.
              </p>
            </div>
          </section>

          <section className="card">
            <div className="card-body">
              <div className="text-sm font-semibold">Delivery (last 7 days)</div>
              <div className="mt-4 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 16, bottom: 0, left: -10 }}>
                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-xs text-[var(--muted)]">
                Chart uses recharts; replace demo data once backend analytics endpoints are available.
              </div>
            </div>
          </section>
        </div>
      </AppShell>
    </RouteGuard>
  );
}
