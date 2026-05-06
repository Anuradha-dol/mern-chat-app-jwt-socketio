import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { signupRequest } from "../api/auth.api";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, email, password } = formData;

    if (!fullname || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await signupRequest({ fullname, email, password });

      setSuccess(`Welcome, ${res.data.fullname}! Redirecting to your chats...`);
      setFormData({ fullname: "", email: "", password: "" });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(135deg, #fff7f2, #ffe0e9, #e0f0ff)",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            overflow: "hidden",
            borderRadius: 3,
          }}
        >
          <Grid container>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                backgroundImage:
                  "url('https://images.pexels.com/photos/7130491/pexels-photo-7130491.jpeg?auto=compress&cs=tinysrgb&w=1200')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(255, 192, 203, 0.45)", // soft rose overlay
                }}
              />
              <Box sx={{ position: "relative", p: 4, color: "#fff7f2" }}>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ letterSpacing: 0.5 }}>
                  Welcome to ChatSphere
                </Typography>
                <Typography variant="body1">
                  Create your account and start chatting in real time with a clean,
                  WhatsApp-style experience.
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: 4,
                  bgcolor: "#fff7f2",
                }}
              >
                <Typography variant="h5" fontWeight={600} mb={1} sx={{ color: "#333" }}>
                  Create an account
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Sign up with your details to join the conversation.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 1.5,
                      py: 1.2,
                      backgroundImage:
                        "linear-gradient(135deg, #ff9aa2, #a2c5ff)",
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Already have an account?{" "}
                  <Link to="/login">Log in</Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUpPage;
