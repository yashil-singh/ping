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
  editCommentSchema,
} from "../lib/schemas/commentSchema";
import { toggleCommentLike } from "../controllers/likeController";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  checkVerifiedEmail,
  validateData(createCommentSchema),
  createComment
);
router.post(
  "/like/:commentId",
  authenticateToken,
  checkVerifiedEmail,
  toggleCommentLike
);

router.patch(
  "/",
  authenticateToken,
  checkVerifiedEmail,
  validateData(editCommentSchema),
  editComment
);

router.delete(
  "/:commentId",
  authenticateToken,
  checkVerifiedEmail,
  deleteComment
);

router.get("/", authenticateToken, checkVerifiedEmail, getComments);
export default router;
