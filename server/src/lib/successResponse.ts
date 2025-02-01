import { Response } from "express";

const successResponse = ({
  status = 200,
  message,
  data,
  res,
}: {
  status?: number;
  message?: string;
  data?: any;
  res: Response;
}) => {
  res.status(status).json({ message, data });
};

export default successResponse;
