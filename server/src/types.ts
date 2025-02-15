import { Request } from "express";

export type JwtPayload = {
  id: string;
};

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | null;
}

export interface FileUploadRequest extends AuthenticatedRequest {
  uploadFolder?: string;
}
