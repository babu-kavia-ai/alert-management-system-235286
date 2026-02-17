"use client";

import React from "react";
import { AppShell } from "@/components/AppShell";
import { RouteGuard } from "@/components/RouteGuard";
import { apiRequest } from "@/lib/apiClient";
import { getSession } from "@/lib/auth";

type TemplateOut = {
  id: number;
  name: string;
  description?: string | null;
  subject?: string | null;
  body: string;
  created_at: string;
};

export default function TemplatesPage() {
  const session = getSession();

  const [templates, setTemplates] = React.useState<TemplateOut[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<TemplateOut[]>({
        method: "GET",
        path: "/templates",
        token: session.token,
      });
      setTemplates(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createDemoTemplate() {
    if (!session) return;
    setCreating(true);
    setError(null);
    try {
      await apiRequest<TemplateOut>({
        method: "POST",
        path: "/templates",
        token: session.token,
        body: {
          name: `Demo template ${new Date().toISOString()}`,
          description: "Created from UI to verify templates CRUD.",
          subject: "Demo subject",
          body: "Hello from template body.",
          metadata_json: {},
        },
      });
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to create template");
    } finally {
      setCreating(false);
    }
  }

  async function deleteTemplate(id: number) {
    if (!session) return;
    setError(null);
    try {
      await apiRequest<void>({
        method: "DELETE",
        path: `/templates/${id}`,
        token: session.token,
      });
      await load();
    } catch (err: any) {
      setError(err?.message || "Failed to delete template");
    }
  }

  return (
    <RouteGuard>
      <AppShell title="Templates">
        <div className="grid gap-6">
          <section className="card">
            <div className="card-body flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-semibold">Templates</h1>
                <p className="mt-1 text-sm text-[var(--muted)]">Manage reusable content for notifications.</p>
              </div>
              <button
                className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white hover:opacity-95 disabled:opacity-60"
                onClick={createDemoTemplate}
                disabled={creating}
              >
                {creating ? "Creating…" : "New template"}
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
                    <th className="py-2 pr-3 font-medium">Created</th>
                    <th className="py-2 pr-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="py-3 pr-3 text-[var(--muted)]" colSpan={3}>
                        Loading…
                      </td>
                    </tr>
                  ) : templates.length === 0 ? (
                    <tr>
                      <td className="py-3 pr-3 text-[var(--muted)]" colSpan={3}>
                        No templates yet.
                      </td>
                    </tr>
                  ) : (
                    templates.map((t) => (
                      <tr key={t.id} className="border-b border-[var(--border)] last:border-0">
                        <td className="py-3 pr-3 font-medium">{t.name}</td>
                        <td className="py-3 pr-3 text-xs text-[var(--muted)]">
                          {new Date(t.created_at).toLocaleString()}
                        </td>
                        <td className="py-3 pr-3 text-right">
                          <button
                            className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-gray-50"
                            onClick={() => deleteTemplate(t.id)}
                          >
                            Delete
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
