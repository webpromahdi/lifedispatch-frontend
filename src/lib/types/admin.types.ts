import type { UserRole, UserStatus } from "./enums";

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
}

export interface AdminAnalyticsOverview {
  liveOperations: {
    activeEmergencies: number;
    availableAmbulances: number;
    busyAmbulances: number;
    outOfServiceAmbulances: number;
    driversOnShift: number;
  };
  historicStats: {
    totalCompletedEmergencies: number;
    totalCancelledEmergencies: number;
    totalTrips: number;
  };
  usersAndResources: {
    totalPatients: number;
    totalDrivers: number;
    totalHospitals: number;
  };
  revenue: {
    totalCollected: number;
    totalPending: number;
  };
}

export interface EmergencyAnalytics {
  total: number;
  escalated: number;
  avgResponseTimeMinutes: number;
  byStatus: { status: string; count: number }[];
  byType: { type: string; count: number }[];
  byPriority: { priority: string; count: number }[];
}

export interface PaymentAnalytics {
  totalPayments: number;
  totalRevenue: number;
  totalRefunded: number;
  byStatus: { status: string; count: number }[];
  recentPayments: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paymentMethod: string;
    paymentConfirmedAt: string | null;
    patient: { id: string; name: string };
  }[];
}

export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  performedBy?: string;
}

export interface AnalyticsDateFilterParams {
  from?: string;
  to?: string;
}

export interface AnalyticsOverviewData {
  liveOperations: {
    activeEmergencies: number;
    availableAmbulances: number;
    busyAmbulances: number;
    outOfService: number;
    driversOnShift: number;
  };
  revenue: {
    totalCollected: number;
    totalPending: number;
    currency: string;
  };
  historicStats: {
    completed: number;
    cancelled: number;
    totalTrips: number;
  };
  emergencyAnalytics: {
    avgResponseTimeMinutes: number | null;
  };
  usersAndResources: {
    totalPatients: number;
    totalDrivers: number;
    totalHospitals: number;
  };
}
