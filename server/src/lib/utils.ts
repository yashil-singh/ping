import { Response } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, NODE_ENV } from "./env";
import { JwtPayload } from "../types";
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "./contants";

export const throwError = (message: string, statusCode: number = 400) => {
  const error = new Error(message);

  // @ts-ignore
  error.statusCode = statusCode;

  throw error;
};

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const setCookieToken = ({
  res,
  name,
  token,
  maxAge,
}: {
  res: Response;
  name: string;
  token: string;
  maxAge: number;
}) => {
  res.cookie(name, token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge,
  });
};

export const removeCookieToken = ({
  res,
  name,
}: {
  res: Response;
  name: string;
}) => {
  res.clearCookie(name, {
    httpOnly: true,
    sameSite: "strict",
  });
};
