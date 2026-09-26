import type { Metadata } from "next";
import { HospitalStaffRosterView } from "@/components/views/HospitalStaffRosterView";

export const metadata: Metadata = {
  title: "LifeDispatch | Hospital ER Staff Roster",
  description:
    "Emergency department clinical roster, trauma surgeon assignments, and staff duty schedules.",
};

export default function HospitalStaffRosterPage() {
  return <HospitalStaffRosterView />;
}
