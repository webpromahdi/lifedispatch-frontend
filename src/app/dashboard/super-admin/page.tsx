import type { Metadata } from "next";
import { SuperAdminView } from "@/components/views/SuperAdminView";

export const metadata: Metadata = {
  title: "LifeDispatch | Super Admin Governance",
  description:
    "Platform security oversight, immutable audit logging, and authorization governance.",
};

export default function SuperAdminPage() {
  return <SuperAdminView />;
}
