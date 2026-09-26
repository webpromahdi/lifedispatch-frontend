import type { Metadata } from "next";
import { AuditLogsView } from "@/components/views/AuditLogsView";

export const metadata: Metadata = {
  title: "Security & System Audit Trail | LifeDispatch",
  description:
    "Immutable write-once log of all privilege escalations, emergency status transitions, and user actions.",
};

export default function SuperAdminAuditLogsPage() {
  return <AuditLogsView userRole="SUPER_ADMIN" />;
}
