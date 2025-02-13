import { Response } from "express";

const successResponse = ({
  res,
  status = 200,
  message,
  data,
}: {
  res: Response;
  status?: number;
  message?: string;
  data?: any;
}) => {
  res.status(status).json({ message, data });
};

export default successResponse;
