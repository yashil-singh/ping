import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

export const dataValidation = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => issue.message);
        res.status(400).json({
          message: "Validation Error",
          errors: errorMessages,
        });

        return;
      }

      next();
    }
  };
};
