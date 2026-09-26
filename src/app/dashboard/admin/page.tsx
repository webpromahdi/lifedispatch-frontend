import type { Metadata } from "next";
import { AdminView } from "@/components/views/AdminView";

export const metadata: Metadata = {
  title: "LifeDispatch | Admin Overview",
  description:
    "Platform management, fleet oversight, and hospital coordination.",
};

export default function AdminPage() {
  return <AdminView />;
}
