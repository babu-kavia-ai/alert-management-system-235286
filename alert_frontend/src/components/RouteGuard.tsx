"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession, hasRole, Role } from "@/lib/auth";

type Props = {
  requiredRole?: Role | Role[];
  children: React.ReactNode;
};

// PUBLIC_INTERFACE
export function RouteGuard({ requiredRole, children }: Props) {
  /**
   * Client-side route protection.
   * - If not authenticated: redirect to /login?next=<path>
   * - If role missing: redirect to /unauthorized
   */
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const session = getSession();
    if (!session) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
      return;
    }
    if (requiredRole && !hasRole(requiredRole, session.role)) {
      router.replace("/unauthorized");
    }
  }, [router, pathname, requiredRole]);

  return <>{children}</>;
}
