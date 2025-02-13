import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import errorResponse from "../lib/responses/errorResponse";
import successResponse from "../lib/responses/successResponse";
import prisma from "../prisma/prisma";
import { throwError } from "../lib/utils";
import bcrypt from "bcryptjs";
import { SALT } from "../lib/env";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    const existingEmail = await prisma.user.findUnique({ where: { email } });

    if (existingUsername) {
      throwError("Username already in use.", 409);
    }

    if (existingEmail) {
      throwError("Email is already associated with another account.", 409);
    }

    const salt = await bcrypt.genSalt(Number(SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
      omit: {
        password: true,
        resetToken: true,
        resetTokenExpiresAt: true,
      },
    });

    return successResponse({
      res,
      status: 201,
      message: "Account created.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async () => {};

export const sendResetLink = async () => {};

export const resetPassword = async () => {};
