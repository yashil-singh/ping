import express from "express";
import { validateData } from "../middlewares/validateRequest";
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../lib/schemas/authSchema";
import {
  forgotPassword,
  getUserbyToken,
  login,
  logout,
  resendVerificationCode,
  resetPassword,
  signup,
  verifyAccount,
} from "../controllers/authController";
import { authenticateToken } from "../middlewares/authenticateToken";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

router.post("/signup", isAuthenticated, validateData(signupSchema), signup);
router.post("/login", isAuthenticated, validateData(loginSchema), login);
router.post("/resend-verification", authenticateToken, resendVerificationCode);
router.post("/logout", authenticateToken, logout);
router.post("/forgot-password", isAuthenticated, forgotPassword);

router.get("/user", authenticateToken, getUserbyToken);

router.patch("/verify-account", authenticateToken, verifyAccount);
router.patch(
  "/reset-password",
  isAuthenticated,
  validateData(resetPasswordSchema),
  resetPassword
);

export default router;
