import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../lib/types";
import prisma from "../lib/prisma";
import errorResponse from "../lib/response/errorResponse";
import { deleteImagesFromCloudinary } from "../lib/utils";

export const checkUserRelation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: senderId } = req.user!;
    const { receiverId } = req.body;

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) throw new Error("User not found.");

    if (receiver.isPublic) return next();

    const relation = await prisma.userRelation.findUnique({
      where: {
        followedById_followedToId: {
          followedById: senderId,
          followedToId: receiverId,
        },
      },
    });

    if (!relation) throw new Error("Account is private.");

    next();
  } catch (error: any) {
    const media = (req.files as Express.Multer.File[]) || [];

    if (media.length > 0) {
      media.forEach((file) => {
        deleteImagesFromCloudinary(file.path, file.filename.split("/")[1]);
      });
    }
    return errorResponse({ res, message: error.message });
  }
};
