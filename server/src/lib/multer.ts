import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";
import multer from "multer";
import { MAX_FILE_SIZE } from "./env";
import { FileUploadRequest } from "../types";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req: FileUploadRequest) => {
    const folderPath = req.uploadFolder;
    const publicId = `${req.user!.id}-${Date.now()}`;

    let size = 800;

    if (folderPath === "ping/avatars") {
      size = 500;
    }

    return {
      folder: folderPath,
      public_id: publicId,
      format: "png",
      transformation: [{ width: size, height: size, crop: "fill" }],
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: Number(MAX_FILE_SIZE),
  },
});

export default upload;
