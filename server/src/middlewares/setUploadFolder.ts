import { NextFunction, Response } from "express";
import { UploadImageRequest } from "../lib/types";

export const setUploadFolder = (type: "avatar" | "post" | "message") => {
  return (req: UploadImageRequest, res: Response, next: NextFunction) => {
    switch (type) {
      case "avatar":
        req.uploadFolder = "ping/avatars";
        break;
      case "post":
        req.uploadFolder = "ping/posts";
        break;
      case "message":
        req.uploadFolder = "ping/messages";
        break;
      default:
        req.uploadFolder = "ping/others";
        break;
    }

    next();
  };
};
