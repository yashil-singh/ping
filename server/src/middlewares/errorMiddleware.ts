import errorResponse from "../lib/responses/errorResponse";
import { Request, Response, NextFunction } from "express";

const errorMiddlware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = err.statusCode || 500;
  let message = err.message || "Internal server error. Try again later.";

  errorResponse({
    res,
    status,
    message,
  });
};

export default errorMiddlware;
