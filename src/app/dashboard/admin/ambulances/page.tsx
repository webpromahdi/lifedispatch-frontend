import type { Metadata } from "next";
import { AmbulanceFleetView } from "@/components/views/AmbulanceFleetView";

export const metadata: Metadata = {
  title: "Ambulance Fleet Telematics | LifeDispatch Admin",
  description:
    "Manage vehicle readiness, GPS coordinate tracking, onboard clinical equipment, and maintenance schedules.",
};

export default function AdminAmbulancesPage() {
  return <AmbulanceFleetView />;
}
