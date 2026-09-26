import type { Metadata } from "next";
import { DevComponentsView } from "@/components/views/DevComponentsView";

export const metadata: Metadata = {
  title: "LifeDispatch | Dev Component Gallery",
  description:
    "Interactive development preview showcasing all shared design system components, color tokens, and static data shapes.",
};

export default function DevComponentsPage() {
  return <DevComponentsView />;
}
