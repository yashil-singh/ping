import { AuthenticatedRequest } from "../types";
import { NextFunction, Response } from "express";
import successResponse from "../lib/responses/successResponse";
import prisma from "../prisma/prisma";
import { throwError } from "../lib/utils";
import { selectChatRecentMessage, selectUserSummary } from "../lib/contants";
import { checkIsMember } from "./messageController";

export const createChat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: senderId } = req.user!;
    const { receiverId } = req.body;

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) return throwError("User not found.", 404);

    const existingChat = await prisma.chat.findFirst({
      where: {
        isGroupChat: false,
        AND: [
          { members: { some: { userId: senderId } } },
          { members: { some: { userId: receiverId } } },
        ],
      },
    });

    let message;

    if (!existingChat) {
      await prisma.$transaction(async (tx) => {
        const newChat = await tx.chat.create({
          data: {
            creatorId: senderId,
          },
        });

        await tx.chatMember.createMany({
          data: [
            {
              addedById: senderId,
              chatId: newChat.id,
              userId: senderId,
            },
            {
              addedById: senderId,
              chatId: newChat.id,
              userId: receiverId,
            },
          ],
        });
      });
    } else {
      message = "Chat already exists.";
    }
    return successResponse({ res, message: "Chat created." });
  } catch (e) {
    next(e);
  }
};

export const getChatsByUserId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.user!;

    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          select: {
            user: {
              select: selectUserSummary,
            },
          },
          where: {
            NOT: {
              userId,
            },
          },
        },
        messages: {
          select: selectChatRecentMessage,
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return successResponse({ res, data: chats });
  } catch (e) {
    next(e);
  }
};

export const getChatById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.user!;
    const { chatId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: {
          select: {
            user: {
              select: selectUserSummary,
            },
          },
          where: {
            NOT: { userId },
          },
        },
        messages: {
          select: selectChatRecentMessage,
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
    if (!chat) return throwError("Chat not found.", 404);

    const isMember = checkIsMember(userId, chatId);

    if (!isMember) throwError("You are not part of this chat.", 401);

    return successResponse({ res, data: chat });
  } catch (e) {
    next(e);
  }
};

export const deleteChat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.user!;
    const { chatId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!chat) return throwError("Chat not found.", 404);

    const isChatMember = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    if (!isChatMember) return throwError("Action unauthorized.", 404);

    await prisma.chatMember.update({
      data: {
        hasDeleted: true,
      },
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    });

    return successResponse({ res, message: "Chat deleted." });
  } catch (e) {
    next(e);
  }
};
