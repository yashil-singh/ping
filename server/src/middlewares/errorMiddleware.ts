import errorResponse from "../lib/responses/errorResponse";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

const errorMiddleware = (err: any, req: Request, res: Response) => {
  console.log(err);
  let status = err.statusCode || 500;
  let message = err.message || "Internal server error. Try again later.";

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    message = "Internal server error. Try again later.";
  }
  errorResponse({
    res,
    status,
    message,
  });
};

export default errorMiddleware;
