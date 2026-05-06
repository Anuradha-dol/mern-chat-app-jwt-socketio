import { createTheme } from "@mui/material/styles";

export const appThemes = {
  light: createTheme({ palette: { mode: "light" } }),
  dark: createTheme({ palette: { mode: "dark" } }),
  green: createTheme({ palette: { mode: "light", primary: { main: "#4caf50" } } }),
};

export const getThemeByName = (themeName) => appThemes[themeName] || appThemes.light;
