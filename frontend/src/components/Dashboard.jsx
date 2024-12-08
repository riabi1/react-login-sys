import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  CssBaseline,
  Container,
  Box,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Dashboard = () => {
  const navigate = useNavigate();
  const [themeMode, setThemeMode] = useState("light");
  const [userEmail, setUserEmail] = useState(""); // New state for user email

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/validate",
          {
            method: "GET",
            credentials: "include", // Include cookies for secure authentication
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("User authenticated:", data.user); // Optional debug log
          setUserEmail(data.user.email); // Set user email from response
        } else {
          navigate("/"); // Redirect to login if not authenticated
        }
      } catch (error) {
        navigate("/"); // Handle server or network error
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies for logout
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Show logout success message
        navigate("/"); // Redirect to login page
      } else {
        alert("Failed to log out.");
      }
    } catch (err) {
      alert("An error occurred while logging out.");
    }
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to your Dashboard{userEmail ? `, ${userEmail}` : "!"}
          </Typography>
          <Typography variant="body1">
            This is your personal space where you can manage your activities.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
