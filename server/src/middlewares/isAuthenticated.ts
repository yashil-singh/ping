import { NextFunction, Request, Response } from "express";
import errorResponse from "../lib/response/errorResponse";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (token) {
    return errorResponse({
      res,
      message: "You are already logged in.",
    });
  }

  next();
};

export default isAuthenticated;
