import express from "express";
import {
  createUserAccount,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import upload from "../utils/multer.js";
const router = express.Router();

router.post("/signup", createUserAccount);
router.post("/login", loginUser);
router.get("/profile", isAuthenticated, getUserProfile);
router.patch(
  "/update",
  isAuthenticated,
  upload.single("avatar"),
  updateUserProfile
);

export default router;
