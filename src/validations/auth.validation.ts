import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address!"),

  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long.")
      .max(255, "Name is too long."),
    email: z.email("Invalid email address!"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-z]/, "Must contain at least 1 lowercase letter.")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter.")
      .regex(/[0-9]/, "Must contain at least 1 number.")
      .regex(/[^A-Za-z0-9]/, "Must contain at least 1 special character."),
    confirmPassword: z.string(),
    phone: z.string().max(20, "Phone number is too long.").optional(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
