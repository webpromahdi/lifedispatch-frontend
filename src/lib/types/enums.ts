// All enums from PRD §3.3 implemented as `as const` objects with derived union types

export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  PATIENT: "PATIENT",
  DISPATCHER: "DISPATCHER",
  DRIVER: "DRIVER",
  HOSPITAL_STAFF: "HOSPITAL_STAFF",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const AuthProvider = {
  GOOGLE: "GOOGLE",
  CREDENTIAL: "CREDENTIAL",
} as const;
export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];

export const BloodType = {
  A_POSITIVE: "A_POSITIVE",
  A_NEGATIVE: "A_NEGATIVE",
  B_POSITIVE: "B_POSITIVE",
  B_NEGATIVE: "B_NEGATIVE",
  AB_POSITIVE: "AB_POSITIVE",
  AB_NEGATIVE: "AB_NEGATIVE",
  O_POSITIVE: "O_POSITIVE",
  O_NEGATIVE: "O_NEGATIVE",
  UNKNOWN: "UNKNOWN",
} as const;
export type BloodType = (typeof BloodType)[keyof typeof BloodType];

export const AmbulanceType = {
  BASIC_LIFE_SUPPORT: "BASIC_LIFE_SUPPORT",
  ADVANCED_LIFE_SUPPORT: "ADVANCED_LIFE_SUPPORT",
  NEONATAL: "NEONATAL",
  BARIATRIC: "BARIATRIC",
  PATIENT_TRANSPORT: "PATIENT_TRANSPORT",
} as const;
export type AmbulanceType = (typeof AmbulanceType)[keyof typeof AmbulanceType];

export const AmbulanceStatus = {
  AVAILABLE: "AVAILABLE",
  BUSY: "BUSY",
  OUT_OF_SERVICE: "OUT_OF_SERVICE",
} as const;
export type AmbulanceStatus =
  (typeof AmbulanceStatus)[keyof typeof AmbulanceStatus];

export const CertificationLevel = {
  EMT_BASIC: "EMT_BASIC",
  EMT_ADVANCED: "EMT_ADVANCED",
  PARAMEDIC: "PARAMEDIC",
} as const;
export type CertificationLevel =
  (typeof CertificationLevel)[keyof typeof CertificationLevel];

export const HospitalDiversionStatus = {
  ACCEPTING: "ACCEPTING",
  DIVERTING: "DIVERTING",
  CLOSED: "CLOSED",
} as const;
export type HospitalDiversionStatus =
  (typeof HospitalDiversionStatus)[keyof typeof HospitalDiversionStatus];

export const EmergencyType = {
  CARDIAC: "CARDIAC",
  TRAUMA: "TRAUMA",
  RESPIRATORY: "RESPIRATORY",
  NEUROLOGICAL: "NEUROLOGICAL",
  OBSTETRIC: "OBSTETRIC",
  PEDIATRIC: "PEDIATRIC",
  PSYCHIATRIC: "PSYCHIATRIC",
  OTHER: "OTHER",
} as const;
export type EmergencyType = (typeof EmergencyType)[keyof typeof EmergencyType];

export const RequiredCapability = {
  ALS: "ALS",
  BLS: "BLS",
  NEONATAL: "NEONATAL",
  BARIATRIC: "BARIATRIC",
} as const;
export type RequiredCapability =
  (typeof RequiredCapability)[keyof typeof RequiredCapability];

export const EmergencyPriority = {
  P1_CRITICAL: "P1_CRITICAL",
  P2_EMERGENCY: "P2_EMERGENCY",
  P3_URGENT: "P3_URGENT",
  P4_NON_URGENT: "P4_NON_URGENT",
  P5_ROUTINE: "P5_ROUTINE",
} as const;
export type EmergencyPriority =
  (typeof EmergencyPriority)[keyof typeof EmergencyPriority];

export const EmergencyStatus = {
  PENDING: "PENDING",
  PRIORITIZED: "PRIORITIZED",
  DISPATCHING: "DISPATCHING",
  ACTIVE_TRIP: "ACTIVE_TRIP",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REASSIGNMENT_REQUIRED: "REASSIGNMENT_REQUIRED",
} as const;
export type EmergencyStatus =
  (typeof EmergencyStatus)[keyof typeof EmergencyStatus];

export const DispatchStatus = {
  PENDING_ACCEPTANCE: "PENDING_ACCEPTANCE",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  TIMED_OUT: "TIMED_OUT",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;
export type DispatchStatus =
  (typeof DispatchStatus)[keyof typeof DispatchStatus];

export const TripStatus = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type TripStatus = (typeof TripStatus)[keyof typeof TripStatus];

export const PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
