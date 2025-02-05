import { AuthenticatedRequest } from "./../lib/types";
import { NextFunction, Response } from "express";
import prisma from "../lib/prisma";
import errorResponse from "../lib/response/errorResponse";
import successResponse from "../lib/response/successResponse";

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;
    const { content, postId } = req.body;

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post)
      return errorResponse({ res, message: "Post not found.", status: 404 });

    const comment = await prisma.comment.create({
      data: { content, authorId: id, postId },
    });

    return successResponse({
      res,
      message: "Commented successfully.",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;
    const { content, commentId } = req.body;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment)
      return errorResponse({ res, message: "Comment not found.", status: 404 });

    if (comment.authorId !== id)
      return errorResponse({
        res,
        message: "Action not authorized.",
        status: 401,
      });

    await prisma.comment.update({
      data: { content },
      where: { id: commentId },
    });

    return successResponse({ res, message: "Comment updated successfully." });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;
    const { commentId } = req.params;

    if (!commentId)
      return errorResponse({ res, message: "Comment ID is required." });

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment)
      return errorResponse({ res, message: "Comment not found.", status: 404 });

    if (comment.authorId !== id)
      return errorResponse({
        res,
        message: "Action not authorized.",
        status: 401,
      });

    await prisma.comment.delete({ where: { id: commentId } });

    return successResponse({ res, message: "Comment deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return successResponse({ res, data: comments });
  } catch (error) {
    next(error);
  }
};
