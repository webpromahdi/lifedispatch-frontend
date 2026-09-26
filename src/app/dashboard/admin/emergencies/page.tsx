import type { Metadata } from "next";
import { EmergenciesListView } from "@/components/views/EmergenciesListView";

export const metadata: Metadata = {
  title: "Live Emergency CAD Incidents | LifeDispatch Admin",
  description:
    "Comprehensive dispatch queue logs, real-time triage priority, and incident telematics tracking.",
};

export default function AdminEmergenciesPage() {
  return <EmergenciesListView />;
}
