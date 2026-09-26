import type { Metadata } from "next";
import { HospitalStaffShiftView } from "@/components/views/HospitalStaffShiftView";

export const metadata: Metadata = {
  title: "LifeDispatch | Hospital ER Duty Shift",
  description:
    "Emergency department clinical duty shift console, trauma bay assignments, and weekly physician roster.",
};

export default function HospitalStaffShiftPage() {
  return <HospitalStaffShiftView />;
}
