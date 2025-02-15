import { AuthenticatedRequest } from "../types";
import { NextFunction, Response } from "express";
import prisma from "../prisma/prisma";
import { throwError } from "../lib/utils";
import successResponse from "../lib/responses/successResponse";

export const createReply = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: authorId } = req.user!;
    const { commentId } = req.params;
    const { content, replyToId } = req.body;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) return throwError("Comment not found", 404);

    const replyTo = await prisma.user.findUnique({ where: { id: replyToId } });
    if (!replyTo) return throwError("User not found", 404);

    const reply = await prisma.reply.create({
      data: {
        content,
        commentId,
        authorId,
        replyToId,
      },
    });

    return successResponse({
      res,
      message: "Reply added to comment.",
      data: reply,
    });
  } catch (e) {
    next(e);
  }
};

export const editReply = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: authorId } = req.user!;
    const { replyId } = req.params;
    const { content } = req.body;

    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
    });
    if (!reply) return throwError("Comment not found", 404);

    if (authorId !== reply.authorId) throwError("Action unauthorized.", 401);

    const updatedReply = await prisma.reply.update({
      data: {
        content,
      },
      where: { id: replyId },
    });

    return successResponse({
      res,
      message: "Reply updated.",
      data: updatedReply,
    });
  } catch (e) {
    next(e);
  }
};

export const getReplyById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { replyId } = req.params;

    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
    });
    if (!reply) return throwError("Reply not found", 404);

    return successResponse({ res, data: reply });
  } catch (e) {
    next(e);
  }
};

export const getRepliesByCommentId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) return throwError("Post not found", 404);

    const replies = await prisma.reply.findMany({
      where: { commentId },
      orderBy: { createdAt: "desc" },
    });

    return successResponse({ res, data: replies });
  } catch (e) {
    next(e);
  }
};

export const deleteReply = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: authorId } = req.user!;
    const { replyId } = req.params;

    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
    });
    if (!reply) return throwError("Reply not found", 404);

    if (authorId !== reply.authorId) throwError("Action not authorized.", 401);

    await prisma.reply.delete({ where: { id: replyId } });

    return successResponse({ res, message: "Reply deleted." });
  } catch (e) {
    next(e);
  }
};

export const toggleReplyLike = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.user!;
    const { replyId } = req.params;

    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
    });
    if (!reply) return throwError("Comment not found", 404);

    const hasLiked = await prisma.replyLike.findUnique({
      where: {
        replyId_userId: {
          replyId,
          userId,
        },
      },
    });

    let message;

    if (hasLiked) {
      await prisma.replyLike.delete({
        where: {
          replyId_userId: {
            replyId,
            userId,
          },
        },
      });
      message = "Like removed.";
    } else {
      await prisma.replyLike.create({
        data: {
          replyId,
          userId,
        },
      });
      message = "Reply liked.";
    }

    return successResponse({ res, message });
  } catch (e) {
    next(e);
  }
};
