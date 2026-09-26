import type { Metadata } from "next";
import { PatientHistoryView } from "@/components/views/PatientHistoryView";

export const metadata: Metadata = {
  title: "LifeDispatch | Patient Emergency History",
  description:
    "Patient medical history timeline, clinical triage notes, and past emergency records.",
};

export default function PatientHistoryPage() {
  return <PatientHistoryView />;
}
