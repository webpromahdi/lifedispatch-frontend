export interface DemoRole {
  name: string;
  email: string;
  password: string;
  roleName: string;
  displayName: string;
  redirectPath: string;
}

export const DEMO_ROLES: DemoRole[] = [
  {
    name: "Patient",
    email: "nafisa.anjum@gmail.com", // Assuming patient uses normal registration or different seeder
    password: "password123",
    roleName: "Patient",
    displayName: "Nafisa Anjum",
    redirectPath: "/dashboard/patient",
  },
  {
    name: "Dispatcher",
    email: "dispatcher@lifedispatch.com",
    password: "Dispatcher@123",
    roleName: "Dispatcher",
    displayName: "Tester Dispatcher",
    redirectPath: "/dashboard/dispatcher",
  },
  {
    name: "Driver",
    email: "driver@lifedispatch.com",
    password: "Driver@123",
    roleName: "Fleet Driver",
    displayName: "Tester Driver",
    redirectPath: "/dashboard/driver",
  },
  {
    name: "Hospital Staff",
    email: "hospitalstaff@lifedispatch.com",
    password: "HospitalStaff@123",
    roleName: "Hospital Staff",
    displayName: "Tester Hospital Staff",
    redirectPath: "/dashboard/hospital-staff",
  },
  {
    name: "Admin",
    email: "admin@lifedispatch.com",
    password: "Admin@123",
    roleName: "System Admin",
    displayName: "Tester Admin",
    redirectPath: "/dashboard/admin",
  },
  {
    name: "Super Admin",
    email: "superadmin@lifedispatch.com",
    password: "SuperAdmin@123",
    roleName: "Super Admin",
    displayName: "Super Admin",
    redirectPath: "/dashboard/super-admin",
  },
];
