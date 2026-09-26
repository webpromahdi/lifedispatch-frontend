import type { Metadata } from "next";
import { UserManagementView } from "@/components/views/UserManagementView";

export const metadata: Metadata = {
  title: "User Governance & Access | LifeDispatch",
  description:
    "Oversee role-based access control, security provisioning, and account lifecycle status.",
};

export default function SuperAdminUsersPage() {
  return <UserManagementView />;
}
