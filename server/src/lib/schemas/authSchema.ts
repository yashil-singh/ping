import { z } from "zod";
import { PASSWORD_PATTERN, USERNAME_PATTERN } from "../contants";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(3, "Name must be atleast 3 characters.")
    .max(30, "Name must be atmost 30 characters"),
  username: z
    .string({ required_error: "Username is required." })
    .min(5, "Username must be atleast 5 characters.")
    .max(30, "Username must be atmost 30 characters")
    .regex(
      USERNAME_PATTERN,
      "Username can only contain letters, numbers, and @, _, . characters."
    ),
  email: z
    .string({ required_error: "Email address is required." })
    .email("Email address is invalid."),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be atleast 6 characters")
    .max(30, "Password must be atmost 30 characters.")
    .regex(
      PASSWORD_PATTERN,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
    ),
});

export const loginSchema = z.object({
  username: z.string({ required_error: "Username is required." }),
  password: z.string({ required_error: "Password is required." }),
});

export const resetPasswordSchema = z.object({
  token: z
    .string({ required_error: "Reset code is required." })
    .min(15, "Reset token must is 15 characters long.")
    .max(15, "Reset token must is 15 characters long."),
  newPassword: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be atleast 6 characters")
    .max(30, "Password must be atmost 30 characters.")
    .regex(
      PASSWORD_PATTERN,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
    ),
});
