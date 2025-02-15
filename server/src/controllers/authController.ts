import { Request, Response, NextFunction } from "express";
import successResponse from "../lib/responses/successResponse";
import prisma from "../prisma/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  removeCookieToken,
  setCookieToken,
  throwError,
} from "../lib/utils";
import bcrypt from "bcryptjs";
import {
  CLIENT_URL,
  RESET_TOKEN_CODE_LENGTH,
  RESET_TOKEN_EXPIRY_IN_MINS,
  SALT,
  VERIFICATION_CODE_EXPIRY_IN_MINS,
  VERIFICATION_CODE_LENGTH,
} from "../lib/env";
import { AuthenticatedRequest } from "../types";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "../lib/contants";
import sendEmail from "../lib/email/send";
import emailVerificationTemplate from "../lib/email/templates/emailVerification";
import randomatic from "randomatic";
import emailVerifiedTemplate from "../lib/email/templates/emailVerified";
import resetPasswordTemplate from "../lib/email/templates/resetPassword";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
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

    let verificationCode = randomatic("0", Number(VERIFICATION_CODE_LENGTH));
    let isUnique = false;

    while (!isUnique) {
      const verificationCodeExists = await prisma.user.findUnique({
        where: { verificationCode },
      });

      if (verificationCodeExists) {
        verificationCode = randomatic("0", Number(VERIFICATION_CODE_LENGTH));
      } else {
        isUnique = true;
      }
    }

    const verificationCodeExpiresAt = new Date();
    verificationCodeExpiresAt.setMinutes(
      verificationCodeExpiresAt.getMinutes() +
        Number(VERIFICATION_CODE_EXPIRY_IN_MINS),
    );

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
          verificationCode,
          verificationCodeExpiresAt,
        },
        omit: {
          password: true,
          resetToken: true,
          resetTokenExpiresAt: true,
        },
      });

      const isSent = await sendEmail({
        to: user.email,
        subject: "Email Verification - Ping",
        html: emailVerificationTemplate(
          verificationCode,
          `${CLIENT_URL}/verify-account?code=${verificationCode}`,
        ),
      });

      if (!isSent) {
        throwError("There was an error sending verification email.");
      }

      const accessToken = generateAccessToken({ id: user.id });
      setCookieToken({
        res,
        name: "accessToken",
        token: accessToken,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });

      const refreshToken = generateRefreshToken({ id: user.id });
      setCookieToken({
        res,
        name: "refreshToken",
        token: refreshToken,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      return successResponse({
        res,
        status: 201,
        message: `Verification email sent to ${user.email}`,
      });
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      throwError("Account not found.", 404);
      return;
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throwError("Invalid username or password");
    }

    const accessToken = generateAccessToken({ id: user.id });
    setCookieToken({
      res,
      name: "accessToken",
      token: accessToken,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    const refreshToken = generateRefreshToken({ id: user.id });
    setCookieToken({
      res,
      name: "refreshToken",
      token: refreshToken,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return successResponse({ res, message: "Logged in." });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    removeCookieToken({ res, name: "accessToken" });
    removeCookieToken({ res, name: "refreshToken" });

    return successResponse({ res, message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationCode = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.user!;

    const user = await prisma.user.findUnique({ where: { id } });

    let newVerificationCode = randomatic("0", Number(VERIFICATION_CODE_LENGTH));
    let isUnique = false;

    while (!isUnique) {
      const verificationCodeExists = await prisma.user.findUnique({
        where: { verificationCode: newVerificationCode },
      });

      if (verificationCodeExists) {
        newVerificationCode = randomatic("0", Number(VERIFICATION_CODE_LENGTH));
      } else {
        isUnique = true;
      }
    }

    const isEmailSent = await sendEmail({
      to: user!.email,
      subject: "Resend Verification Code Request",
      html: emailVerificationTemplate(
        newVerificationCode,
        `${CLIENT_URL}/verify-account?code=${newVerificationCode}`,
      ),
    });

    if (!isEmailSent)
      throwError("There was an error sending verification code.");

    const newVerificationCodeExpiresAt = new Date();
    newVerificationCodeExpiresAt.setMinutes(
      newVerificationCodeExpiresAt.getMinutes() +
        Number(VERIFICATION_CODE_EXPIRY_IN_MINS),
    );

    await prisma.user.update({
      data: {
        verificationCode: newVerificationCode,
        verificationCodeExpiresAt: newVerificationCodeExpiresAt,
      },
      where: { id },
    });

    successResponse({ res, message: "Verification code resent." });
  } catch (error) {
    next(error);
  }
};

export const verifyAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.user!;
    const { verificationCode } = req.body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return throwError("User not found.", 404);

    if (user.isVerified) throwError("Account is already verified.");

    if (verificationCode !== user.verificationCode)
      throwError("Verification code incorrect.");

    const now = new Date();
    const expiresAt = new Date(user.verificationCodeExpiresAt!);

    if (now > expiresAt) throwError("Verification code expired.");

    await prisma.user.update({
      data: {
        isVerified: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
      where: { id },
    });

    const html = emailVerifiedTemplate(user.username);

    await sendEmail({
      to: user.email,
      subject: "Account Verified.",
      html,
    });

    return successResponse({ res, message: "Account verified." });
  } catch (error) {
    next(error);
  }
};

export const sendResetLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return throwError("Account not found.", 404);

    let resetToken = randomatic("Aa0", Number(RESET_TOKEN_CODE_LENGTH));
    let isUnique = false;

    while (!isUnique) {
      const resetTokenExists = await prisma.user.findUnique({
        where: { resetToken },
      });

      if (resetTokenExists) {
        resetToken = randomatic("Aa0", Number(RESET_TOKEN_CODE_LENGTH));
      } else {
        isUnique = true;
      }
    }

    const html = resetPasswordTemplate(
      `${CLIENT_URL}/reset-password?token=${resetToken}`,
    );

    const isSent = await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html,
    });

    if (!isSent) throwError("There was an error sending reset link.");

    const resetTokenExpiresAt = new Date();
    resetTokenExpiresAt.setMinutes(
      resetTokenExpiresAt.getMinutes() + Number(RESET_TOKEN_EXPIRY_IN_MINS),
    );

    await prisma.user.update({
      data: {
        resetToken,
        resetTokenExpiresAt,
      },
      where: { id: user.id },
    });

    return successResponse({ res, message: "Reset link has been sent." });
  } catch (error) {
    next(error);
  }
};

