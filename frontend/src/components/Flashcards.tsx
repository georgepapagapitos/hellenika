import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { NavigateNext, NavigateBefore } from "@mui/icons-material";
import { Word, WordType } from "../types";
import { wordService } from "../services/api";
import RefreshIcon from "@mui/icons-material/Refresh";

const Flashcards = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: "center" }}>
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
    <Box
      sx={{
        p: { xs: 1, sm: 2 },
        maxWidth: "600px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 1, sm: 2 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <IconButton
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          size={isMobile ? "small" : "medium"}
        >
          <NavigateBefore />
        </IconButton>
        <Typography
          variant={isMobile ? "body1" : "h6"}
          sx={{ fontWeight: 500 }}
        >
          {currentIndex + 1} / {words.length}
        </Typography>
        <IconButton
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          size={isMobile ? "small" : "medium"}
        >
          <NavigateNext />
        </IconButton>
      </Box>

      <Card
        onClick={handleFlip}
        sx={{
          cursor: "pointer",
          height: { xs: "250px", sm: "300px", md: "350px" },
          position: "relative",
          perspective: "1500px",
          borderRadius: { xs: 2, sm: 3 },
          backgroundColor: "transparent",
          boxShadow: "none",
          p: 1,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            transformStyle: "preserve-3d",
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
              position: "absolute",
              width: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              p: { xs: 2, sm: 3 },
              borderRadius: "inherit",
              backgroundColor: "background.paper",
              boxShadow: (theme) =>
                `0 2px 8px ${
                  theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.2)"
                    : "rgba(0,0,0,0.08)"
                }`,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              gutterBottom
              sx={{
                textAlign: "center",
                wordBreak: "break-word",
                maxWidth: "100%",
              }}
            >
              {displayWord}
            </Typography>
            <Typography
              variant={isMobile ? "body1" : "subtitle1"}
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
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
              position: "absolute",
              width: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              p: { xs: 2, sm: 3 },
              borderRadius: "inherit",
              backgroundColor: "background.paper",
              boxShadow: (theme) =>
                `0 2px 8px ${
                  theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.2)"
                    : "rgba(0,0,0,0.08)"
                }`,
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
              sx={{
                textAlign: "center",
                wordBreak: "break-word",
                maxWidth: "100%",
              }}
            >
              {currentWord.meanings.find((m) => m.is_primary)
                ?.english_meaning || currentWord.meanings[0]?.english_meaning}
            </Typography>
            {currentWord.notes && (
              <Typography
                variant={isMobile ? "body2" : "body1"}
                color="text.secondary"
                sx={{
                  mt: { xs: 1, sm: 2 },
                  textAlign: "center",
                  maxWidth: "100%",
                  wordBreak: "break-word",
                }}
              >
                {currentWord.notes}
              </Typography>
            )}
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default Flashcards;
