import type { Metadata } from "next";
import { LandingPageView } from "@/components/views/LandingPageView";

export const metadata: Metadata = {
  title:
    "LifeDispatch — Intelligent Emergency Medical Dispatch & Ambulance Telematics",
  description:
    "LifeDispatch coordinates patient distress calls, advanced life-support ambulances, and tertiary emergency rooms across metropolitan healthcare grids.",
};

export default function HomePage() {
  return <LandingPageView />;
}
