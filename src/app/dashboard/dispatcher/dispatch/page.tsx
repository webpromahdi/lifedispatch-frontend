import type { Metadata } from "next";
import { DispatcherDispatchView } from "../_components/DispatcherDispatchView";

export const metadata: Metadata = {
  title: "LifeDispatch | Dispatch Desk History",
  description:
    "Real-time dispatch assignments log, unit tracking, and mission cancellation desk.",
};

export default function DispatcherDispatchPage() {
  return <DispatcherDispatchView />;
}
