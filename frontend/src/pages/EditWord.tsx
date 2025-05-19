import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WordForm from "../pages/WordForm";
import { wordService } from "../services/wordService";
import { Word } from "../types";

const EditWord: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          setError("No word ID provided");
          return;
        }
        const wordData = await wordService.getWordById(parseInt(id));
        setWord(wordData);
      } catch (error) {
        console.error("Error fetching word:", error);
        setError("Failed to load word");
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [id]);

  const handleWordUpdated = async (updatedWord: Word) => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          gap: 2,
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        >
          Go back
        </Typography>
      </Box>
    );
  }

  if (!word) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", p: 3 }}>
      <WordForm
        editWord={word}
        onWordUpdated={handleWordUpdated}
        onWordAdded={handleWordUpdated}
        onCancel={() => navigate(-1)}
      />
    </Box>
  );
};

export default EditWord;
