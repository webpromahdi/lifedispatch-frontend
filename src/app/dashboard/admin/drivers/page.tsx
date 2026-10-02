import type { Metadata } from "next";
import { DriversManagementView } from "../_components/DriversManagementView";

export const metadata: Metadata = {
  title: "Paramedic Driver Roster | LifeDispatch Admin",
  description:
    "Verify EMS driver licenses, certifications, assigned vehicles, and real-time duty shifts.",
};

export default function AdminDriversPage() {
  return <DriversManagementView />;
}
