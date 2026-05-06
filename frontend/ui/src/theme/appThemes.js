import { createTheme } from "@mui/material/styles";

const sharedShape = { borderRadius: 8 };
const sharedComponents = {
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: "none",
        fontWeight: 600,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: "small",
    },
  },
};

export const appThemes = {
  light: createTheme({
    shape: sharedShape,
    components: sharedComponents,
    palette: {
      mode: "light",
      primary: { main: "#5b6cf8" },
      secondary: { main: "#22a06b" },
      background: { default: "#f4f6fb", paper: "#ffffff" },
    },
  }),
  dark: createTheme({
    shape: sharedShape,
    components: sharedComponents,
    palette: {
      mode: "dark",
      primary: { main: "#5b6cf8" },
      secondary: { main: "#20b26b" },
      background: { default: "#151922", paper: "#1d2330" },
      text: { primary: "#e8ebf3", secondary: "#a7afc0" },
    },
  }),
  green: createTheme({
    shape: sharedShape,
    components: sharedComponents,
    palette: {
      mode: "light",
      primary: { main: "#2e8f57" },
      secondary: { main: "#5b6cf8" },
      background: { default: "#f3f7f4", paper: "#ffffff" },
    },
  }),
};

export const getThemeByName = (themeName) => appThemes[themeName] || appThemes.light;
