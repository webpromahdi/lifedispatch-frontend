import type { Metadata } from "next";
import { PatientView } from "./_components/PatientView";

export const metadata: Metadata = {
  title: "LifeDispatch | Patient Portal",
  description:
    "Emergency dispatch requests, live ambulance ETA tracking, and billing.",
};

export default function PatientPage() {
  return <PatientView />;
}
