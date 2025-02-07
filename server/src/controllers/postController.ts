import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../lib/types";
import prisma from "../lib/prisma";
import successResponse from "../lib/response/successResponse";
import errorResponse from "../lib/response/errorResponse";
import { deleteImagesFromCloudinary } from "../lib/utils";

export const createPost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;
    const { caption } = req.body;

    const imageUrls = (req.files as Express.Multer.File[])?.map(
      (file) => file.path
    );

    if (imageUrls.length < 1)
      return errorResponse({ res, message: "At least one image is required." });

    const post = await prisma.post.create({
      data: {
        caption,
        imageUrls,
        authorId: id,
      },
    });

    return successResponse({ res, message: "Posted sucessfully.", data: post });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
      },
    });

    return successResponse({ res, data: posts });
  } catch (error) {
    next(error);
  }
};

export const editPost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;
    const { postId, caption } = req.body;
    console.log("🚀 ~ postController.ts:65 ~ postId:", postId);

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post)
      return errorResponse({ res, message: "Post not found.", status: 404 });

    if (post.authorId !== id)
      return errorResponse({
        res,
        message: "Action is unauthorized.",
        status: 401,
      });

    await prisma.post.update({ data: { caption }, where: { id: postId } });

    return successResponse({ res, message: "Post updated successfully." });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;
    const { postId } = req.params;

    if (!postId) return errorResponse({ res, message: "Post ID is required." });

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post)
      return errorResponse({ res, message: "Post not found.", status: 404 });

    if (post.authorId !== id)
      return errorResponse({
        res,
        message: "Action is unauthorized.",
        status: 401,
      });

    const imageUrls = post.imageUrls;

    imageUrls.map(async (url) => {
      await deleteImagesFromCloudinary(url, "posts");
    });

    await prisma.post.delete({ where: { id: postId } });

    return successResponse({ res, message: "Post deleted successfully." });
  } catch (error) {
    next(error);
  }
};
