import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../lib/types";
import errorResponse from "../lib/response/errorResponse";
import prisma from "../lib/prisma";
import successResponse from "../lib/response/successResponse";
import { deleteImagesFromCloudinary } from "../lib/utils";

export const checkIfChatExists = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  try {
    let chat = await prisma.chat.findFirst({
      where: {
        isGroupChat: false,
        members: {
          every: {
            memberId: { in: [senderId, receiverId] },
          },
        },
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: { isGroupChat: false, creatorId: senderId },
      });
      await prisma.chatMember.createMany({
        data: [
          { memberId: senderId, chatId: chat.id },
          { memberId: receiverId, chatId: chat.id },
        ],
      });
    }

    console.log("🚀 ~ messageController.ts:39 ~ chat:", chat);
    return chat;
  } catch (error) {}
};

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: senderId } = req.user!;
    const { content, receiverId } = req.body;

    const media =
      (req.files as Express.Multer.File[])?.map((file) => file) || [];

    const chat = await checkIfChatExists({ receiverId, senderId });

    if (!chat) throw new Error("Something went wrong. Try again later.");

    let message;

    if (media.length > 0) {
      message = await prisma.message.create({
        data: { senderId, chatId: chat.id, type: "MEDIA" },
        include: {
          media: {
            select: {
              id: true,
              type: true,
              url: true,
              createdAt: true,
            },
          },
        },
      });

      const messageId = message.id;

      media.map(async (file) => {
        await prisma.messageMedia.create({
          data: {
            url: file.path,
            messageId,
            type: file.mimetype.startsWith("video.") ? "VIDEO" : "IMAGE",
          },
        });
      });
    } else {
      if (!content)
        return errorResponse({ res, message: "Message can not be empty." });

      message = await prisma.message.create({
        data: { content, type: "TEXT", senderId, chatId: chat.id },
      });
    }

    const data = await prisma.message.findUnique({
      where: { id: message.id },
    });

    await prisma.chat.update({
      data: {
        lastMessageAt: new Date(),
      },
      where: {
        id: chat.id,
      },
    });

    return successResponse({ res, message: "Message sent.", data });
  } catch (error) {
    const media = (req.files as Express.Multer.File[]) || [];

    if (media.length > 0) {
      media.forEach((file) => {
        deleteImagesFromCloudinary(file.path, file.filename.split("/")[1]);
      });
    }

    next(error);
  }
};

export const editMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;
    const { messageId, content } = req.body;

    if (!messageId)
      return errorResponse({ res, message: "Message ID is required." });

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message)
      return errorResponse({ res, status: 404, message: "Message not found." });

    if (message.senderId !== userId)
      return errorResponse({
        res,
        status: 401,
        message: "Action not authorized.",
      });

    if (!message.content || message.type === "MEDIA")
      return errorResponse({ res, message: "This message can not be edited." });

    await prisma.message.update({
      data: { content },
      where: { id: messageId },
    });

    return successResponse({ res, message: "Message edited successfully." });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;
    const { messageId } = req.params;

    if (!messageId)
      return errorResponse({ res, message: "Message ID is required." });

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        media: true,
      },
    });

    if (!message)
      return errorResponse({ res, status: 404, message: "Message not found." });

    if (message.senderId !== userId)
      return errorResponse({
        res,
        status: 401,
        message: "Action not authorized.",
      });

    if (message.type === "MEDIA" || message.media.length > 0) {
      message.media.forEach(async (media) => {
        await deleteImagesFromCloudinary(media.url, "messages");
      });
    }
    await prisma.message.delete({ where: { id: messageId } });

    return successResponse({ res, message: "Message deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const getMessagesByChatId = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;
    const { chatId } = req.params;

    if (!chatId) return errorResponse({ res, message: "Chat ID is required." });

    const chat = await prisma.chat.findUnique({ where: { id: chatId } });

    if (!chat)
      return errorResponse({ res, status: 404, message: "Chat not found." });

    const chatMembers = await prisma.chatMember.findMany({ where: { chatId } });

    const isMember = chatMembers.map((chatMember) => {
      const memberId = chatMember.memberId;

      if (memberId === userId) return true;
    });

    if (!isMember)
      return errorResponse({ res, message: "User is not part of the chat." });

    const messages = await prisma.message.findMany({
      where: { chatId },
      include: { media: true },
    });

    return successResponse({ res, data: messages });
  } catch (error) {
    next(error);
  }
};

export const getUserChats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;

    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            memberId: userId,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    return successResponse({ res, data: chats });
  } catch (error) {
    next(error);
  }
};
