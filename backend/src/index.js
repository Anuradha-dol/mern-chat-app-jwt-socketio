import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import Message from "./models/message.model.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const defaultClientOrigins = ["http://localhost:5173", "http://localhost:5174"];
const envClientOrigins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const CLIENT_ORIGINS = [...new Set([...defaultClientOrigins, ...envClientOrigins])];

const isAllowedOrigin = (origin) => {
  // Allow non-browser requests (no Origin header).
  if (!origin) {
    return true;
  }

  return CLIENT_ORIGINS.includes(origin);
};

// Allow frontend requests with cookies.
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
// Keep a larger payload size for Base64 image messages.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.get("/", (req, res) => res.send("API is running"));

const server = http.createServer(app);

// Socket server shares the same HTTP server.
export const io = new Server(server, {
  cors: { origin: CLIENT_ORIGINS, credentials: true },
});

// userId -> socketId
export const onlineUsers = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    onlineUsers[userId] = socket.id;
    // Personal room lets the same user receive events across tabs/devices.
    socket.join(userId);
  }

  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    try {
      const newMessage = await Message.create({ senderId, receiverId, text });
      socket.emit("receiveMessage", newMessage);

      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", newMessage);
      }
    } catch (err) {
      console.error("Socket sendMessage error:", err);
    }
  });

  socket.on("disconnect", () => {
    if (userId) {
      delete onlineUsers[userId];
    }
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
  });
});

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  connectDB();
});
