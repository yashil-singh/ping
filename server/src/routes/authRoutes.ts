import express, { Request, Response } from "express";
import { validateData } from "../middlewares/validateRequest";
import {
  changePasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../lib/schemas/authSchema";
import {
  changePassword,
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
import upload from "../lib/multer";

const router = express.Router();

router.post("/signup", isAuthenticated, validateData(signupSchema), signup);
router.post("/login", isAuthenticated, validateData(loginSchema), login);
router.post("/resend-verification", authenticateToken, resendVerificationCode);
router.post("/logout", authenticateToken, logout);
router.post("/forgot-password", isAuthenticated, forgotPassword);

router.post(
  "/upload",
  upload.single("image"),
  (req: Request, res: Response) => {
    const fileUrl = req?.file?.path; // URL of the uploaded file in Cloudinary

    // Perform any additional logic or save the file URL to a database

    res.status(200).json({ success: true, fileUrl: fileUrl });
  }
);

router.get("/user", authenticateToken, getUserbyToken);

router.patch("/verify-account", authenticateToken, verifyAccount);
router.patch(
  "/reset-password",
  isAuthenticated,
  validateData(resetPasswordSchema),
  resetPassword
);
router.patch(
  "/change-password",
  authenticateToken,
  validateData(changePasswordSchema),
  changePassword
);

export default router;
