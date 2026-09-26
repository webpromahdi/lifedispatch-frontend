import type { Metadata } from "next";
import { DispatcherView } from "@/components/views/DispatcherView";

export const metadata: Metadata = {
  title: "LifeDispatch | Dispatcher Overview",
  description:
    "Live emergency dispatch triage queue and telemetry coordination desk.",
};

export default function DispatcherPage() {
  return <DispatcherView />;
}
