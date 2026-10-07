import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgotPassword,
  resetPassword,
  userLogin,
  userRegister,
  verifyEmail,
  getMe,
  logout,
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
