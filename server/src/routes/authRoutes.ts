import express from "express";
import {
  login,
  logout,
  resendResetLink,
  resendVerificationCode,
  resetPassword,
  sendResetLink,
  signup,
  verifyAccount,
} from "../controllers/authController";
import authenticate from "../middlewares/authenticate";
import {
  loginSchema,
  resetPasswordSchema,
  sendResetLinkSchema,
  signupSchema,
  verifyAccountSchema,
} from "../lib/schemas/authSchema";
import validateData from "../middlewares/validateData";

const router = express.Router();

router.post("/signup", validateData(signupSchema), signup);
router.post("/login", validateData(loginSchema), login);
router.post("/logout", authenticate, logout);

router.patch(
  "/verify-account",
  authenticate,
  validateData(verifyAccountSchema),
  verifyAccount,
);
router.patch("/verification-code/resend", authenticate, resendVerificationCode);
router.patch("/reset-link", validateData(sendResetLinkSchema), sendResetLink);
router.patch(
  "/reset-link/resend",
  validateData(sendResetLinkSchema),
  resendResetLink,
);
router.patch(
  "/reset-password",
  validateData(resetPasswordSchema),
  resetPassword,
);

export default router;
