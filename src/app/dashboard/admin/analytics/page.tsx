import type { Metadata } from "next";
import { AnalyticsView } from "@/components/views/AnalyticsView";

export const metadata: Metadata = {
  title: "Dispatch & Fleet Analytics | LifeDispatch Admin",
  description:
    "Comprehensive operational telemetry, priority triage analysis, and hospital handover velocity.",
};

export default function AdminAnalyticsPage() {
  return <AnalyticsView userRole="ADMIN" />;
}
