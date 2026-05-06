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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

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

  if (!user) {
    return <CircularProgress sx={{ display: "block", mt: 10, mx: "auto" }} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f1117", py: 4 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #2a3140",
            overflow: "hidden",
            bgcolor: "#171c26",
          }}
        >
          <Grid container>
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                p: 3,
                borderBottom: { xs: "1px solid #2a3140", md: "none" },
                borderRight: { md: "1px solid #2a3140" },
                bgcolor: "#1d2330",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <Avatar
                  src={preview || user.profilepic || ""}
                  sx={{ width: 112, height: 112, border: "3px solid #2f3747" }}
                >
                  {user.fullname?.[0]}
                </Avatar>
                <Typography sx={{ color: "#e7ecf8", fontWeight: 700, mt: 0.5 }}>
                  {user.fullname}
                </Typography>
                <Typography sx={{ color: "#98a2b8", fontSize: 14, textAlign: "center", wordBreak: "break-all" }}>
                  {user.email}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }} sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ color: "#e7ecf8", fontWeight: 700 }}>
                Profile Settings
              </Typography>
              <Typography sx={{ color: "#98a2b8", mt: 0.5, mb: 3 }}>
                Update your display details and app theme.
              </Typography>

              <TextField
                label="Display Name"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                fullWidth
                sx={{ mb: 2.25, "& .MuiOutlinedInput-root": { bgcolor: "#0f1420" } }}
              />

              <Box sx={{ mb: 2.25 }}>
                <Button component="label" variant="outlined">
                  Upload Profile Picture
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </Button>
                {selectedFile && (
                  <Typography sx={{ ml: 1.5, color: "#9aa4b8", fontSize: 13, display: "inline-block" }}>
                    {selectedFile.name}
                  </Typography>
                )}
              </Box>

              <Button variant="contained" onClick={handleSaveProfile} disabled={loading} sx={{ mb: 3 }}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>

              <Typography sx={{ color: "#c7cfde", mb: 1, fontWeight: 600 }}>Theme</Typography>
              <Stack direction="row" spacing={1.25} sx={{ mb: 3, flexWrap: "wrap" }}>
                <Button variant="contained" onClick={() => handleThemeChange("light")}>
                  Light
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleThemeChange("dark")}>
                  Dark
                </Button>
                <Button variant="contained" sx={{ bgcolor: "#2e8f57" }} onClick={() => handleThemeChange("green")}>
                  Green
                </Button>
              </Stack>

              <Stack direction="row" spacing={1.25}>
                <Button variant="outlined" onClick={() => navigate("/dashboard")}>
                  Back to Chat
                </Button>
                <Button variant="contained" color="error" onClick={handleLogout}>
                  Logout
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;
