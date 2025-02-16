import express from "express";
import {
  createChat,
  deleteChat,
  getChatById,
  getChatsByUserId,
} from "../controllers/chatController";

const router = express.Router();

router.post("/", createChat);

router.get("/user-chats", getChatsByUserId);
router.get("/:chatId", getChatById);

router.delete("/:chatId", deleteChat);

export default router;
