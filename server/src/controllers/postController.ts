import { AuthenticatedRequest } from "../types";
import { NextFunction, Response } from "express";
import { throwError } from "../lib/utils";
import prisma from "../prisma/prisma";
import {
  deleteImageFromCloudinary,
  extractCloudinaryPublicId,
} from "../lib/cloudinary";
import successResponse from "../lib/responses/successResponse";
import { selectPostMediaSummary, selectUserSummary } from "../lib/contants";

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

export const editPost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: authorId } = req.user!;
    const { postId } = req.params;
    const { caption } = req.body;

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return throwError("Post not found.", 404);

    if (authorId !== post.authorId) throwError("Action unauthorized", 401);

    await prisma.post.update({ data: { caption }, where: { id: postId } });

    return successResponse({ res, message: "Post updated." });
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
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: selectUserSummary,
        },
        media: {
          select: selectPostMediaSummary,
        },
      },
    });

    return successResponse({ res, data: posts });
  } catch (e) {
    next(e);
  }
};

export const deletePost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: authorId } = req.user!;
    const { postId } = req.params;

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return throwError("Post not found.", 404);

    if (post.authorId !== authorId) throwError("Action unauthorized.", 401);

    await prisma.$transaction(async (tx) => {
      const medias = await tx.postMedia.findMany({ where: { postId } });

      const promises = medias.map(async (media) => {
        await deleteImageFromCloudinary(media.cloudinaryPublicId, "posts");
      });

      await Promise.all(promises);

      await tx.post.delete({ where: { id: postId } });

      return successResponse({ res, message: "Post deleted." });
    });
  } catch (e) {
    next(e);
  }
};

export const toggleArchive = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: authorId } = req.user!;
    const { postId } = req.params;

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return throwError("Post not found.", 404);

    if (post.authorId !== authorId) throwError("Action unauthorized", 401);

    const updatedPost = await prisma.post.update({
      data: {
        isArchived: !post.isArchived,
      },
      where: {
        id: postId,
      },
    });

    return successResponse({
      res,
      message: `Post ${updatedPost.isArchived ? "archived" : "is now visible to others"}.`,
    });
  } catch (e) {
    next(e);
  }
};

export const togglePostLike = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.user!;
    const { postId } = req.params;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return throwError("Post not found.", 404);

    const hasLiked = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    });

    let message;

    await prisma.$transaction(async (tx) => {
      if (hasLiked) {
        await tx.postLike.delete({
          where: {
            userId_postId: {
              postId,
              userId,
            },
          },
        });

        message = "Like removed.";
      } else {
        await tx.postLike.create({
          data: {
            userId,
            postId,
          },
        });

        message = "Post liked.";
      }
    });

    return successResponse({ res, message });
  } catch (e) {
    next(e);
  }
};

export const getPostLikes = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return throwError("Post not found.", 404);

    const postLikes = await prisma.postLike.findMany({
      where: {
        postId,
      },
    });

    return successResponse({ res, data: postLikes });
  } catch (e) {
    next(e);
  }
};
