import { NavigateBefore, NavigateNext, Shuffle } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { wordService } from "../services/wordService";
import { Word, WordType } from "../types";
import { getGenderColor, getBorderColor } from "../utils/chipColors";

const Flashcards = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const shuffleWords = (wordArray: Word[]) => {
    const shuffled = [...wordArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchWords = useCallback(async () => {
    try {
      const response = await wordService.getWords();
      setWords(shuffleWords(response.items));
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  }, []);

  const handleShuffle = () => {
    setWords(shuffleWords(words));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleNext = () => {
    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, 800);
    } else {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }
  };

  const handlePrevious = () => {
    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
      }, 800);
    } else {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

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

  const displayWord = currentWord.greek_word;

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            sx={{ fontWeight: 500 }}
          >
            {currentIndex + 1} / {words.length}
          </Typography>
          <IconButton
            onClick={handleShuffle}
            size={isMobile ? "small" : "medium"}
            sx={{
              "&:hover": {
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <Shuffle fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>
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
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Typography
                variant={isMobile ? "body1" : "subtitle1"}
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                {currentWord.word_type}
              </Typography>
              {currentWord.word_type === WordType.NOUN &&
                currentWord.gender && (
                  <Chip
                    label={currentWord.gender.toUpperCase()}
                    size="small"
                    sx={{
                      fontWeight: 400,
                      fontSize: "0.75rem",
                      "& .MuiChip-label": {
                        px: 1,
                        fontWeight: 400,
                      },
                      backgroundColor: getGenderColor(currentWord.gender).bg,
                      color: getGenderColor(currentWord.gender).text,
                      border: "1px solid",
                      borderColor: getBorderColor(
                        getGenderColor(currentWord.gender).text,
                      ),
                    }}
                  />
                )}
            </Box>
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
