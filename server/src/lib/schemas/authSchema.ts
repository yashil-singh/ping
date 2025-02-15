import z from "zod";
import { PASSWORD_PATTERN, USERNAME_PATTERN } from "../contants";
import { RESET_TOKEN_CODE_LENGTH, VERIFICATION_CODE_LENGTH } from "../env";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(2, "Name must be minimun 2 characters.")
    .max(30, "Name must be maximum 30 characters."),
  username: z
    .string({ required_error: "Username is required." })
    .min(2, "Username must be atleast 2 characters.")
    .regex(
      USERNAME_PATTERN,
      "Username can only contain letters, numbers, and @, _, . characters.",
    ),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address."),
  password: z
    .string({ required_error: "Password is required." })
    .regex(
      PASSWORD_PATTERN,
      "Passwords must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
});

export const loginSchema = z.object({
  username: z
    .string({ required_error: "Username is required." })
    .min(1, "Username is requied."),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password is requied."),
});

export const verifyAccountSchema = z.object({
  verificationCode: z
    .string({ required_error: "Verification Code is required." })
    .min(
      Number(VERIFICATION_CODE_LENGTH),
      `Verification code must be ${VERIFICATION_CODE_LENGTH} characters.`,
    )
    .max(
      Number(VERIFICATION_CODE_LENGTH),
      `Verification code must be ${VERIFICATION_CODE_LENGTH} characters.`,
    ),
});

export const sendResetLinkSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email address."),
});

export const resetPasswordSchema = z.object({
  resetToken: z
    .string({ required_error: "Reset token is required." })
    .min(
      Number(RESET_TOKEN_CODE_LENGTH),
      `Reset token must be ${RESET_TOKEN_CODE_LENGTH} characters.`,
    )
    .max(
      Number(RESET_TOKEN_CODE_LENGTH),
      `Reset token must be ${RESET_TOKEN_CODE_LENGTH} characters.`,
    ),
  password: z
    .string({ required_error: "Password is required." })
    .regex(
      PASSWORD_PATTERN,
      "Passwords must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
});
