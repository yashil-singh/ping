import { FileUploadRequest } from "../types";
import { NextFunction, Response } from "express";

const setUploadFolder = (type: "avatar" | "post" | "message") => {
  return (req: FileUploadRequest, res: Response, next: NextFunction) => {
    try {
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
    } catch (e) {
      next(e);
    }
  };
};

export default setUploadFolder;
