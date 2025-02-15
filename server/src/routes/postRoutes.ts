import express from "express";
import {
  createPost,
  deletePost,
  editPost,
  getPostLikes,
  getPosts,
  toggleArchive,
  togglePostLike,
} from "../controllers/postController";
import upload from "../lib/multer";
import setUploadFolder from "../middlewares/setUploadFolder";
import cleanupUploads from "../middlewares/cleanupUploads";
import { createCommentSchema } from "../lib/schemas/commentSchema";
import validateData from "../middlewares/validateData";
import {
  createComment,
  deleteComment,
  editComment,
  getCommentById,
  getCommentsByPostId,
  toggleCommentLike,
} from "../controllers/commentController";

const router = express.Router();

router.post(
  "/create",
  setUploadFolder("post"),
  upload.array("media", 10),
  createPost,
  cleanupUploads,
);
router.post(
  "/:postId/comment",
  validateData(createCommentSchema),
  createComment,
);

router.patch("/:postId", editPost);
router.patch("/comments/:commentId", editComment);
router.patch("/:postId/toggle-archive", toggleArchive);
router.patch("/:postId/toggle-like", togglePostLike);
router.patch("/comments/:commentId/toggle-like", toggleCommentLike);

router.get("/", getPosts);
router.get("/:postId/likes", getPostLikes);
router.get("/:postId/comments", getCommentsByPostId);
router.get("/comments/:commentId", getCommentById);

router.delete("/:postId", deletePost);
router.delete("/comments/:commentId", deleteComment);

export default router;
