import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { NavigateNext, NavigateBefore } from "@mui/icons-material";
import { Word, WordType } from "../types";
import { wordService } from "../services/api";
import RefreshIcon from "@mui/icons-material/Refresh";

const Flashcards = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const fetchWords = async () => {
    try {
      const response = await wordService.getAll();
      setWords(response.items);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No words available
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchWords}
          sx={{ mt: 2 }}
          variant="outlined"
        >
          Refresh
        </Button>
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
    <Box sx={{ p: 2, maxWidth: "600px", margin: "0 auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <IconButton onClick={handlePrevious} disabled={currentIndex === 0}>
          <NavigateBefore />
        </IconButton>
        <Typography variant="h6">
          {currentIndex + 1} / {words.length}
        </Typography>
        <IconButton
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
        >
          <NavigateNext />
        </IconButton>
      </Box>

      <Card
        onClick={handleFlip}
        sx={{
          cursor: "pointer",
          height: "300px",
          perspective: "1000px",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backfaceVisibility: "hidden",
            position: "absolute",
            width: "100%",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <Typography variant="h4" gutterBottom>
            {displayWord}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {currentWord.word_type}
          </Typography>
        </CardContent>

        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backfaceVisibility: "hidden",
            position: "absolute",
            width: "100%",
            transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {currentWord.meanings.find((m) => m.is_primary)?.english_meaning ||
              currentWord.meanings[0]?.english_meaning}
          </Typography>
          {currentWord.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {currentWord.notes}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Flashcards;
