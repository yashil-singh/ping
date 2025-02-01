import dotenv from "dotenv";
import { CookieOptions } from "express";

dotenv.config();

export const CLIENT_BASE_URL = "http://localhost:5173";

export const USERNAME_PATTERN = /^[a-zA-Z0-9._@]+$/;
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;

export const SALT_ROUNDS = 10;

export const JWT_SECRET = process.env.JWT_SECRET!;

export const JWT_EXPIRES_IN = "7d";

export const COOKIE_TOKEN_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
