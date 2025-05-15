import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TranslateIcon from "@mui/icons-material/Translate";
import axios from "axios";
import {
  WordType,
  WordFormData,
  MeaningFormData,
  Gender,
  Word,
} from "../types";
import { API_ENDPOINTS } from "../config";
import {
  translateToGreek,
  translateToEnglish,
} from "../services/translationService";

interface WordFormProps {
  onWordAdded: (word: Word) => void;
  onWordUpdated?: (word: Word) => void;
  editWord?: Word | null;
  onCancel?: () => void;
}

const WordForm: React.FC<WordFormProps> = ({
  onWordAdded,
  onWordUpdated,
  editWord,
  onCancel,
}) => {
  const [formData, setFormData] = useState<WordFormData>({
    greek_word: "",
    word_type: WordType.NOUN,
    gender: undefined,
    notes: "",
    meanings: [{ english_meaning: "", is_primary: true }],
  });

  const [isTranslating, setIsTranslating] = useState({
    toEnglish: false,
    toGreek: false,
  });

  useEffect(() => {
    if (editWord) {
      setFormData({
        greek_word: editWord.greek_word,
        word_type: editWord.word_type,
        gender: editWord.gender,
        notes: editWord.notes || "",
        meanings: editWord.meanings.map((m) => ({
          english_meaning: m.english_meaning,
          is_primary: m.is_primary,
        })),
      });
    }
  }, [editWord]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWordTypeChange = (e: SelectChangeEvent<string>) => {
    const newType = e.target.value as string;
    setFormData((prev) => ({
      ...prev,
      word_type: newType as WordType,
      // Clear gender if not a noun
      gender: newType === WordType.NOUN ? prev.gender : undefined,
    }));
  };

  const handleGenderChange = (e: SelectChangeEvent<string>) => {
    const newGender = e.target.value as string;
    setFormData((prev) => ({
      ...prev,
      gender: newGender as Gender,
    }));
  };

  const handleMeaningChange = (
    index: number,
    field: keyof MeaningFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      const newMeanings = [...prev.meanings];
      newMeanings[index] = {
        ...newMeanings[index],
        [field]: value,
      };
      return {
        ...prev,
        meanings: newMeanings,
      };
    });
  };

  const addMeaning = () => {
    setFormData((prev) => ({
      ...prev,
      meanings: [...prev.meanings, { english_meaning: "", is_primary: false }],
    }));
  };

  const removeMeaning = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      meanings: prev.meanings.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert string values to proper enum values
      const submitData: WordFormData = {
        greek_word: formData.greek_word,
        word_type: formData.word_type as WordType,
        gender:
          formData.word_type === WordType.NOUN
            ? (formData.gender as Gender)
            : undefined,
        notes: formData.notes,
        meanings: formData.meanings,
      };

      if (editWord) {
        const response = await axios.put(
          `${API_ENDPOINTS.words}/${editWord.id}`,
          submitData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        onWordUpdated?.(response.data);
      } else {
        const response = await axios.post(
          `${API_ENDPOINTS.words}/`,
          submitData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        onWordAdded(response.data);
      }

      if (!editWord) {
        setFormData({
          greek_word: "",
          word_type: WordType.NOUN,
          gender: undefined,
          notes: "",
          meanings: [{ english_meaning: "", is_primary: true }],
        });
      }
    } catch (error: any) {
      console.error("Error saving word:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    }
  };

  const handleTranslateToGreek = async (englishText: string, index: number) => {
    if (!englishText.trim()) return;

    setIsTranslating((prev) => ({ ...prev, toGreek: true }));
    try {
      const greekText = await translateToGreek(englishText);
      if (greekText) {
        setFormData((prev) => ({
          ...prev,
          greek_word: greekText,
        }));
      }
    } catch (error) {
      console.error("Error translating to Greek:", error);
    } finally {
      setIsTranslating((prev) => ({ ...prev, toGreek: false }));
    }
  };

  const handleTranslateToEnglish = async (greekText: string) => {
    if (!greekText.trim()) return;

    setIsTranslating((prev) => ({ ...prev, toEnglish: true }));
    try {
      const englishText = await translateToEnglish(greekText);
      if (englishText) {
        setFormData((prev) => ({
          ...prev,
          meanings: [
            { english_meaning: englishText, is_primary: true },
            ...prev.meanings.slice(1).map((m) => ({ ...m, is_primary: false })),
          ],
        }));
      }
    } catch (error) {
      console.error("Error translating to English:", error);
    } finally {
      setIsTranslating((prev) => ({ ...prev, toEnglish: false }));
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: 500,
          color: "text.primary",
        }}
      >
        {editWord ? "Edit Word" : "Add New Word"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            mb: 4,
            "& .MuiTextField-root": {
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              },
            },
          }}
        >
          <TextField
            fullWidth
            label="Greek Word"
            name="greek_word"
            value={formData.greek_word}
            onChange={handleInputChange}
            required
            InputProps={{
              sx: { height: "56px" },
            }}
          />
          <Button
            onClick={() => handleTranslateToEnglish(formData.greek_word)}
            disabled={isTranslating.toEnglish || !formData.greek_word}
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<TranslateIcon />}
            sx={{
              minWidth: "180px",
              whiteSpace: "nowrap",
              height: "56px",
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            {isTranslating.toEnglish ? "Translating..." : "Greek → English"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Word Type</InputLabel>
            <Select
              value={formData.word_type}
              label="Word Type"
              onChange={handleWordTypeChange}
              sx={{
                borderRadius: 1.5,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              }}
            >
              {Object.values(WordType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.word_type === WordType.NOUN && (
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender || ""}
                label="Gender"
                onChange={handleGenderChange}
                required
                sx={{
                  borderRadius: 1.5,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                }}
              >
                {Object.values(Gender).map((value) => (
                  <MenuItem key={value} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          multiline
          rows={2}
          sx={{
            mb: 4,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
          }}
        />

        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          Meanings
        </Typography>
        {formData.meanings.map((meaning, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              alignItems: "center",
              "& .MuiTextField-root": {
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.5,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
              },
            }}
          >
            <TextField
              fullWidth
              label="English Meaning"
              value={meaning.english_meaning}
              onChange={(e) =>
                handleMeaningChange(index, "english_meaning", e.target.value)
              }
              required
              InputProps={{
                sx: { height: "56px" },
              }}
            />
            {meaning.is_primary && (
              <Button
                onClick={() =>
                  handleTranslateToGreek(meaning.english_meaning, index)
                }
                disabled={isTranslating.toGreek || !meaning.english_meaning}
                variant="contained"
                color="primary"
                size="medium"
                startIcon={<TranslateIcon />}
                sx={{
                  minWidth: "180px",
                  whiteSpace: "nowrap",
                  height: "56px",
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontWeight: 500,
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                {isTranslating.toGreek ? "Translating..." : "English → Greek"}
              </Button>
            )}
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Primary</InputLabel>
              <Select
                value={meaning.is_primary ? "true" : "false"}
                label="Primary"
                onChange={(e) =>
                  handleMeaningChange(
                    index,
                    "is_primary",
                    e.target.value === "true"
                  )
                }
                sx={{
                  borderRadius: 1.5,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
            {index > 0 && (
              <IconButton
                onClick={() => removeMeaning(index)}
                color="error"
                sx={{
                  height: "56px",
                  width: "56px",
                  borderRadius: 1.5,
                  "&:hover": {
                    backgroundColor: "error.lighter",
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}

        <Button
          variant="outlined"
          onClick={addMeaning}
          sx={{
            mb: 4,
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "primary.lighter",
            },
          }}
        >
          Add Another Meaning
        </Button>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            {editWord ? "Update Word" : "Add Word"}
          </Button>
          {editWord && onCancel && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={onCancel}
              fullWidth
              size="large"
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "secondary.lighter",
                },
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default WordForm;
