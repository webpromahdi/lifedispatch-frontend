import type { Metadata } from "next";
import { AdminOverviewView } from "./_components/AdminOverviewView";

export const metadata: Metadata = {
  title: "LifeDispatch | Admin Overview",
  description:
    "Real-time operations command, fleet monitoring, revenue overview, and system audit trail.",
};

export default function AdminPage() {
  return <AdminOverviewView />;
}
