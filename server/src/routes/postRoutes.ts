import express, { Request, Response } from "express";
import { createPost, getPosts } from "../controllers/postController";
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

router.get("/", getPosts);

export default router;
