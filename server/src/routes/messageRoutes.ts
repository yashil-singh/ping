import express from "express";
import {
  deleteMessage,
  editMessage,
  getMessageByMessageId,
  getMessagesByChatId,
  sendMediaMessage,
  sendMessage,
  sharePost,
} from "../controllers/messageController";
import validateData from "../middlewares/validateData";
import { sendMessageSchema } from "../lib/schemas/messageSchema";
import upload from "../lib/multer";
import setUploadFolder from "../middlewares/setUploadFolder";
import cleanupUploads from "../middlewares/cleanupUploads";

const router = express.Router();

router.post("/chat/:chatId", validateData(sendMessageSchema), sendMessage);
router.post(
  "/chat/:chatId/media",
  setUploadFolder("message"),
  upload.array("media", 10),
  sendMediaMessage,
  cleanupUploads,
);
router.post("/chat/:chatId/post/:postId", sharePost);

router.patch("/:messageId", validateData(sendMessageSchema), editMessage);

router.get("/chat/:chatId", getMessagesByChatId);
router.get("/:messageId", getMessageByMessageId);

router.delete("/:messageId", deleteMessage);

export default router;
