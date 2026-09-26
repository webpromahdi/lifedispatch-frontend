import type { Metadata } from "next";
import { AuditLogsView } from "@/components/views/AuditLogsView";

export const metadata: Metadata = {
  title: "Audit Logs & Security Trail | LifeDispatch Admin",
  description:
    "Immutable write-once log of all privilege escalations, emergency status transitions, and user actions.",
};

export default function AdminAuditLogsPage() {
  return <AuditLogsView userRole="ADMIN" />;
}
