import type { Metadata } from "next";
import { UserManagementView } from "@/components/shared/UserManagementView";

export const metadata: Metadata = {
  title: "User Accounts | LifeDispatch Admin",
  description:
    "Oversee role-based access control, security provisioning, and account lifecycle status.",
};

export default function AdminUsersPage() {
  return <UserManagementView />;
}
