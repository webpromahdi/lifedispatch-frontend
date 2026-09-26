import type { Metadata } from "next";
import type React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const metadata: Metadata = {
  title: "LifeDispatch | Emergency Operations Center",
  description:
    "Next-generation emergency dispatch and ambulance fleet management platform.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
