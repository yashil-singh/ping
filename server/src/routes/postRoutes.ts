import express from "express";
import {
  createPost,
  deletePost,
  getPosts,
} from "../controllers/postController";
import upload from "../lib/multer";
import setUploadFolder from "../middlewares/setUploadFolder";
import cleanupUploads from "../middlewares/cleanupUploads";
import validateData from "../middlewares/validateData";
import { deletePostSchema } from "../lib/schemas/postSchema";

const router = express.Router();

router.post(
  "/create",
  setUploadFolder("post"),
  upload.array("media", 10),
  createPost,
  cleanupUploads,
);

router.get("/", getPosts);

router.delete("/:postId", validateData(deletePostSchema, "params"), deletePost);

export default router;
