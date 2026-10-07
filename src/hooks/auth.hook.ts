import { useMutation } from "@tanstack/react-query";
import { userLogin, userRegister, verifyEmail } from "@/api";

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
