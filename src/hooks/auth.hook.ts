import { useMutation, useQuery } from "@tanstack/react-query";
import {
  changePassword,
  forgotPassword,
  getMe,
  logout,
  logoutAll,
  refreshToken,
  resetPassword,
  userLogin,
  userRegister,
  verifyEmail,
} from "@/api";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: userRegister,
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: getMe,
    retry: false,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}

export function useLogoutAll() {
  return useMutation({
    mutationFn: logoutAll,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: refreshToken,
  });
}
