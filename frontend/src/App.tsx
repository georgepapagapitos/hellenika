import React from "react";
import { ThemeProvider, CssBaseline, Box, Container } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import theme from "./theme";
import WordList from "./components/WordList";
import Flashcards from "./components/Flashcards";
import WordForm from "./components/WordForm";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./components/AdminDashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const Navigation = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="primary"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <SchoolIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "primary.main",
            fontWeight: 600,
            letterSpacing: "-0.5px",
          }}
        >
          Hellenika
        </Typography>
        {isAuthenticated ? (
          <>
            <Button component={Link} to="/" color="primary" sx={{ mx: 1 }}>
              Word List
            </Button>
            <Button component={Link} to="/add" color="primary" sx={{ mx: 1 }}>
              Add Word
            </Button>
            <Button
              component={Link}
              to="/flashcards"
              color="primary"
              sx={{ mx: 1 }}
            >
              Flashcards
            </Button>
            {user?.role === 'admin' && (
              <Button
                component={Link}
                to="/admin"
                color="primary"
                sx={{ mx: 1 }}
              >
                Admin Dashboard
              </Button>
            )}
            <Button onClick={handleLogout} color="primary" sx={{ mx: 1 }}>
              Logout
            </Button>
          </>
        ) : (
          <Button component={Link} to="/auth" color="primary" sx={{ mx: 1 }}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box
            sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
          >
            <Navigation />

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: { xs: 2, sm: 3 },
                backgroundColor: "background.default",
              }}
            >
              <Container maxWidth="lg">
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <WordList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/add"
                    element={
                      <ProtectedRoute>
                        <WordForm onWordAdded={() => {}} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/flashcards"
                    element={
                      <ProtectedRoute>
                        <Flashcards />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </Container>
            </Box>

            <Box
              component="footer"
              sx={{
                py: 3,
                px: 2,
                mt: "auto",
                backgroundColor: "background.paper",
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                  © {new Date().getFullYear()} Hellenika. All rights reserved.
                </Typography>
              </Container>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
