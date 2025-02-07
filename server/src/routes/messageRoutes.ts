import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import checkVerifiedEmail from "../middlewares/checkVerifiedEmail";
import { checkUserRelation } from "../middlewares/checkUserRelation";
import {
  deleteMessage,
  editMessage,
  getMessagesByChatId,
  getUserChats,
  sendMessage,
} from "../controllers/messageController";
import { validateData } from "../middlewares/validateRequest";
import {
  editMessageSchema,
  sendMessageSchema,
} from "../lib/schemas/messageSchema";
import upload from "../lib/multer";
import { setUploadFolder } from "../middlewares/setUploadFolder";

const router = express.Router();

router.post(
  "/send",
  authenticateToken,
  checkVerifiedEmail,
  setUploadFolder("message"),
  upload.array("media", 5),
  checkUserRelation,
  validateData(sendMessageSchema),
  sendMessage
);

router.patch(
  "/",
  authenticateToken,
  checkVerifiedEmail,
  validateData(editMessageSchema),
  editMessage
);

router.delete(
  "/:messageId",
  authenticateToken,
  checkVerifiedEmail,
  deleteMessage
);

router.get(
  "/chat/:chatId",
  authenticateToken,
  checkVerifiedEmail,
  getMessagesByChatId
);

router.get("/chats", authenticateToken, checkVerifiedEmail, getUserChats);

export default router;
