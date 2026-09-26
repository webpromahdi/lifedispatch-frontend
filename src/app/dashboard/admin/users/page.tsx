import type { Metadata } from "next";
import { UserManagementView } from "@/components/views/UserManagementView";

export const metadata: Metadata = {
  title: "User Accounts | LifeDispatch Admin",
  description:
    "Oversee role-based access control, security provisioning, and account lifecycle status.",
};

export default function AdminUsersPage() {
  return <UserManagementView />;
}
