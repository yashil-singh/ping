import { Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from "./env";

export const throwError = (message: string, number: number) => {
  const error = new Error(message);
  // @ts-ignore
  error.statusCode = number;
  throw error;
};

export const createToken = (payload: any) => {
  if (!JWT_SECRET || !JWT_EXPIRES_IN) {
    throw new Error("JWT_SECRET or JWT_EXPIRES_IN is not defined");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: Number(JWT_EXPIRES_IN) });
};

export const setCookieToken = ({
  res,
  token,
}: {
  res: Response;
  token: string;
}) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: Number(JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000,
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET!) as { id: string };
  } catch (error) {
    return null;
  }
};

export const removeCookieToken = (res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });
};
