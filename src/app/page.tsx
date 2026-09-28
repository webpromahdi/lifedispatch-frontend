import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ConnectedResponseSection } from "@/components/home/ConnectedResponseSection";
import { WhyLifeDispatchSection } from "@/components/home/WhyLifeDispatchSection";
import { CtaSection } from "@/components/home/CtaSection";
import { TechnicalDivider } from "@/components/home/TechnicalDivider";

export const metadata: Metadata = {
  title:
    "LifeDispatch — Intelligent Emergency Medical Dispatch & Ambulance Telematics",
  description:
    "LifeDispatch coordinates patient distress calls, advanced life-support ambulances, and tertiary emergency rooms across metropolitan healthcare grids.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between selection:bg-primary-light selection:text-primary overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <TechnicalDivider variant="notch-down" />
        <ConnectedResponseSection />
        <TechnicalDivider variant="notch-up" />
        <WhyLifeDispatchSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
