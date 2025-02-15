import express from "express";
import { sendMessage } from "../controllers/messageController";
import validateData from "../middlewares/validateData";
import { sendMessageSchema } from "../lib/schemas/messageSchema";

const router = express.Router();

router.post("/", validateData(sendMessageSchema), sendMessage);

export default router;
