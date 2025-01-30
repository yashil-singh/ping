import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(2, "Password is required."),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required.")
      .max(50, "Max characters for name is 50."),
    username: z
      .string()
      .min(1, "Username is required.")
      .max(20, "Username is too long."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(5, "Password must atleast contain 5 characters."),
    confirmPassword: z.string().min(5, "Passwords do not match."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address.")
    .min(1, "Email address is required."),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(5, "Password must atleast contain 5 characters."),
  confirmPassword: z.string().min(5, "Passwords do not match."),
});
