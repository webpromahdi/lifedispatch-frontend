import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/lib/types/emergency.types";
import type { User } from "@/lib/types/user.types";

export function userLogin(payload: { email: string; password: string }) {
  return apiClient<
    ApiResponse<{ user: User; accessToken: string; refreshToken: string }>
  >("/auth/login", { method: "POST", body: payload });
}

export function userRegister(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  return apiClient<ApiResponse<{ user: User }>>("/auth/register", {
    method: "POST",
    body: { ...payload, role: "PATIENT" },
  });
}

export function verifyEmail(payload: { email: string; otp: string }) {
  return apiClient<
    ApiResponse<{ user: User; accessToken: string; refreshToken: string }>
  >("/auth/verify-email", { method: "POST", body: payload });
}

export function forgotPassword(payload: { email: string }) {
  return apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: {
  email: string;
  otp: string;
  newPassword: string;
}) {
  return apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export function getMe() {
  return apiClient<ApiResponse<{ user: User }>>("/auth/me", { method: "GET" });
}

export function logout() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}

export function logoutAll() {
  return apiClient<ApiResponse<null>>("/auth/logout-all", { method: "POST" });
}

export function changePassword(payload: { newPassword: string }) {
  return apiClient<ApiResponse<null>>("/auth/change-password", {
    method: "POST",
    body: payload,
  });
}

export function refreshToken() {
  return apiClient<ApiResponse<{ accessToken: string }>>(
    "/auth/refresh-token",
    { method: "POST" },
  );
}
