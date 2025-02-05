import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";
import { UploadImageRequest } from "./types";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req: UploadImageRequest, file) => {
    const folderPath = req.uploadFolder; // Update the folder path here

    const publicId = `${file.fieldname}-${Date.now()}`;

    return {
      folder: folderPath,
      public_id: publicId,
      format: "png",
      transformation: [
        { width: 800, height: 800, crop: "limit" }, // Resizes images before upload
      ],
    };
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10mb
  },
});

export default upload;
