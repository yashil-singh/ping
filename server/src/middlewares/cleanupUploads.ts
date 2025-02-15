import { FileUploadRequest } from "../types";
import { NextFunction, Response } from "express";
import {
  deleteImageFromCloudinary,
  extractCloudinaryPublicId,
} from "../lib/cloudinary";

/**
 * Middleware to delete uploaded media in case of errors.
 */
const cleanupUploads = async (
  err: any,
  req: FileUploadRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const mediaFiles = req?.files as Express.Multer.File[];

    if (!mediaFiles || mediaFiles.length < 1) {
      return next(err);
    }

    for (const file of mediaFiles) {
      const publicId = extractCloudinaryPublicId(file.path);
      await deleteImageFromCloudinary(publicId!, file.filename.split("/")[1]);
    }

    next(err);
  } catch (e) {
    next(e);
  }
};

export default cleanupUploads;
