import type { Metadata } from "next";
import { HospitalStaffView } from "@/components/views/HospitalStaffView";

export const metadata: Metadata = {
  title: "LifeDispatch | Hospital ER Staff",
  description:
    "Hospital ER bed management, diversion status updates, and inbound trauma notifications.",
};

export default function HospitalStaffPage() {
  return <HospitalStaffView />;
}
