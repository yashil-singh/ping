import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../lib/types";
import errorResponse from "../lib/response/errorResponse";
import prisma from "../lib/prisma";
import successResponse from "../lib/response/successResponse";

export const togglePostLike = async (
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

    const hasUserLiked = await prisma.postLike.findFirst({
      where: { likerId: id },
    });

    let message;

    if (hasUserLiked) {
      await prisma.postLike.delete({ where: { id: hasUserLiked.id } });
      message = "Like removed.";
    } else {
      await prisma.postLike.create({ data: { postId, likerId: id } });
      message = "Post liked.";
    }

    return successResponse({ res, message });
  } catch (error) {
    next(error);
  }
};

export const toggleCommentLike = async (
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

    const hasUserLiked = await prisma.commentLike.findFirst({
      where: { likerId: id },
    });

    let message;

    if (hasUserLiked) {
      await prisma.commentLike.delete({ where: { id: hasUserLiked.id } });
      message = "Like removed.";
    } else {
      await prisma.commentLike.create({ data: { commentId, likerId: id } });
      message = "Comment liked.";
    }

    return successResponse({ res, message });
  } catch (error) {
    next(error);
  }
};

export const toggleReplyLike = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;
    const { replyId } = req.params;

    if (!replyId)
      return errorResponse({ res, message: "Reply ID is required." });

    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!reply)
      return errorResponse({ res, message: "Reply not found.", status: 404 });

    const hasUserLiked = await prisma.replyLike.findFirst({
      where: { likerId: id },
    });

    let message;

    if (hasUserLiked) {
      await prisma.replyLike.delete({ where: { id: hasUserLiked.id } });
      message = "Like removed.";
    } else {
      await prisma.replyLike.create({ data: { replyId, likerId: id } });
      message = "Reply liked.";
    }

    return successResponse({ res, message });
  } catch (error) {
    next(error);
  }
};
