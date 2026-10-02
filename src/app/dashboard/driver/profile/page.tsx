import type { Metadata } from "next";
import { DriverProfileView } from "../_components/DriverProfileView";

export const metadata: Metadata = {
  title: "LifeDispatch | Paramedic Driver Profile",
  description:
    "Fleet driver telematics profile, operational readiness credentials, and clinical certifications.",
};

export default function DriverProfilePage() {
  return <DriverProfileView />;
}
