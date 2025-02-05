import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      console.log("🚀 ~ validateRequest.ts:8 ~ req.body:", req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => issue.message);
        res.status(400).json({
          message: "Invalid data received.",
          errors: errorMessages,
        });
        return;
      }

      next(error);
    }
  };
}
