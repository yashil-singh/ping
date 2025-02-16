import express from "express";
import {
  deleteMessage,
  editMessage,
  getMessageByMessageId,
  getMessagesByChatId,
  sendMessage,
} from "../controllers/messageController";
import validateData from "../middlewares/validateData";
import { sendMessageSchema } from "../lib/schemas/messageSchema";

const router = express.Router();

router.post("/chat/:chatId", validateData(sendMessageSchema), sendMessage);

router.patch("/:messageId", validateData(sendMessageSchema), editMessage);

router.get("/chat/:chatId", getMessagesByChatId);
router.get("/:messageId", getMessageByMessageId);

router.delete("/:messageId", deleteMessage);

export default router;