export const resendResetLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return throwError("Account not found.", 404);

    let newResetToken = randomatic("Aa0", Number(RESET_TOKEN_CODE_LENGTH));
    let isUnique = false;

    while (!isUnique) {
      const resetTokenExists = await prisma.user.findUnique({
        where: { resetToken: newResetToken },
      });

      if (resetTokenExists) {
        newResetToken = randomatic("0", Number(RESET_TOKEN_CODE_LENGTH));
      } else {
        isUnique = true;
      }
    }

    const isEmailSent = await sendEmail({
      to: user!.email,
      subject: "Resend Password Reset Link Request",
      html: resetPasswordTemplate(
        `${CLIENT_URL}/reset-password?token=${newResetToken}`,
      ),
    });

    if (!isEmailSent) throwError("There was an error sending reset link.");

    const newResetTokenExpiresAt = new Date();
    newResetTokenExpiresAt.setMinutes(
      newResetTokenExpiresAt.getMinutes() + Number(RESET_TOKEN_EXPIRY_IN_MINS),
    );

    await prisma.user.update({
      data: {
        resetToken: newResetToken,
        resetTokenExpiresAt: newResetTokenExpiresAt,
      },
      where: { id: user.id },
    });

    successResponse({ res, message: "Verification code resent." });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, resetToken } = req.body;

    const user = await prisma.user.findUnique({ where: { resetToken } });

    if (!user) return throwError("Invalid reset token received.");

    if (!user.resetToken || !user.resetTokenExpiresAt)
      return throwError("Reset token not found or expired. Request a new one.");

    const now = new Date();
    const resetTokenExpiresAt = new Date(user.resetTokenExpiresAt);

    if (now > resetTokenExpiresAt) throwError("Reset token expired.");

    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) throwError("Password can't be same as old one.");

    const salt = await bcrypt.genSalt(Number(SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
      where: { id: user.id },
    });

    successResponse({ res, message: "Password was reset." });
  } catch (error) {
    next(error);
  }
};
