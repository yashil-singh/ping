import { AuthenticatedRequest } from "../types";
import { NextFunction, Response } from "express";
import { throwError } from "../lib/utils";
import prisma from "../prisma/prisma";
import { extractCloudinaryPublicId } from "../lib/cloudinary";
import successResponse from "../lib/responses/successResponse";

export const createPost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: authorId } = req.user!;
    const { caption } = req.body;

    const mediaFiles = req?.files as Express.Multer.File[];

    if (!mediaFiles || mediaFiles.length < 1)
      throwError("At least one media file is required.");

    await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          caption,
          authorId,
        },
      });

      const promises = mediaFiles.map(async (media) => {
        const cloudinaryPublicId = extractCloudinaryPublicId(media.path) || "";
        return tx.postMedia.create({
          data: {
            postId: post.id,
            url: media.path,
            cloudinaryPublicId,
            type: media.mimetype.split("/")[0],
          },
        });
      });

      await Promise.all(promises);

      return successResponse({ res, message: "Post created." });
    });
  } catch (e) {
    next(e);
  }
};

export const getPosts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const posts = await prisma.post.findMany({});

    return successResponse({ res, data: posts });
  } catch (e) {
    next(e);
  }
};
