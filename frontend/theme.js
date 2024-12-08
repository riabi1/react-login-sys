// theme.js
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    // Custom theme colors
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    // Add other customizations if needed
  },
});

export default theme;
