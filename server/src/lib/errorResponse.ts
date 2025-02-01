import { Response } from "express";

const errorResponse = ({
  status = 400,
  message,
  res,
}: {
  status?: number;
  message: string;
  res: Response;
}) => {
  res.status(status).json({ message });
};

export default errorResponse;
