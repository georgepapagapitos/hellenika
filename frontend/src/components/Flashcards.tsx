import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from "@mui/material";
import { NavigateNext, NavigateBefore } from "@mui/icons-material";
import { Word, WordType, Gender } from "../types";
import { wordService } from "../services/api";

const Flashcards = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  const fetchWords = async () => {
    try {
      const data = await wordService.getAll();
      setWords(data);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleNext = () => {
    setShowMeaning(false);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrevious = () => {
    setShowMeaning(false);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  const toggleMeaning = () => {
    setShowMeaning(!showMeaning);
  };

  // Helper to get the article
  function getGreekArticle(gender?: string): string {
    if (gender === "feminine") return "η/μια";
    if (gender === "masculine") return "ο/ένας";
    if (gender === "neuter") return "το/ένα";
    return "";
  }

  if (words.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5">
          No words available. Add some words first!
        </Typography>
      </Box>
    );
  }

  const currentWord = words[currentIndex];

  // Compute display word
  const displayWord =
    currentWord.word_type === WordType.NOUN && currentWord.gender
      ? `${getGreekArticle(currentWord.gender)} ${currentWord.greek_word}`
      : currentWord.greek_word;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Flashcards
      </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card sx={{ width: "100%", mb: 2 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              {displayWord}
            </Typography>
            {showMeaning && (
              <>
                <List dense>
                  {currentWord.meanings.map((meaning) => (
                    <ListItem key={meaning.id}>
                      <ListItemText
                        primary={meaning.english_meaning}
                        secondary={meaning.is_primary ? "Primary" : "Secondary"}
                      />
                    </ListItem>
                  ))}
                </List>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  sx={{ mt: 1 }}
                >
                  <Chip
                    label={currentWord.word_type}
                    color="primary"
                    size="small"
                  />
                  {currentWord.word_type === WordType.NOUN &&
                    currentWord.gender && (
                      <Chip
                        label={currentWord.gender}
                        color={
                          currentWord.gender === Gender.MASCULINE
                            ? "primary"
                            : currentWord.gender === Gender.FEMININE
                            ? "secondary"
                            : "info"
                        }
                        size="small"
                      />
                    )}
                </Stack>
                {currentWord.notes && (
                  <Typography
                    variant="body2"
                    align="center"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Notes: {currentWord.notes}
                  </Typography>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <IconButton onClick={handlePrevious} size="large">
            <NavigateBefore />
          </IconButton>
          <Button variant="contained" onClick={toggleMeaning}>
            {showMeaning ? "Hide Meaning" : "Show Meaning"}
          </Button>
          <IconButton onClick={handleNext} size="large">
            <NavigateNext />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {currentIndex + 1} of {words.length}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Flashcards;
