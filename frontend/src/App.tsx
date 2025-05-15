import React from "react";
import { ThemeProvider, CssBaseline, Box, Container } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Menu as MenuIcon, School as SchoolIcon } from "@mui/icons-material";
import theme from "./theme";
import WordList from "./components/WordList";
import Flashcards from "./components/Flashcards";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
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
              <Button component={Link} to="/" color="primary" sx={{ mx: 1 }}>
                Word List
              </Button>
              <Button
                component={Link}
                to="/flashcards"
                color="primary"
                sx={{ mx: 1 }}
              >
                Flashcards
              </Button>
            </Toolbar>
          </AppBar>

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
                <Route path="/" element={<WordList />} />
                <Route path="/flashcards" element={<Flashcards />} />
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
    </ThemeProvider>
  );
};

export default App;
