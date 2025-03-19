import express from "express";
import {
  createUserAccount,
  loginUser,
  getUserProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", createUserAccount);
router.post("/login", loginUser);
router.get("/profile", isAuthenticated, getUserProfile);

export default router;
