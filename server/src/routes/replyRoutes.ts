import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import checkVerifiedEmail from "../middlewares/checkVerifiedEmail";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
} from "../controllers/commentController";
import { validateData } from "../middlewares/validateRequest";
import {
  createCommentSchema,
  createReplySchema,
  editCommentSchema,
  editReplySchema,
} from "../lib/schemas/commentSchema";
import {
  toggleCommentLike,
  toggleReplyLike,
} from "../controllers/likeController";
import {
  createReply,
  deleteReply,
  editReply,
  getReplies,
} from "../controllers/replyController";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  checkVerifiedEmail,
  validateData(createReplySchema),
  createReply
);
router.post(
  "/like/:replyId",
  authenticateToken,
  checkVerifiedEmail,
  toggleReplyLike
);

router.patch(
  "/",
  authenticateToken,
  checkVerifiedEmail,
  validateData(editReplySchema),
  editReply
);

router.delete("/:replyId", authenticateToken, checkVerifiedEmail, deleteReply);

router.get("/", authenticateToken, checkVerifiedEmail, getReplies);
export default router;
