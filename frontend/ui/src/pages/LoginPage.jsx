import { useState } from "react";
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
import { loginRequest } from "../api/auth.api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
                Welcome Back
              </Typography>
              <Typography sx={{ color: "#a4aec4", mb: 3 }}>
                Continue your conversations with a modern, fast, and organized chat workspace.
              </Typography>
              <Box sx={{ display: "grid", gap: 1.5 }}>
                <Typography sx={{ color: "#c5cdde", fontSize: 14 }}>
                  - Sidebar user presence
                </Typography>
                <Typography sx={{ color: "#c5cdde", fontSize: 14 }}>
                  - Smooth real-time updates
                </Typography>
                <Typography sx={{ color: "#c5cdde", fontSize: 14 }}>
                  - Message history with edit/delete
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ p: { xs: 3, md: 5 }, bgcolor: "#171c26" }}>
              <Typography variant="h5" sx={{ color: "#e7ecf8", fontWeight: 700, mb: 0.5 }}>
                Login
              </Typography>
              <Typography sx={{ color: "#9ba5bc", mb: 2.5 }}>Sign in to open your chats.</Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box component="form" noValidate onSubmit={handleSubmit}>
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
                  Login
                </Button>
              </Box>

              <Typography sx={{ mt: 2, color: "#9ba5bc", fontSize: 14 }}>
                Don&apos;t have an account?{" "}
                <Link to="/signup" style={{ color: "#7f8cff" }}>
                  Create one
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
