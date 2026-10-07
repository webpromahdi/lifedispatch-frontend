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

export function forgotPassword(payload: { email: string }) {
  return apiClient("/auth/forgot-password", { method: "POST", body: payload });
}

export function resetPassword(payload: {
  email: string;
  otp: string;
  newPassword: string;
}) {
  return apiClient("/auth/reset-password", { method: "POST", body: payload });
}

export function getMe() {
  return apiClient("/auth/me", { method: "GET" });
}

export function logout() {
  return apiClient("/auth/logout", { method: "POST" });
}
