import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import checkVerifiedEmail from "../middlewares/checkVerifiedEmail";
import { setUploadFolder } from "../middlewares/setUploadFolder";
import upload from "../lib/multer";
import {
  createPost,
  deletePost,
  editPost,
  getPosts,
} from "../controllers/postController";
import { togglePostLike } from "../controllers/likeController";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  checkVerifiedEmail,
  setUploadFolder("post"),
  upload.array("images", 10),
  createPost
);
router.post(
  "/like/:postId",
  authenticateToken,
  checkVerifiedEmail,
  togglePostLike
);

router.get("/", authenticateToken, checkVerifiedEmail, getPosts);

router.patch("/", authenticateToken, checkVerifiedEmail, editPost);

router.delete("/:postId", authenticateToken, checkVerifiedEmail, deletePost);
export default router;
