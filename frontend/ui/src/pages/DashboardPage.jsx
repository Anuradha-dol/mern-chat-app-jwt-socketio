import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
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
import ChatIcon from "@mui/icons-material/Chat";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import LogoutIcon from "@mui/icons-material/Logout";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  checkAuthRequest,
  logoutRequest,
} from "../api/auth.api";
import {
  deleteMessageRequest,
  getMessagesRequest,
  getUsersForSidebarRequest,
  sendMessageRequest,
  updateMessageRequest,
} from "../api/message.api";
import { CHAT_EMOJIS } from "../constants/emojis";
import { SOCKET_URL } from "../constants/config";

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
      // Messages are appended via socket event.
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
      // Message text refreshes from socket event.
      setEditingMessage(null);
      setEditText("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await deleteMessageRequest(messageId);
      // Message state refreshes from socket event.
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
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#0b141a" }}>
      <Box
        sx={{
          width: 330,
          borderRight: "1px solid #202c33",
          bgcolor: "#111b21",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #202c33",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar src={user.profilepic} sx={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
              {user.fullname?.[0]}
            </Avatar>
            <Typography variant="subtitle1" sx={{ color: "#e9edef" }}>
              {user.fullname}
            </Typography>
          </Box>
          <IconButton color="inherit" size="small" onClick={handleLogout}>
            <LogoutIcon sx={{ color: "#8696a0" }} />
          </IconButton>
        </Box>

        <List sx={{ overflowY: "auto", flex: 1 }}>
          {allUsers.map((chatUser) => {
            const isOnline = onlineUsers.includes(chatUser._id);

            return (
              <React.Fragment key={chatUser._id}>
                <ListItemButton onClick={() => setSelectedChat(chatUser)}>
                  <Avatar src={chatUser.profilepic}>{chatUser.fullname?.[0]}</Avatar>
                  <ListItemText
                    primary={chatUser.fullname}
                    secondary={isOnline ? "Online" : "Offline"}
                    sx={{ ml: 2 }}
                    primaryTypographyProps={{ sx: { color: "#e9edef" } }}
                    secondaryTypographyProps={{ sx: { color: isOnline ? "#25d366" : "#8696a0" } }}
                  />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#0b141a" }}>
        {selectedChat ? (
          <>
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid #202c33",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "#202c33",
              }}
            >
              <Avatar src={selectedChat.profilepic}>{selectedChat.fullname?.[0]}</Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ color: "#e9edef" }}>
                  {selectedChat.fullname}
                </Typography>
                <Typography variant="caption" sx={{ color: "#8696a0" }}>
                  {onlineUsers.includes(selectedChat._id) ? "Online" : "Offline"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: 3,
                overflowY: "auto",
                backgroundImage:
                  "linear-gradient(135deg, rgba(11,20,26,0.95), rgba(0,92,75,0.9)), url('https://images.pexels.com/photos/7130491/pexels-photo-7130491.jpeg?auto=compress&cs=tinysrgb&w=1600')",
                backgroundSize: "cover",
                backgroundBlendMode: "overlay",
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
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        bgcolor: isSender ? "#005c4b" : "#202c33",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                        color: "#e9edef",
                      }}
                    >
                      {msg.isDeleted ? (
                        <Typography sx={{ fontStyle: "italic", color: "#8696a0" }}>
                          This message was deleted
                        </Typography>
                      ) : (
                        <>
                          {msg.text && <Typography sx={{ mb: msg.image ? 1 : 0 }}>{msg.text}</Typography>}
                          {msg.image && (
                            <Box sx={{ mt: 0.5 }}>
                              <img
                                src={msg.image}
                                alt="attachment"
                                style={{ maxWidth: "100%", borderRadius: 8 }}
                              />
                            </Box>
                          )}
                        </>
                      )}

                      {!msg.isDeleted && isSender && (
                        <Box sx={{ mt: 0.5 }}>
                          <Typography
                            variant="caption"
                            sx={{ color: "#8696a0", cursor: "pointer", mr: 1.5 }}
                            onClick={() => startEditMessage(msg)}
                          >
                            Edit
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#f15b5b", cursor: "pointer" }}
                            onClick={() => deleteMessage(msg._id)}
                          >
                            Delete
                          </Typography>
                        </Box>
                      )}

                      <Typography
                        variant="caption"
                        sx={{ display: "block", textAlign: "right", color: "#8696a0", mt: 0.5 }}
                      >
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
                  bgcolor: "#202c33",
                  borderTop: "1px solid #202c33",
                  borderBottom: "1px solid #202c33",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="caption" sx={{ color: "#8696a0", mr: 1 }}>
                  Editing message
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  value={editText}
                  onChange={(event) => setEditText(event.target.value)}
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#2a3942", color: "#e9edef" } }}
                />
                <Button size="small" variant="contained" onClick={saveEdit}>
                  Save
                </Button>
                <Button size="small" color="inherit" onClick={cancelEdit}>
                  Cancel
                </Button>
              </Box>
            )}

            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #202c33",
                display: "flex",
                alignItems: "center",
                bgcolor: "#202c33",
                position: "relative",
              }}
            >
              {showEmojiPicker && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "58px",
                    left: "60px",
                    bgcolor: "#202c33",
                    borderRadius: 2,
                    p: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: 260,
                    boxShadow: 3,
                    zIndex: 10,
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
                      <span style={{ fontSize: 20 }}>{emoji}</span>
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
                <IconButton component="span">
                  <PhotoCameraIcon sx={{ color: "#8696a0" }} />
                </IconButton>
              </label>

              <IconButton onClick={() => setShowEmojiPicker((value) => !value)}>
                <EmojiEmotionsIcon sx={{ color: "#8696a0" }} />
              </IconButton>

              <TextField
                fullWidth
                placeholder="Type a message"
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                sx={{ mx: 1, "& .MuiInputBase-root": { bgcolor: "#2a3942", color: "#e9edef" } }}
              />

              <Button variant="contained" endIcon={<ChatIcon />} onClick={sendMessage}>
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#8696a0",
            }}
          >
            <ChatIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              WhatsApp-style Chat
            </Typography>
            <Typography variant="body2">
              Select a user on the left to start messaging in real time.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;
