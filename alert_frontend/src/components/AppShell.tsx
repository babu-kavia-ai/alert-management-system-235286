"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { navItems } from "@/lib/nav";
import { clearSession, getSession } from "@/lib/auth";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  title?: string;
  children: React.ReactNode;
};

// PUBLIC_INTERFACE
export function AppShell({ title, children }: Props) {
  /** Dashboard shell with responsive sidebar + top bar. */
  const pathname = usePathname();
  const router = useRouter();
  const session = getSession();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const visibleNav = React.useMemo(() => {
    const role = session?.role;
    return navItems.filter((item) => !item.roles || (role ? item.roles.includes(role) : false));
  }, [session?.role]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed left-0 top-0 z-40 h-screen w-72 border-r border-[var(--border)] bg-white",
          "md:translate-x-0 transition-transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]" />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-[var(--text)]">Alert Manager</div>
              <div className="text-xs text-[var(--muted)]">Dashboard</div>
            </div>
          </Link>
          <span className="hidden md:inline text-xs text-[var(--muted)]">
            {session?.role ? session.role.toUpperCase() : "GUEST"}
          </span>
        </div>

        <nav className="px-3 py-4">
          <div className="text-xs px-3 pb-2 text-[var(--muted)]">Navigation</div>
          <ul className="space-y-1">
            {visibleNav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                      active
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "text-[var(--text)] hover:bg-gray-50"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={clsx("h-5 w-5", active ? "text-blue-600" : "text-gray-500")} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 px-3">
            <div className="card p-3">
              <div className="text-xs text-[var(--muted)]">Tip</div>
              <div className="text-sm mt-1">
                Use <span className="kbd">/</span> to focus search.
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="md:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>

            <div className="flex-1">
              <div className="text-sm font-semibold text-[var(--text)]">{title ?? "Dashboard"}</div>
              <div className="text-xs text-[var(--muted)]">
                {session?.email ? `Signed in as ${session.email}` : "Not signed in"}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 w-[420px] max-w-[40vw]">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="Search alerts, templates, logs…"
                  className="w-full rounded-xl border border-[var(--border)] bg-white py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") router.push("/alerts");
                  }}
                />
              </div>
            </div>

            <button
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                clearSession();
                router.replace("/login");
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="container-pad">{children}</main>
      </div>
    </div>
  );
}
