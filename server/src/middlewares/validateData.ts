import { Request, Response, NextFunction } from "express";
import z, { ZodError } from "zod";

const validateData = (
  schema: z.ZodObject<any, any>,
  toValidate: "body" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (toValidate === "body") {
        schema.parse(req.body);
      } else {
        schema.parse(req.params);
      }

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

export default validateData;
