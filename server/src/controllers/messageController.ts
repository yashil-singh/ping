import { AuthenticatedRequest } from "../types";
import { NextFunction, Response } from "express";
import prisma from "../prisma/prisma";
import { throwError } from "../lib/utils";
import successResponse from "../lib/responses/successResponse";
import { selectUserSummary } from "../lib/contants";

export const checkIsMember = async (userId: string, chatId: string) => {
  const isMember = await prisma.chatMember.findUnique({
    where: {
      userId_chatId: {
        userId,
        chatId,
      },
    },
  });

  if (isMember) return true;

  return false;
};

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.user!;
    const { chatId } = req.params;
    const { content } = req.body;

    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) return throwError("Chat not found", 404);

    const isMember = await checkIsMember(userId, chatId);

    if (!isMember) throwError("You are not part of this chat.", 401);

    const newMessage = await prisma.message.create({
      data: {
        chatId,
        content,
        senderId: userId,
        type: "TEXT",
      },
    });

    return successResponse({ res, message: "Message sent.", data: newMessage });
  } catch (e) {
    next(e);
  }
};

export const editMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: senderId } = req.user!;
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message) return throwError("Message not found.", 401);

    if (senderId !== message.senderId)
      throwError("You are not the author of this message.", 401);

    if (message.type !== "TEXT") throwError("Message cannot be edited");

    const updatedMessage = await prisma.message.update({
      data: {
        content,
      },
      where: { id: messageId },
    });

    return successResponse({
      res,
      message: "Message edited.",
      data: updatedMessage,
    });
  } catch (e) {
    next(e);
  }
};

export const getMessagesByChatId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.user!;
    const { chatId } = req.params;

    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) return throwError("Chat not found", 404);

    const isMember = await checkIsMember(userId, chatId);

    if (!isMember) throwError("You are not part of this chat.", 401);

    const messages = await prisma.message.findMany({
      include: {
        sender: {
          select: selectUserSummary,
        },
        post: {
          include: {
            media: true,
          },
        },
        media: true,
      },
      where: {
        chatId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse({ res, data: messages });
  } catch (e) {
    next(e);
  }
};

export const getMessageByMessageId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.user!;
    const { messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: {
          select: selectUserSummary,
        },
        post: {
          include: {
            media: true,
          },
        },
        media: true,
      },
    });
    if (!message) return throwError("Message not found", 404);

    const isMember = await checkIsMember(userId, message.chatId);
    if (!isMember) throwError("You are not part of this chat.", 401);

    return successResponse({ res, data: message });
  } catch (e) {
    next(e);
  }
};

export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: senderId } = req.user!;
    const { messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message) return throwError("Message not found", 404);

    if (senderId !== message.senderId)
      return throwError("You are not the author of this message.", 401);

    await prisma.message.delete({
      where: { id: messageId },
    });

    return successResponse({ res, message: "Message deleted." });
  } catch (e) {
    next(e);
  }
};
