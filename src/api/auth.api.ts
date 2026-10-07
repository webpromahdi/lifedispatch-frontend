import apiClient from "@/lib/apiClient";

export function userLogin(payload: { email: string; password: string }) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}

export function userRegister(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  return apiClient("/auth/register", {
    method: "POST",
    body: { ...payload, role: "PATIENT" },
  });
}

export function verifyEmail(payload: { email: string; otp: string }) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}
