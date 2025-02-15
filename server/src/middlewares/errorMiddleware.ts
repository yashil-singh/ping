import errorResponse from "../lib/responses/errorResponse";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { MulterError } from "multer";
import { MAX_FILE_SIZE } from "../lib/env";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status = err.statusCode || 500;
  let message = err.message || "Internal server error. Try again later.";

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    message = "Internal server error. Try again later.";
  }

  if (err instanceof MulterError) {
    status = 400;

    if (err.code === "LIMIT_FILE_SIZE") {
      const maxFileSizeInMb = Number(process.env.MAX_FILE_SIZE) / (1024 * 1024);
      message = `A file exceeds the size limit of ${maxFileSizeInMb}MB.`;
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "Unexpected number of files to received.";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file received.";
    }
  }

  errorResponse({
    res,
    status,
    message,
  });
};

export default errorMiddleware;
