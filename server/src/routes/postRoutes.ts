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
import { commentSchema, replySchema } from "../lib/schemas/commentSchema";
import validateData from "../middlewares/validateData";
import {
  createComment,
  deleteComment,
  editComment,
  getCommentById,
  getCommentsByPostId,
  toggleCommentLike,
} from "../controllers/commentController";
import {
  createReply,
  deleteReply,
  editReply,
  getRepliesByCommentId,
  getReplyById,
  toggleReplyLike,
} from "../controllers/replyController";

const router = express.Router();

// post related routes
router.post(
  "/create",
  setUploadFolder("post"),
  upload.array("media", 10),
  createPost,
  cleanupUploads,
);

router.patch("/:postId", editPost);
router.patch("/:postId/toggle-archive", toggleArchive);
router.patch("/:postId/toggle-like", togglePostLike);

router.get("/", getPosts);
router.get("/:postId/likes", getPostLikes);

router.delete("/:postId", deletePost);

// comment related routes
router.post("/:postId/comment", validateData(commentSchema), createComment);

router.patch("/comments/:commentId", validateData(commentSchema), editComment);
router.patch("/comments/:commentId/toggle-like", toggleCommentLike);

router.get("/:postId/comments", getCommentsByPostId);
router.get("/comments/:commentId", getCommentById);

router.delete("/comments/:commentId", deleteComment);

// reply related routes
router.post(
  "/comments/:commentId/reply",
  validateData(replySchema),
  createReply,
);

router.patch("/replies/:replyId", editReply);
router.patch("/replies/:replyId/toggle-like", toggleReplyLike);

router.get("/comments/:commentId/replies", getRepliesByCommentId);
router.get("/replies/:replyId", getReplyById);

router.delete("/replies/:replyId", deleteReply);

export default router;
