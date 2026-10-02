import type { Metadata } from "next";
import { DriverView } from "./_components/DriverView";

export const metadata: Metadata = {
  title: "LifeDispatch | Driver Operations",
  description:
    "Driver console with active trip routing and dispatch assignment acceptance.",
};

export default function DriverPage() {
  return <DriverView />;
}
