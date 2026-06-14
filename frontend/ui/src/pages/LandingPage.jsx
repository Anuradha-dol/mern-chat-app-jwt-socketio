import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { Link as RouterLink } from "react-router-dom";

const highlights = [
  {
    icon: <BoltRoundedIcon />,
    title: "Instant replies",
    text: "New messages appear as the conversation happens, without refreshing the page.",
    accent: "#1f8a5b",
    tint: "#e6f3eb",
  },
  {
    icon: <GroupsRoundedIcon />,
    title: "See who is online",
    text: "Know when someone is available before you start a conversation.",
    accent: "#4666d6",
    tint: "#e8edff",
  },
  {
    icon: <ImageRoundedIcon />,
    title: "Share moments",
    text: "Send photos and messages in the same simple chat flow.",
    accent: "#b67818",
    tint: "#fff1d8",
  },
  {
    icon: <LockRoundedIcon />,
    title: "Private by default",
    text: "Your chat space stays behind account login, away from public access.",
    accent: "#7a4fb0",
    tint: "#f1e8fb",
  },
];

const pageContainerSx = {
  width: { xs: "calc(100vw - 32px)", sm: "calc(100vw - 48px)", lg: 1152 },
  maxWidth: "1152px !important",
  px: "0 !important",
  mx: "auto",
};

const LandingPage = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f2e9", color: "#162018", overflowX: "hidden" }}>
      <Box
        component="section"
        sx={{
          minHeight: { xs: "86vh", md: "88vh" },
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          backgroundImage:
            "linear-gradient(90deg, rgba(8, 18, 14, 0.82) 0%, rgba(8, 18, 14, 0.62) 42%, rgba(8, 18, 14, 0.16) 78%), linear-gradient(0deg, rgba(246, 242, 233, 0.34) 0%, rgba(246, 242, 233, 0) 30%), url('/assets/chatsphere-hero-4k.jpg')",
          backgroundSize: "cover",
          backgroundPosition: { xs: "center center", md: "center center" },
        }}
      >
        <Container
          maxWidth={false}
          sx={{ ...pageContainerSx, position: "relative", zIndex: 1, pt: { xs: 2, md: 3 } }}
        >
          <Box
            component="nav"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.1} sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 1,
                  display: "grid",
                  placeItems: "center",
                  color: "#102015",
                  bgcolor: "#f4d27a",
                  boxShadow: "0 10px 28px rgba(0, 0, 0, 0.18)",
                }}
              >
                <ChatBubbleOutlineRoundedIcon fontSize="small" />
              </Box>
              <Typography
                sx={{
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: { xs: 19, sm: 20 },
                  letterSpacing: 0,
                  whiteSpace: "nowrap",
                }}
              >
                ChatSphere
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flex: "0 0 auto" }}>
              <Button
                component={RouterLink}
                to="/login"
                startIcon={<LoginRoundedIcon />}
                sx={{
                  color: "#ffffff",
                  minWidth: "auto",
                  px: { xs: 0.8, sm: 2 },
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.12)" },
                }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  bgcolor: "#f4d27a",
                  color: "#182115",
                  px: { xs: 1.5, sm: 2.4 },
                  "&:hover": { bgcolor: "#e8c262" },
                }}
              >
                Sign up
              </Button>
            </Stack>
          </Box>
        </Container>

        <Container
          maxWidth={false}
          sx={{
            ...pageContainerSx,
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            alignItems: "center",
            pb: { xs: 4, md: 7 },
          }}
        >
          <Box sx={{ maxWidth: 680, pt: { xs: 6, md: 2 } }}>
            <Typography
              sx={{
                color: "#f4d27a",
                fontWeight: 800,
                fontSize: { xs: 13, md: 14 },
                textTransform: "uppercase",
                letterSpacing: 0,
                mb: 1.5,
              }}
            >
              Simple real-time chat
            </Typography>
            <Typography
              component="h1"
              sx={{
                color: "#ffffff",
                fontWeight: 900,
                fontSize: { xs: 46, sm: 62, md: 78 },
                lineHeight: 0.94,
                letterSpacing: 0,
                textShadow: "0 18px 42px rgba(0, 0, 0, 0.35)",
                mb: 2.4,
              }}
            >
              ChatSphere
            </Typography>
            <Typography
              sx={{
                color: "#eef5ef",
                maxWidth: 590,
                fontSize: { xs: 17, md: 20 },
                lineHeight: 1.7,
                letterSpacing: 0,
                textShadow: "0 10px 28px rgba(0, 0, 0, 0.28)",
                mb: 3,
              }}
            >
              A calm place for quick conversations, live presence, image sharing, and simple profile control.
              Stay connected with people who matter, without extra noise.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.3} sx={{ mb: 4 }}>
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  alignSelf: { xs: "stretch", sm: "flex-start" },
                  bgcolor: "#f4d27a",
                  color: "#182115",
                  px: 3,
                  py: 1.2,
                  "&:hover": { bgcolor: "#e8c262" },
                }}
              >
                Create account
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{
                  alignSelf: { xs: "stretch", sm: "flex-start" },
                  borderColor: "rgba(255, 255, 255, 0.62)",
                  color: "#ffffff",
                  px: 3,
                  py: 1.2,
                  "&:hover": {
                    borderColor: "#ffffff",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Open chat
              </Button>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.4, sm: 3 }}
              sx={{ color: "#ffffff" }}
            >
              {["Private sign in", "Live conversations", "Easy photo sharing"].map((item) => (
                <Stack key={item} direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#f4d27a",
                      flex: "0 0 auto",
                    }}
                  />
                  <Typography sx={{ fontSize: 14.5, letterSpacing: 0, color: "#f7fbf6" }}>
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 4, md: 5.5 }, bgcolor: "#f6f2e9" }}>
        <Container maxWidth={false} sx={pageContainerSx}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: 30, md: 38 },
                  lineHeight: 1.08,
                  fontWeight: 850,
                  letterSpacing: 0,
                  color: "#182115",
                  mb: 1.5,
                }}
              >
                Built for conversations that keep moving.
              </Typography>
              <Typography sx={{ color: "#4f5f53", lineHeight: 1.7, letterSpacing: 0 }}>
                The landing page gives the project a finished first impression while keeping the chat flow
                direct and easy to enter.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                {highlights.map((item) => (
                  <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        height: "100%",
                        p: 2.4,
                        borderRadius: 1,
                        bgcolor: "#fffdf7",
                        border: "1px solid #e7dfcf",
                        boxShadow: "0 12px 28px rgba(43, 39, 30, 0.08)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 1,
                          display: "grid",
                          placeItems: "center",
                          color: item.accent,
                          bgcolor: item.tint,
                          mb: 1.6,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        sx={{
                          color: "#182115",
                          fontWeight: 800,
                          fontSize: 18,
                          letterSpacing: 0,
                          mb: 0.8,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: "#5a675d", lineHeight: 1.65, letterSpacing: 0 }}>
                        {item.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
