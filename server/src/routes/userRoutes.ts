import express from "express";
import {
  editProfile,
  getUserById,
  getUserByUsername,
  getUsers,
  handleConnectionRequest,
  removeAvatar,
  toggleConnection,
  togglePrivate,
  uploadAvatar,
} from "../controllers/userController";
import validateData from "../middlewares/validateData";
import {
  editProfileSchema,
  followRequestActionSchema,
  toggleConnectionSchema,
} from "../lib/schemas/userSchema";
import setUploadFolder from "../middlewares/setUploadFolder";
import upload from "../lib/multer";
import cleanupUploads from "../middlewares/cleanupUploads";

const router = express.Router();

router.get("/", getUsers);
router.get("/i/:id", getUserById);
router.get("/u/:username", getUserByUsername);

router.post(
  "/toggle-connection/:userId",
  validateData(toggleConnectionSchema),
  toggleConnection,
);

router.patch("/edit-profile", validateData(editProfileSchema), editProfile);
router.patch(
  "/avatar/upload",
  setUploadFolder("avatar"),
  upload.single("avatar"),
  uploadAvatar,
  cleanupUploads,
);
router.patch("/account/toggle-private", togglePrivate);
router.patch(
  "/request/:userId/:action",
  validateData(followRequestActionSchema),
  handleConnectionRequest,
);

router.delete("/avatar/remove", removeAvatar);

export default router;
