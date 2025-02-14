import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types";
import {
  generateAccessToken,
  setCookieToken,
  throwError,
  verifyToken,
} from "../lib/utils";
import { ACCESS_TOKEN_MAX_AGE } from "../lib/contants";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../lib/env";

const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
      throwError("Unauthorized. Token not found.", 401);
    }

    const accessTokenSecret = ACCESS_TOKEN_SECRET!;
    const refreshTokenSecret = REFRESH_TOKEN_SECRET!;

    let decodedAccessToken = verifyToken(accessToken, accessTokenSecret!);

    if (!decodedAccessToken) {
      const decodedRefreshToken = verifyToken(refreshToken, refreshTokenSecret);

      if (decodedRefreshToken) {
        const newAccessToken = generateAccessToken({
          id: decodedRefreshToken.id,
        });

        setCookieToken({
          res,
          name: "accessToken",
          token: newAccessToken,
          maxAge: ACCESS_TOKEN_MAX_AGE,
        });

        decodedAccessToken = verifyToken(newAccessToken, accessTokenSecret!);
      } else {
        throwError("Unauthorized. Expired token received.");
        return;
      }
    }

    req.user = decodedAccessToken;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
