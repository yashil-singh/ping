import {
  login,
  resetPassword,
  sendResetLink,
  signup,
} from "../controllers/authController";
import express from "express";
import { dataValidation } from "../middlewares/dataValidation";
import { signupSchema } from "../lib/schemas/authSchema";

const router = express.Router();

router.post("/signup", dataValidation(signupSchema), signup);
router.post("/login", login);

router.get("/reset-link", sendResetLink);

router.patch("/reset-password", resetPassword);

export default router;
