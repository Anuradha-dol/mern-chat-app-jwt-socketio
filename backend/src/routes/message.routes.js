import express from "express";
import {
  deleteMessage,
  getMessages,
  getUserForSidebar,
  sendMessage,
  updateMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Sidebar users list.
router.get("/users", protectRoute, getUserForSidebar);

// Full conversation with one user.
router.get("/:id", protectRoute, getMessages);

// Create message.
router.post("/send/:id", protectRoute, sendMessage);

// Edit own message.
router.put("/update/:messageId", protectRoute, updateMessage);

// Soft delete own message.
router.delete("/delete/:messageId", protectRoute, deleteMessage);

export default router;
