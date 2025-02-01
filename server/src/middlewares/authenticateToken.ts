import { NextFunction, Request, Response } from "express";
import errorResponse from "../lib/errorResponse";
import { verifyJwtToken } from "../lib/token";
import { AuthenticatedRequest } from "../lib/types";

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return errorResponse({
        res,
        status: 401,
        message: "Unauthorized. Token not found.",
      });

    const decodedToken = verifyJwtToken(token);

    if (!decodedToken)
      return errorResponse({
        res,
        status: 401,
        message: "Unauthorized. Invalid token.",
      });

    // Attach user ID to request
    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};
