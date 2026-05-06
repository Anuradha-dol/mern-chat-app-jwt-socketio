import cloudinary from "../config/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../index.js";

const emitToChatParticipants = (senderId, receiverId, eventName, payload) => {
  io.to(senderId).emit(eventName, payload);
  io.to(receiverId).emit(eventName, payload);
};

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id.toString();
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id.toString();

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id.toString();

    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({ senderId, receiverId, text, image: imageUrl });
    await newMessage.save();

    // Send live message updates to both chat participants.
    emitToChatParticipants(senderId, receiverId, "newMessage", newMessage);

    return res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;
    const userId = req.user._id.toString();
    const trimmedText = text?.trim();

    if (!trimmedText) {
      return res.status(400).json({ error: "Text is required" });
    }

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ error: "Not allowed to edit this message" });
    }

    if (message.isDeleted) {
      return res.status(400).json({ error: "Cannot edit a deleted message" });
    }

    message.text = trimmedText;
    await message.save();

    const receiverId = message.receiverId.toString();
    emitToChatParticipants(userId, receiverId, "messageUpdated", message);

    return res.status(200).json(message);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id.toString();

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ error: "Not allowed to delete this message" });
    }

    message.isDeleted = true;
    message.text = "";
    message.image = "";
    await message.save();

    const receiverId = message.receiverId.toString();
    emitToChatParticipants(userId, receiverId, "messageDeleted", { _id: message._id });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
