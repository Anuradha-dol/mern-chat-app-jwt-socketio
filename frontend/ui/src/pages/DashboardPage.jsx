import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import ChatIcon from "@mui/icons-material/Chat";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import LogoutIcon from "@mui/icons-material/Logout";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { checkAuthRequest, logoutRequest } from "../api/auth.api";
import {
  deleteMessageRequest,
  getMessagesRequest,
  getUsersForSidebarRequest,
  sendMessageRequest,
  updateMessageRequest,
} from "../api/message.api";
import { SOCKET_URL } from "../constants/config";
import { CHAT_EMOJIS } from "../constants/emojis";

const socket = io(SOCKET_URL, { autoConnect: false });
const MAX_CHAT_IMAGE_BYTES = 2 * 1024 * 1024;

const fileToBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result || "");
    reader.readAsDataURL(file);
  });

const formatMessageTime = (createdAt) => {
  if (!createdAt) {
    return "";
  }

  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DashboardPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");

  const messagesEndRef = useRef(null);
  const selectedChatRef = useRef(null);
  const userRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isMessageForSelectedChat = (msg, currentUser, currentChat) => {
    if (!currentUser || !currentChat) {
      return false;
    }

    return (
      (msg.senderId === currentUser._id && msg.receiverId === currentChat._id) ||
      (msg.senderId === currentChat._id && msg.receiverId === currentUser._id)
    );
  };

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await checkAuthRequest();
        setUser(res.data);
        socket.io.opts.query = { userId: res.data._id };
        socket.connect();
      } catch {
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    socket.on("getOnlineUsers", setOnlineUsers);
    return () => socket.off("getOnlineUsers");
  }, []);

  useEffect(() => {
    const handleNewMessage = (msg) => {
      const currentUser = userRef.current;
      const currentChat = selectedChatRef.current;

      if (!isMessageForSelectedChat(msg, currentUser, currentChat)) {
        return;
      }

      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    };

    const handleMessageUpdated = (updated) => {
      setMessages((prev) => prev.map((msg) => (msg._id === updated._id ? { ...msg, ...updated } : msg)));
    };

    const handleMessageDeleted = ({ _id }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === _id ? { ...msg, isDeleted: true, text: "", image: "" } : msg))
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageUpdated", handleMessageUpdated);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageUpdated", handleMessageUpdated);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await getUsersForSidebarRequest();
        setAllUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (!selectedChat) {
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await getMessagesRequest(selectedChat._id);
        setMessages(res.data);
        scrollToBottom();
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > MAX_CHAT_IMAGE_BYTES) {
      alert("Image is too large. Please choose an image under 2MB.");
      return;
    }

    setImageFile(file);
  };

  const sendMessage = async () => {
    if (!selectedChat) {
      return;
    }

    const text = newMessage.trim();
    if (!text && !imageFile) {
      return;
    }

    let base64Image = "";
    if (imageFile) {
      base64Image = await fileToBase64(imageFile);
    }

    try {
      await sendMessageRequest(selectedChat._id, { text: newMessage, image: base64Image });
      setNewMessage("");
      setImageFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  const startEditMessage = (msg) => {
    if (msg.isDeleted) {
      return;
    }

    setEditingMessage(msg);
    setEditText(msg.text || "");
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
  };

  const saveEdit = async () => {
    if (!editingMessage) {
      return;
    }

    const trimmedText = editText.trim();
    if (!trimmedText) {
      return;
    }

    try {
      await updateMessageRequest(editingMessage._id, { text: trimmedText });
      setEditingMessage(null);
      setEditText("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await deleteMessageRequest(messageId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 10 }} />;
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", bgcolor: "#141922", color: "#e6ebf6" }}>
      <Box
        sx={{
          width: 72,
          borderRight: "1px solid #2a3241",
          bgcolor: "#121723",
          p: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar sx={{ bgcolor: "#5b6cf8", width: 40, height: 40, fontWeight: 700 }}>
          {user.fullname?.[0]}
        </Avatar>
        <IconButton sx={{ bgcolor: "#1d2331", color: "#aeb8cf" }}>
          <ChatIcon fontSize="small" />
        </IconButton>
        <IconButton sx={{ bgcolor: "#1d2331", color: "#aeb8cf" }}>
          <AlternateEmailRoundedIcon fontSize="small" />
        </IconButton>
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={handleLogout} sx={{ bgcolor: "#281f28", color: "#ff8ba0" }}>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          width: { xs: 290, sm: 310, md: 320 },
          borderRight: "1px solid #2a3241",
          bgcolor: "#171d29",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #2a3241", display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={user.profilepic}
            sx={{ width: 38, height: 38, cursor: "pointer" }}
            onClick={() => navigate("/profile")}
          >
            {user.fullname?.[0]}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, color: "#e5eaf5", lineHeight: 1.1 }} noWrap>
              {user.fullname}
            </Typography>
            <Typography sx={{ color: "#97a3bb", fontSize: 12 }} noWrap>
              Click avatar for profile settings
            </Typography>
          </Box>
        </Box>

        <List sx={{ flex: 1, overflowY: "auto", py: 0.5 }}>
          {allUsers.map((chatUser) => {
            const isOnline = onlineUsers.includes(chatUser._id);
            const isSelected = selectedChat?._id === chatUser._id;

            return (
              <React.Fragment key={chatUser._id}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => setSelectedChat(chatUser)}
                  sx={{
                    mx: 0.75,
                    borderRadius: 1,
                    mb: 0.3,
                    "&.Mui-selected": { bgcolor: "#252d3f" },
                    "&.Mui-selected:hover": { bgcolor: "#2a3346" },
                  }}
                >
                  <Badge
                    overlap="circular"
                    variant="dot"
                    color={isOnline ? "success" : "default"}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    sx={{
                      "& .MuiBadge-badge": {
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        border: "2px solid #171d29",
                        bgcolor: isOnline ? "#2cb87a" : "#626f8b",
                      },
                    }}
                  >
                    <Avatar src={chatUser.profilepic}>{chatUser.fullname?.[0]}</Avatar>
                  </Badge>
                  <ListItemText
                    primary={chatUser.fullname}
                    secondary={isOnline ? "Online" : "Offline"}
                    sx={{ ml: 1.5 }}
                    primaryTypographyProps={{ sx: { color: "#e6ebf6", fontSize: 14, fontWeight: 600 } }}
                    secondaryTypographyProps={{ sx: { color: isOnline ? "#2cb87a" : "#8b96ae", fontSize: 12 } }}
                  />
                </ListItemButton>
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#1a2030" }}>
        {selectedChat ? (
          <>
            <Box
              sx={{
                p: 1.8,
                borderBottom: "1px solid #2a3241",
                display: "flex",
                alignItems: "center",
                gap: 1.4,
                bgcolor: "#20283a",
              }}
            >
              <Badge
                overlap="circular"
                variant="dot"
                color={onlineUsers.includes(selectedChat._id) ? "success" : "default"}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                sx={{
                  "& .MuiBadge-badge": {
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    border: "2px solid #20283a",
                    bgcolor: onlineUsers.includes(selectedChat._id) ? "#2cb87a" : "#626f8b",
                  },
                }}
              >
                <Avatar src={selectedChat.profilepic}>{selectedChat.fullname?.[0]}</Avatar>
              </Badge>
              <Box>
                <Typography sx={{ color: "#e6ebf6", fontWeight: 700, lineHeight: 1.1 }}>
                  {selectedChat.fullname}
                </Typography>
                <Typography sx={{ color: "#92a0b7", fontSize: 12 }}>
                  {onlineUsers.includes(selectedChat._id) ? "Online now" : "Offline"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: { xs: 1.4, sm: 2.2 },
                overflowY: "auto",
                background:
                  "radial-gradient(circle at top right, rgba(91,108,248,0.12), transparent 45%), radial-gradient(circle at left bottom, rgba(32,178,107,0.12), transparent 40%), #161d2a",
              }}
            >
              {messages.map((msg) => {
                const isSender = msg.senderId === user._id;
                const time = formatMessageTime(msg.createdAt);

                return (
                  <Box
                    key={msg._id}
                    sx={{
                      display: "flex",
                      justifyContent: isSender ? "flex-end" : "flex-start",
                      mb: 1.25,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.2,
                        borderRadius: 1.5,
                        bgcolor: isSender ? "#1f6f54" : "#242d3d",
                        maxWidth: "74%",
                        wordBreak: "break-word",
                        border: isSender ? "1px solid #2d8c6a" : "1px solid #313b51",
                      }}
                    >
                      {msg.isDeleted ? (
                        <Typography sx={{ color: "#9eabc4", fontStyle: "italic", fontSize: 14 }}>
                          This message was deleted
                        </Typography>
                      ) : (
                        <>
                          {msg.text && (
                            <Typography sx={{ color: "#e4ebf8", fontSize: 14.5, mb: msg.image ? 1 : 0 }}>
                              {msg.text}
                            </Typography>
                          )}
                          {msg.image && (
                            <Box sx={{ mt: 0.4 }}>
                              <img
                                src={msg.image}
                                alt="attachment"
                                style={{ maxWidth: "100%", borderRadius: 8, border: "1px solid #3c4760" }}
                              />
                            </Box>
                          )}
                        </>
                      )}

                      {!msg.isDeleted && isSender && (
                        <Box sx={{ mt: 0.6, display: "flex", gap: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{ color: "#9db2ff", cursor: "pointer" }}
                            onClick={() => startEditMessage(msg)}
                          >
                            Edit
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#ff9cab", cursor: "pointer" }}
                            onClick={() => deleteMessage(msg._id)}
                          >
                            Delete
                          </Typography>
                        </Box>
                      )}

                      <Typography sx={{ color: "#a2adc2", fontSize: 11.5, mt: 0.5, textAlign: "right" }}>
                        {time}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
              <div ref={messagesEndRef} />
            </Box>

            {editingMessage && (
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderTop: "1px solid #2a3241",
                  borderBottom: "1px solid #2a3241",
                  bgcolor: "#1e2637",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography sx={{ color: "#9eabc4", fontSize: 12, whiteSpace: "nowrap" }}>
                  Editing message
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  value={editText}
                  onChange={(event) => setEditText(event.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#111722" } }}
                />
                <Button size="small" variant="contained" onClick={saveEdit}>
                  Save
                </Button>
                <Button size="small" variant="text" color="inherit" onClick={cancelEdit} sx={{ color: "#c5cde0" }}>
                  Cancel
                </Button>
              </Box>
            )}

            <Box
              sx={{
                p: 1.25,
                borderTop: "1px solid #2a3241",
                bgcolor: "#20283a",
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                position: "relative",
              }}
            >
              {showEmojiPicker && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 58,
                    left: 60,
                    bgcolor: "#1d2535",
                    border: "1px solid #313b51",
                    borderRadius: 1,
                    p: 0.8,
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: 260,
                    zIndex: 20,
                  }}
                >
                  {CHAT_EMOJIS.map((emoji) => (
                    <Button
                      key={emoji}
                      onClick={() => {
                        setNewMessage((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      sx={{ minWidth: 32, p: 0.5 }}
                    >
                      <span style={{ fontSize: 19 }}>{emoji}</span>
                    </Button>
                  ))}
                </Box>
              )}

              <input
                type="file"
                accept="image/*"
                id="chat-image-input"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              <label htmlFor="chat-image-input">
                <IconButton component="span" sx={{ bgcolor: "#242e42", color: "#9caccc" }}>
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </label>

              <IconButton
                onClick={() => setShowEmojiPicker((value) => !value)}
                sx={{ bgcolor: "#242e42", color: "#9caccc" }}
              >
                <EmojiEmotionsIcon fontSize="small" />
              </IconButton>

              <TextField
                fullWidth
                placeholder="Type a message"
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#111722" } }}
              />

              <Button variant="contained" endIcon={<ChatIcon />} onClick={sendMessage} sx={{ px: 2 }}>
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
              color: "#97a3bb",
            }}
          >
            <ChatIcon sx={{ fontSize: 64, color: "#7a88a6" }} />
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#d5ddee" }}>
              Start a Conversation
            </Typography>
            <Typography sx={{ fontSize: 14 }}>
              Select a contact from the left sidebar to chat.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;
