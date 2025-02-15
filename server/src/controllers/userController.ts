import { AuthenticatedRequest, FileUploadRequest } from "../types";
import { NextFunction, Response } from "express";
import { throwError } from "../lib/utils";
import prisma from "../prisma/prisma";
import { omitFromUser } from "../lib/contants";
import successResponse from "../lib/responses/successResponse";
import {
  deleteImageFromCloudinary,
  extractCloudinaryPublicId,
} from "../lib/cloudinary";

export const getUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany({ omit: omitFromUser });

    return successResponse({ res, data: users });
  } catch (e) {
    next(e);
  }
};

export const getUserById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id) return throwError("User ID is required.");

    const user = await prisma.user.findUnique({
      where: { id },
      omit: omitFromUser,
    });

    if (!user) return throwError("User not found.", 404);

    return successResponse({ res, data: user });
  } catch (e) {
    next(e);
  }
};

export const getUserByUsername = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.params;

    if (!username) return throwError("Username is required.");

    const user = await prisma.user.findUnique({
      where: { username },
      omit: omitFromUser,
    });

    if (!user) return throwError("User not found.", 404);

    return successResponse({ res, data: user });
  } catch (e) {
    next(e);
  }
};

export const editProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.user!;
    const { name, username, bio } = req.body;

    let user = await prisma.user.findUnique({ where: { id } });

    if (!user) return throwError("User not found.", 404);

    if (name === user.name && username === user.username && bio === user.bio)
      return successResponse({ res });

    if (username !== user.username) {
      const usernameExists = await prisma.user.findUnique({
        where: {
          username,
          NOT: {
            id,
          },
        },
      });

      if (usernameExists) throwError("Username already exists.");
    }

    user = await prisma.user.update({
      data: { name, username, bio },
      where: { id },
      omit: omitFromUser,
    });

    return successResponse({ res, message: "Profile updated.", data: user });
  } catch (e) {
    next(e);
  }
};

export const uploadAvatar = async (
  req: FileUploadRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.user!;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return throwError("User not found.", 404);

    const uploadedFile = req.file;

    if (!uploadedFile) return throwError("An image is required.");

    if (user.avatarUrl) {
      const publicId = extractCloudinaryPublicId(user.avatarUrl);
      await deleteImageFromCloudinary(publicId!, "avatars");
    }

    await prisma.user.update({
      data: { avatarUrl: uploadedFile.path },
      where: { id },
    });

    return successResponse({ res, message: "Image uploaded." });
  } catch (e) {
    next(e);
  }
};

export const removeAvatar = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.user!;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return throwError("User not found.", 404);

    if (!user.avatarUrl) return throwError("No avatar uploaded.", 404);

    const publicId = extractCloudinaryPublicId(user.avatarUrl);
    await deleteImageFromCloudinary(publicId!, "avatars");

    return successResponse({ res, message: "Image removed." });
  } catch (e) {
    next(e);
  }
};

export const togglePrivate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.user!;

    let user = await prisma.user.findUnique({ where: { id } });

    if (!user) return throwError("User not found.", 404);

    user = await prisma.user.update({
      data: {
        isPrivate: !user.isPrivate,
      },
      where: { id },
    });

    const message = user.isPrivate
      ? "Account set to private."
      : "Account set to public.";

    return successResponse({ res, message });
  } catch (e) {
    next(e);
  }
};

export const toggleConnection = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: followedById } = req.user!;
    const { userId: followedToId } = req.params;

    if (followedById === followedToId) throwError("Can't follow yourself.");

    const followedTo = await prisma.user.findUnique({
      where: { id: followedToId },
    });

    if (!followedTo) return throwError("User not found.", 404);

    let message;

    if (followedTo.isPrivate) {
      // Check if connection request is sent
      const isConnectionRequestSent = await prisma.connectionRequest.findUnique(
        {
          where: {
            followedById_followedToId: {
              followedToId,
              followedById,
            },
          },
        },
      );
      if (isConnectionRequestSent) {
        // Remove connection request
        await prisma.connectionRequest.delete({
          where: {
            followedById_followedToId: {
              followedToId,
              followedById,
            },
          },
        });
        message = "Connection request removed.";
      } else {
        // Send connection request
        await prisma.connectionRequest.create({
          data: {
            followedById,
            followedToId,
          },
        });
        message = "Connection request sent.";
      }
    } else {
      // Check if user is following
      const isFollowing = await prisma.connection.findUnique({
        where: {
          followedById_followedToId: {
            followedToId,
            followedById,
          },
        },
      });
      if (isFollowing) {
        // Unfollow user
        await prisma.connection.delete({
          where: {
            followedById_followedToId: {
              followedToId,
              followedById,
            },
          },
        });
        message = "Unfollowed user.";
      } else {
        // Follow user
        await prisma.connection.create({
          data: {
            followedById,
            followedToId,
          },
        });
        message = "Followed user.";
      }
    }

    return successResponse({ res, message });
  } catch (e) {
    next(e);
  }
};

export const handleConnectionRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: followedToId } = req.user!;
    const { userId: followedById, action } = req.params;

    if (action !== "accept" && action !== "reject")
      throwError("Invalid connection request action.");

    const connectionRequest = await prisma.connectionRequest.findUnique({
      where: {
        followedById_followedToId: {
          followedToId,
          followedById,
        },
      },
    });

    if (!connectionRequest)
      return throwError("Connection request not found.", 404);

    if (connectionRequest.isAccepted)
      throwError("Connection request already accepted.");

    let message;

    await prisma.$transaction(async (tx) => {
      await tx.connectionRequest.delete({
        where: {
          followedById_followedToId: {
            followedToId,
            followedById,
          },
        },
      });

      message = "Connection removed.";

      if (action === "accept") {
        await prisma.connection.create({
          data: {
            followedById,
            followedToId,
          },
        });

        message = "Connection accepted.";
      }
    });

    return successResponse({ res, message });
  } catch (e) {
    next(e);
  }
};
