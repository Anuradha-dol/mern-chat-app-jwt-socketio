import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../api/auth.api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    try {
      await loginRequest({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
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
                  bgcolor: "rgba(162, 197, 255, 0.45)", // soft blue overlay
                }}
              />
              <Box sx={{ position: "relative", p: 4, color: "#fff7f2" }}>
                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ letterSpacing: 0.5 }}>
                  Welcome back
                </Typography>
                <Typography variant="body1">
                  Log in to continue your conversations and see who is online in real time.
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
                  Sign in to ChatSphere
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Enter your email and password to access your chats.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
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
                    Login
                  </Button>
                </Box>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Don&apos;t have an account?{" "}
                  <Link to="/signup">Create one</Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
