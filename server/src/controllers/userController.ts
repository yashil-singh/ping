import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../lib/types";
import prisma from "../lib/prisma";
import errorResponse from "../lib/response/errorResponse";
import successResponse from "../lib/response/successResponse";
import { extractCloudinaryPublicId } from "../lib/utils";
import cloudinary from "../lib/cloudinary";

export const editProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;
    const { name, username, bio } = req.body;

    const isExistingUsername = await prisma.user.findFirst({
      where: { username, id: { not: id } },
    });

    if (isExistingUsername)
      return errorResponse({ res, message: "Username already exists." });

    const newAvatarUrl = req?.file?.path;

    const user = await prisma.user.findUnique({ where: { id } });

    const oldAvatarUrl = user?.avatarUrl;

    if (newAvatarUrl && oldAvatarUrl) {
      const publicId = extractCloudinaryPublicId(oldAvatarUrl);
      await cloudinary.uploader.destroy(`ping/avatars/${publicId}`);
    }

    await prisma.user.update({
      data: {
        name,
        username,
        bio,
        avatarUrl: newAvatarUrl || oldAvatarUrl || null,
      },
      where: { id },
    });

    return successResponse({ res, message: "Profile edited successfully." });
  } catch (error) {
    next(error);
  }
};
