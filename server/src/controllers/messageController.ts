import { AuthenticatedRequest } from "../types";
import { NextFunction, Response } from "express";
import prisma from "../prisma/prisma";
import { throwError } from "../lib/utils";
import successResponse from "../lib/responses/successResponse";

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: senderId } = req.user!;
    const { receiverId, content } = req.body;

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) return throwError("User not found.", 404);

    await prisma.$transaction(async (tx) => {
      const existingChat = await tx.chat.findFirst({
        where: {
          isGroupChat: false,
          AND: [
            { members: { some: { userId: senderId } } },
            { members: { some: { userId: receiverId } } },
          ],
        },
        include: { members: true },
      });
      let chatId;
      if (!existingChat) {
        const newChat = await tx.chat.create({
          data: {
            creatorId: senderId,
          },
        });

        await tx.chatMember.createMany({
          data: [
            {
              chatId: newChat.id,
              userId: senderId,
              addedById: senderId,
            },
            {
              chatId: newChat.id,
              userId: receiverId,
              addedById: senderId,
            },
          ],
        });

        chatId = newChat.id;
      } else {
        chatId = existingChat.id;
      }

      const newMessage = await tx.message.create({
        data: {
          content,
          senderId,
          chatId,
          type: "TEXT",
        },
      });

      return successResponse({
        res,
        message: "Message sent.",
        data: newMessage,
      });
    });
  } catch (e) {
    next(e);
  }
};
