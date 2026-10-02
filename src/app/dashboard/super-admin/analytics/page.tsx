import type { Metadata } from "next";
import { AnalyticsView } from "@/components/shared/AnalyticsView";

export const metadata: Metadata = {
  title: "System Analytics & Telematics | LifeDispatch",
  description:
    "Comprehensive operational telemetry, priority triage analysis, and hospital handover velocity.",
};

export default function SuperAdminAnalyticsPage() {
  return <AnalyticsView userRole="SUPER_ADMIN" />;
}
