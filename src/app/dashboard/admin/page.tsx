import type { Metadata } from "next";
import { AdminOverviewView } from "@/components/views/AdminOverviewView";

export const metadata: Metadata = {
  title: "Operations Control Desk | LifeDispatch Admin",
  description:
    "Monitor regional emergency dispatching, telemetry sensor feeds, active ambulance units, and hospital intake.",
};

export default function AdminPage() {
  return <AdminOverviewView />;
}
