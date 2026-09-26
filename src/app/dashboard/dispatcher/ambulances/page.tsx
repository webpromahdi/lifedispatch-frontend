import type { Metadata } from "next";
import { DispatcherAmbulancesView } from "@/components/views/DispatcherAmbulancesView";

export const metadata: Metadata = {
  title: "LifeDispatch | Fleet Telematics Board",
  description:
    "Real-time 3-column ambulance availability monitor and status control desk.",
};

export default function DispatcherAmbulancesPage() {
  return <DispatcherAmbulancesView />;
}
