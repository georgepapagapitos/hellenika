import React from "react";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import WordList from "./components/WordList";
import WordForm from "./components/WordForm";
import Flashcards from "./components/Flashcards";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  const handleWordAdded = (word: any) => {
    // You can add navigation or state updates here if needed
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<WordList />} />
            <Route
              path="/add"
              element={<WordForm onWordAdded={handleWordAdded} />}
            />
            <Route path="/flashcards" element={<Flashcards />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
