import type { Metadata } from "next";
import { SuperAdminOverviewView } from "@/components/views/SuperAdminOverviewView";

export const metadata: Metadata = {
  title: "Platform Command & Security | LifeDispatch Super Admin",
  description:
    "Platform security oversight, immutable audit logging, and authorization governance.",
};

export default function SuperAdminPage() {
  return <SuperAdminOverviewView />;
}
