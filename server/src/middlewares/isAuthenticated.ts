import { NextFunction, Request, Response } from "express";
import errorResponse from "../lib/errorResponse";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (token) {
    return errorResponse({
      res,
      message: "Account is logged in somewhere else.",
    });
  }

  next();
};

export default isAuthenticated;
