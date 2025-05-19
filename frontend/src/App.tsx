import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import EditWord from "./components/EditWord";
import Flashcards from "./components/Flashcards";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import WordForm from "./components/WordForm";
import WordList from "./components/WordList";
import { AuthProvider } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import theme from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />

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
                    path="/edit/:id"
                    element={
                      <ProtectedRoute>
                        <EditWord />
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
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
