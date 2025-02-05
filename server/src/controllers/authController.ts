import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import errorResponse from "../lib/response/errorResponse";
import successResponse from "../lib/response/successResponse";
import bcrypt from "bcryptjs";
import {
  generateRandomNumber,
  generateRandomString,
  hashPassword,
  sendEmail,
} from "../lib/utils";
import {
  createJwtToken,
  removeCookieToken,
  setCookieToken,
} from "../lib/token";
import { AuthenticatedRequest } from "../lib/types";
import {
  passwordResetEmailTemplate,
  verficationCompletedEmailTemplate,
  verficationTokenEmailTemplate,
} from "../lib/emailTemplates";
import { CLIENT_BASE_URL } from "../lib/contants";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUsername = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUsername) {
      return errorResponse({ message: "Username is already taken.", res });
    }

    const existingEmail = await prisma.user.findFirst({ where: { email } });

    if (existingEmail) {
      return errorResponse({
        message: "Email address is already associated to another account.",
        res,
      });
    }

    let verificationToken: number;
    let isUniqueToken = false;

    verificationToken = parseInt(generateRandomNumber(6));

    // Generate a unique verification code
    while (!isUniqueToken) {
      // Check if the verification code already exists in any user's record
      const existingCode = await prisma.user.findFirst({
        where: { verificationToken },
      });

      if (!existingCode) {
        // If no user has this verification token, it's unique
        isUniqueToken = true;
      }

      // Generate the verification code
      verificationToken = parseInt(generateRandomNumber(6));
    }

    const isMailSent = await sendEmail({
      to: email,
      subject: "Ping! - Verification Token",
      html: verficationTokenEmailTemplate(verificationToken),
    });

    if (!isMailSent) throw new Error("Email was not sent.");

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        verificationToken,
      },
    });

    const token = createJwtToken({
      id: user.id,
      isVerified: user.isVerified,
    });

    setCookieToken({ token, res });

    return successResponse({
      res,
      status: 201,
      message: `Account created successfully. A verification code has been sent to ${user.email}.`,
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationCode = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user)
      return errorResponse({ res, status: 404, message: "User not found." });

    if (user.isVerified)
      return errorResponse({ res, message: "Account is already verified." });

    // Create new token
    let verificationToken: number;
    let isUniqueToken = false;

    verificationToken = parseInt(generateRandomNumber(6));

    while (!isUniqueToken) {
      const existingCode = await prisma.user.findFirst({
        where: { verificationToken },
      });

      if (!existingCode) {
        isUniqueToken = true;
      }

      verificationToken = parseInt(generateRandomNumber(6));
    }

    const updatedUser = await prisma.user.update({
      data: {
        verificationToken,
      },
      where: { id },
    });

    const isMailSent = await sendEmail({
      to: updatedUser.email,
      subject: "Ping! - Verification Token",
      html: verficationTokenEmailTemplate(verificationToken),
    });

    if (!isMailSent) throw new Error("Email was not sent.");

    return successResponse({
      res,
      message: `Verification code sent to ${updatedUser.email}`,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;
    const { token } = req.body;

    if (!token)
      return errorResponse({ res, message: "Verification code is required." });

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user)
      return errorResponse({ message: "User not found", res, status: 404 });

    if (user.isVerified)
      return errorResponse({ message: "Account is already verified.", res });

    if (token !== user?.verificationToken?.toString()) {
      return errorResponse({
        message: "Verification code is incorrect.",
        res,
      });
    }

    const updatedUser = await prisma.user.update({
      data: {
        isVerified: true,
        verificationToken: null,
      },
      where: { id },
    });

    const jwtToken = createJwtToken({
      id: updatedUser.id,
      isVerified: updatedUser.isVerified,
    });

    setCookieToken({ res, token: jwtToken });

    const isMailSent = await sendEmail({
      to: updatedUser.email,
      subject: "Account verification completed.",
      html: verficationCompletedEmailTemplate(updatedUser.username),
    });

    if (!isMailSent) throw new Error("Email was not sent.");

    return successResponse({ message: "Account verified successfully.", res });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({ where: { username } });

    if (!user) {
      return errorResponse({
        message: "Account not found.",
        res,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return errorResponse({ message: "Invalid username or password.", res });

    const token = createJwtToken({
      id: user.id,
      isVerified: user.isVerified,
    });

    setCookieToken({ token, res });

    return successResponse({
      res,
      message: "Logged in successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  removeCookieToken(res);
  return successResponse({
    res,
    status: 200,
    message: "Logged out successfully.",
  });
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return errorResponse({
        res,
        message: "Account with that email does not exist.",
      });

    let resetToken = generateRandomString(15);
    let isUniqueToken = false;

    while (!isUniqueToken) {
      const existingCode = await prisma.user.findFirst({
        where: { resetToken },
      });

      if (!existingCode) {
        isUniqueToken = true;
      }

      resetToken = generateRandomString(15);
    }

    await prisma.user.update({ data: { resetToken }, where: { email } });

    const resetLink = CLIENT_BASE_URL + "/reset-password/" + resetToken;

    const isMailSent = await sendEmail({
      to: user.email,
      subject: "Password reset link",
      html: passwordResetEmailTemplate(user.username, resetLink),
    });

    if (!isMailSent) throw new Error("Email was not sent.");

    return successResponse({
      res,
      message: `Reset link sent to ${user.email}`,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { resetToken: token } });

    if (!user)
      return errorResponse({
        res,
        status: 404,
        message: "Reset token is invalid.",
      });

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      data: { password: hashedPassword },
      where: { id: user.id },
    });

    return successResponse({
      res,
      message: "Password was reset successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user!;

    const user = await prisma.user.findUnique({ where: { id } });

    const isValidPassword = await bcrypt.compare(oldPassword, user!.password);

    if (!isValidPassword)
      return errorResponse({ res, message: "Password was incorrect." });

    const isSamePassword = await bcrypt.compare(newPassword, user!.password);

    if (isSamePassword)
      return errorResponse({
        res,
        message: "Password can't be same as the current one.",
      });

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      data: { password: hashedPassword },
      where: { id },
    });

    return successResponse({ res, message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};

export const getUserbyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;

    const user = await prisma.user.findUnique({
      where: { id },
      omit: {
        password: true, // Deselect password
      },
    });

    if (!user) {
      removeCookieToken(res); // Remove current invalid token.
      return errorResponse({
        res,
        status: 401,
        message: "Unauthorized. Invalid token.",
      });
    }

    return successResponse({
      res,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
