import type { Metadata } from "next";
import { HospitalsManagementView } from "@/components/views/HospitalsManagementView";

export const metadata: Metadata = {
  title: "Partner Hospital ER Diversion | LifeDispatch Admin",
  description:
    "Monitor trauma center emergency capacities, intake diversion states, and available ER bed counts.",
};

export default function AdminHospitalsPage() {
  return <HospitalsManagementView />;
}
