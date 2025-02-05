import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../lib/types";
import prisma from "../lib/prisma";
import errorResponse from "../lib/response/errorResponse";
import successResponse from "../lib/response/successResponse";

export const createReply = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;
    const { content, commentId, replyToId } = req.body;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment)
      return errorResponse({ res, message: "Comment not found.", status: 404 });

    const replyTo = await prisma.user.findUnique({ where: { id: replyToId } });

    if (!replyTo)
      return errorResponse({
        res,
        message: "User to reply not found.",
        status: 404,
      });

    const reply = await prisma.reply.create({
      data: { content, commentId, authorId: userId, replyToId },
    });

    return successResponse({ res, message: "Comment replied.", data: reply });
  } catch (error) {
    next(error);
  }
};

export const editReply = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;
    const { content, replyId } = req.body;

    const reply = await prisma.reply.findUnique({ where: { id: replyId } });

    if (!reply)
      return errorResponse({ res, message: "Reply not found.", status: 404 });

    if (reply.authorId !== userId)
      return errorResponse({
        res,
        message: "Action unauthorized.",
        status: 401,
      });

    await prisma.reply.update({ data: { content }, where: { id: replyId } });

    return successResponse({ res, message: "Reply edited." });
  } catch (error) {
    next(error);
  }
};

export const deleteReply = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;
    const { replyId } = req.params;

    if (!replyId)
      return errorResponse({ res, message: "Reply ID is required." });

    const reply = await prisma.reply.findUnique({ where: { id: replyId } });

    if (!reply)
      return errorResponse({ res, message: "Reply not found.", status: 404 });

    if (reply.authorId !== userId)
      return errorResponse({
        res,
        message: "Action unauthorized.",
        status: 401,
      });

    await prisma.reply.delete({ where: { id: replyId } });

    return successResponse({ res, message: "Reply deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const getReplies = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const replies = await prisma.reply.findMany({
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

    return successResponse({ res, data: replies });
  } catch (error) {
    next(error);
  }
};
