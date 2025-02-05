import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { validateData } from "../middlewares/validateRequest";
import { editProfileSchema } from "../lib/schemas/userScehma";
import { editProfile } from "../controllers/userController";
import upload from "../lib/multer";
import { setUploadFolder } from "../middlewares/setUploadFolder";

const router = express.Router();

router.patch(
  "/edit-profile",
  authenticateToken,
  setUploadFolder("avatar"),
  upload.single("avatar"),
  validateData(editProfileSchema),
  editProfile
);

export default router;
