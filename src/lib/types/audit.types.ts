export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  performedBy: string;
  performedByRole: string;
  performedByName: string;
  ipAddress: string;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  createdAt: string;
}
