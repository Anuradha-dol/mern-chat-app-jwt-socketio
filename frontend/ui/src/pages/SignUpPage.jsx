import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
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

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      setSuccess(`Welcome, ${res.data.fullname}. Redirecting to login...`);
      setFormData({ fullname: "", email: "", password: "" });
      setTimeout(() => navigate("/login"), 1200);
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
        bgcolor: "#0f1117",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            border: "1px solid #2a3140",
            bgcolor: "#171c26",
          }}
        >
          <Grid container>
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                p: { xs: 3, md: 5 },
                borderBottom: { xs: "1px solid #2a3140", md: "none" },
                borderRight: { md: "1px solid #2a3140" },
                bgcolor: "#1d2330",
              }}
            >
              <Typography variant="h4" sx={{ mb: 1, color: "#e7ecf8", fontWeight: 700 }}>
                ChatSphere
              </Typography>
              <Typography sx={{ color: "#a4aec4", mb: 3 }}>
                Create your account and start real-time chat with a clean Discord and WhatsApp inspired layout.
              </Typography>
              <Box sx={{ display: "grid", gap: 1.5 }}>
                <Typography sx={{ color: "#c5cdde", fontSize: 14 }}>
                  • Live online users
                </Typography>
                <Typography sx={{ color: "#c5cdde", fontSize: 14 }}>
                  • Instant message updates
                </Typography>
                <Typography sx={{ color: "#c5cdde", fontSize: 14 }}>
                  • Image messages, edit and delete support
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ p: { xs: 3, md: 5 }, bgcolor: "#171c26" }}>
              <Typography variant="h5" sx={{ color: "#e7ecf8", fontWeight: 700, mb: 0.5 }}>
                Create Account
              </Typography>
              <Typography sx={{ color: "#9ba5bc", mb: 2.5 }}>Sign up to continue.</Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <Box component="form" noValidate onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#0f1420" } }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#0f1420" } }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#0f1420" } }}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2.5, py: 1.1 }}>
                  Sign Up
                </Button>
              </Box>

              <Typography sx={{ mt: 2, color: "#9ba5bc", fontSize: 14 }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#7f8cff" }}>
                  Log in
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUpPage;
