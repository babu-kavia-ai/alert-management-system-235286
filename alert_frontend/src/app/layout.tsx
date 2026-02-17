import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alert Management System",
  description: "Create and manage alerts, templates, preferences, and analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
