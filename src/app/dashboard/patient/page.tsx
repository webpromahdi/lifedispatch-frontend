import type { Metadata } from "next";
import { PatientView } from "@/components/views/PatientView";

export const metadata: Metadata = {
  title: "LifeDispatch | Patient Portal",
  description:
    "Emergency dispatch requests, live ambulance ETA tracking, and billing.",
};

export default function PatientPage() {
  return <PatientView />;
}
