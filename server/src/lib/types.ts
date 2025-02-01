import { Request } from "express";

export type User = {};

export type TokenPayload = {
  id: string;
  isVerified: boolean;
};

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export type EmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};
