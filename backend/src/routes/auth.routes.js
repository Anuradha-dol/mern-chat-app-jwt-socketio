import express from "express";
import multer from "multer";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public auth endpoints.
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected profile endpoints.
router.put("/update-profile", protectRoute, upload.single("profilepic"), updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
