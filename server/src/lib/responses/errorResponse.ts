import { Response } from "express";

const errorResponse = ({
  res,
  status = 400,
  message,
}: {
  res: Response;
  status?: number;
  message: string;
}) => {
  res.status(status).json({ success: false, message });
};

export default errorResponse;
