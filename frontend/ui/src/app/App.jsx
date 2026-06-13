import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getThemeByName } from "../theme/appThemes";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import SignUpPage from "../pages/SignUpPage";

const App = () => {
  const [themeName, setThemeName] = useState("dark");
  const theme = getThemeByName(themeName);

  const handleThemeChange = (themeName) => {
    setThemeName(themeName);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage handleThemeChange={handleThemeChange} />} />
          <Route path="/" element={<Navigate to="/signup" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
