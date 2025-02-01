import { COOKIE_TOKEN_OPTIONS, JWT_EXPIRES_IN, JWT_SECRET } from "./contants";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { TokenPayload } from "./types";

export const createJwtToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyJwtToken = (token: string) => {
  try {
    const verifiedToken = jwt.verify(token, JWT_SECRET) as TokenPayload;

    return verifiedToken;
  } catch (error) {
    return null;
  }
};

export const setCookieToken = ({
  token,
  res,
}: {
  token: string;
  res: Response;
}) => {
  res.cookie("token", token, COOKIE_TOKEN_OPTIONS);
};

export const removeCookieToken = (res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });
};
