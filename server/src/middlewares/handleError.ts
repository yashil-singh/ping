import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🚀 ~ Error:", err);

  res.status(500).json({ message: "Internal server error. Try again later." });
};

export default errorHandler;
