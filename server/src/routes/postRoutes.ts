import express from "express";
import {
  createPost,
  deletePost,
  editPost,
  getPosts,
} from "../controllers/postController";
import upload from "../lib/multer";
import setUploadFolder from "../middlewares/setUploadFolder";
import cleanupUploads from "../middlewares/cleanupUploads";

const router = express.Router();

router.post(
  "/create",
  setUploadFolder("post"),
  upload.array("media", 10),
  createPost,
  cleanupUploads,
);

router.patch("/:postId", editPost);

router.get("/", getPosts);

router.delete("/:postId", deletePost);

export default router;
