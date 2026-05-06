import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  checkAuthRequest,
  logoutRequest,
  updateProfileRequest,
} from "../api/auth.api";

const ProfilePage = ({ handleThemeChange }) => {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await checkAuthRequest();
        setUser(res.data);
        setNameInput(res.data.fullname || "");
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutRequest();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!nameInput.trim() && !selectedFile) {
      alert("Nothing to update");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("profilepic", selectedFile);
      }
      if (nameInput.trim()) {
        formData.append("fullname", nameInput.trim());
      }

      const res = await updateProfileRequest(formData);

      setUser(res.data);
      setSelectedFile(null);
      setPreview("");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (!user) return <CircularProgress sx={{ display: "block", mt: 10, mx: "auto" }} />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(135deg, #fff7f2, #ffe0e9, #e0f0ff)",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Grid container>
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                backgroundImage: "linear-gradient(180deg, #ffe0e9, #e0f0ff)",
                color: "#2c2c2c",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
              }}
            >
              <Avatar
                src={preview || user.profilepic || "https://via.placeholder.com/120"}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                {user.fullname?.[0]}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {user.fullname}
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                {user.email}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={600} mb={1}>
                  Profile settings
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Update your display name, avatar and theme.
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Display Name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    fullWidth
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Button component="label" variant="outlined">
                    Choose Profile Picture
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                  {selectedFile && (
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {selectedFile.name}
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  sx={{ mt: 1, mb: 3 }}
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>

                <Typography variant="subtitle2" gutterBottom>
                  Theme
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Button variant="contained" onClick={() => handleThemeChange("light")}>
                    Light
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleThemeChange("dark")}>
                    Dark
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#4caf50" }}
                    onClick={() => handleThemeChange("green")}
                  >
                    Green
                  </Button>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;
