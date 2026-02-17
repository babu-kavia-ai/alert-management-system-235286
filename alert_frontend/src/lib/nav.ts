import type { Role } from "@/lib/auth";
import {
  BellAlertIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  RectangleStackIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[]; // undefined = all authenticated users
};

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: ChartBarIcon },
  { href: "/alerts", label: "Alerts", icon: BellAlertIcon },
  { href: "/templates", label: "Templates", icon: RectangleStackIcon },
  { href: "/inbox", label: "Inbox", icon: EnvelopeIcon },
  { href: "/preferences", label: "Preferences", icon: Cog6ToothIcon },
  { href: "/analytics", label: "Analytics", icon: ChartBarIcon },
  { href: "/admin", label: "Admin", icon: ShieldCheckIcon, roles: ["admin"] },
];
