import { AuthenticatedRequest } from "../types";
import { NextFunction, Response } from "express";
import prisma from "../prisma/prisma";
import { throwError } from "../lib/utils";
import successResponse from "../lib/responses/successResponse";

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: authorId } = req.user!;
    const { postId } = req.params;
    const { content } = req.body;

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return throwError("Post not found", 404);

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
    });

    return successResponse({
      res,
      message: "Comment added to post.",
      data: comment,
    });
  } catch (e) {
    next(e);
  }
};

export const editComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: authorId } = req.user!;
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) return throwError("Comment not found", 404);

    if (authorId !== comment.authorId) throwError("Action unauthorized.", 401);

    const updatedComment = await prisma.comment.update({
      data: {
        content,
      },
      where: { id: commentId },
    });

    return successResponse({
      res,
      message: "Comment updated.",
      data: updatedComment,
    });
  } catch (e) {
    next(e);
  }
};

export const getCommentById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) return throwError("Comment not found", 404);

    return successResponse({ res, data: comment });
  } catch (e) {
    next(e);
  }
};

export const getCommentsByPostId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return throwError("Post not found", 404);

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
    });

    return successResponse({ res, data: comments });
  } catch (e) {
    next(e);
  }
};

export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: authorId } = req.user!;
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) return throwError("Comment not found", 404);

    if (authorId !== comment.authorId)
      throwError("Action not authorized.", 401);

    await prisma.comment.delete({ where: { id: commentId } });

    return successResponse({ res, message: "Comment deleted." });
  } catch (e) {
    next(e);
  }
};

export const toggleCommentLike = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.user!;
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) return throwError("Comment not found", 404);

    const hasLiked = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    });

    let message;

    if (hasLiked) {
      await prisma.commentLike.delete({
        where: {
          commentId_userId: {
            commentId,
            userId,
          },
        },
      });
      message = "Like removed.";
    } else {
      await prisma.commentLike.create({
        data: {
          commentId,
          userId,
        },
      });
      message = "Comment liked.";
    }

    return successResponse({ res, message });
  } catch (e) {
    next(e);
  }
};
