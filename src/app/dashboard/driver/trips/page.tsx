import type { Metadata } from "next";
import { DriverTripsView } from "../_components/DriverTripsView";

export const metadata: Metadata = {
  title: "LifeDispatch | Driver Trip History",
  description:
    "Paramedic driver completed mission log, patient transfers, and route telemetry history.",
};

export default function DriverTripsPage() {
  return <DriverTripsView />;
}
