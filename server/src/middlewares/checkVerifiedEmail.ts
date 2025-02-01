import { NextFunction, Response } from "express";
import prisma from "../lib/prisma";
import { AuthenticatedRequest } from "../lib/types";
import errorResponse from "../lib/errorResponse";

const checkVerifiedEmail = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user!;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user || !user.isVerified) {
    return errorResponse({
      res,
      message: "Email verification required.",
      status: 400,
    });
  }

  next();
};

export default checkVerifiedEmail;
