import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Switch,
  FormControlLabel,
  SelectChangeEvent,
  alpha,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Translate as TranslateIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { WordType, Gender, WordFormData, MeaningFormData, Word } from "../types";
import { wordService } from "../services/api";
import {
  translateToGreek,
  translateToEnglish,
} from "../services/translationService";

interface AddWordProps {
  editWord?: Word | null;
  onWordUpdated?: (word: Word) => void;
  onWordAdded?: (word: Word) => void;
  onCancel?: () => void;
}

const AddWord: React.FC<AddWordProps> = ({
  editWord,
  onWordUpdated,
  onWordAdded,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<WordFormData>({
    greek_word: "",
    word_type: WordType.NOUN,
    gender: Gender.MASCULINE,
    notes: "",
    meanings: [{ english_meaning: "", is_primary: true }],
  });
  const [loading, setLoading] = useState({
    translateToGreek: false,
    translateToEnglish: false,
  });

  useEffect(() => {
    if (editWord) {
      setFormData({
        greek_word: editWord.greek_word,
        word_type: editWord.word_type,
        gender: editWord.gender || Gender.MASCULINE,
        notes: editWord.notes || "",
        meanings: editWord.meanings.map((m) => ({
          english_meaning: m.english_meaning,
          is_primary: m.is_primary,
        })),
      });
    }
  }, [editWord]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMeaningChange = (
    index: number,
    field: keyof MeaningFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      const newMeanings = [...prev.meanings];
      if (field === "is_primary" && value === true) {
        // Set all meanings to non-primary first
        newMeanings.forEach((meaning) => {
          meaning.is_primary = false;
        });
      }
      // Then set the selected meaning's value
      newMeanings[index] = {
        ...newMeanings[index],
        [field]: value,
      };
      return { ...prev, meanings: newMeanings };
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
      if (editWord && editWord.id !== undefined) {
        const updatedWord = await wordService.update(editWord.id as number, formData);
        onWordUpdated?.(updatedWord);
      } else {
        const newWord = await wordService.create(formData);
        onWordAdded?.(newWord);
        setFormData({
          greek_word: "",
          word_type: WordType.NOUN,
          gender: Gender.MASCULINE,
          notes: "",
          meanings: [{ english_meaning: "", is_primary: true }],
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error saving word:", error);
    }
  };

  const handleTranslateToGreek = async (englishText: string, index: number) => {
    if (!englishText.trim()) return;

    setLoading((prev) => ({ ...prev, translateToGreek: true }));
    try {
      console.log("Translating to Greek, input:", englishText);
      const greekText = await translateToGreek(englishText);
      console.log("Received Greek translation:", greekText);
      if (greekText) {
        setFormData((prev) => {
          console.log("Updating form data with Greek translation:", greekText);
          return {
            ...prev,
            greek_word: greekText,
          };
        });
      }
    } catch (error) {
      console.error("Error translating to Greek:", error);
    } finally {
      setLoading((prev) => ({ ...prev, translateToGreek: false }));
    }
  };

  const handleTranslateToEnglish = async (greekText: string) => {
    if (!greekText.trim()) return;

    setLoading((prev) => ({ ...prev, translateToEnglish: true }));
    try {
      console.log("Translating to English, input:", greekText);
      const englishText = await translateToEnglish(greekText);
      console.log("Received English translation:", englishText);
      if (englishText) {
        setFormData((prev) => {
          console.log("Current form data:", prev);
          // Keep existing meanings but make them non-primary
          const existingMeanings = prev.meanings.map(meaning => ({
            ...meaning,
            is_primary: false
          }));
          
          const newMeanings = [
            { english_meaning: englishText, is_primary: true },
            ...existingMeanings
          ];
          console.log("New meanings array:", newMeanings);
          
          return {
            ...prev,
            meanings: newMeanings,
          };
        });
      }
    } catch (error) {
      console.error("Error translating to English:", error);
    } finally {
      setLoading((prev) => ({ ...prev, translateToEnglish: false }));
    }
  };

  return (
    <Box 
      sx={{ 
        maxWidth: 800, 
        mx: "auto", 
        mt: { xs: 1, sm: 3 }, 
        px: { xs: 2, sm: 0 },
        pb: { xs: 3, sm: 4 }
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 3,
            fontWeight: 600,
            color: "primary.main",
            letterSpacing: "-0.02em",
            fontSize: { xs: "1.75rem", sm: "2rem" },
          }}
        >
          {editWord ? "Edit Word" : "Add New Word"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Box 
                sx={{ 
                  display: "flex", 
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5, 
                  alignItems: { xs: "stretch", sm: "flex-start" } 
                }}
              >
                <TextField
                  fullWidth
                  label="Greek Word"
                  name="greek_word"
                  value={formData.greek_word}
                  onChange={handleChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      height: "48px",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      "&.Mui-focused": {
                        color: "primary.main",
                      },
                    },
                  }}
                />
                <Button
                  onClick={() => handleTranslateToEnglish(formData.greek_word)}
                  disabled={loading.translateToEnglish || !formData.greek_word}
                  variant="contained"
                  color="primary"
                  startIcon={<TranslateIcon />}
                  sx={{
                    minWidth: { xs: "100%", sm: "180px" },
                    height: "48px",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {loading.translateToEnglish ? "Translating..." : "Greek → English"}
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Word Type</InputLabel>
                <Select
                  name="word_type"
                  value={formData.word_type}
                  onChange={handleSelectChange}
                  label="Word Type"
                  sx={{
                    borderRadius: 2,
                    height: "48px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "divider",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 2,
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
            </Grid>

            {(formData.word_type === WordType.NOUN || formData.word_type === WordType.ARTICLE) && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleSelectChange}
                    label="Gender"
                    sx={{
                      borderRadius: 2,
                      height: "48px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "divider",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderWidth: 2,
                      },
                    }}
                  >
                    {Object.values(Gender).map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid size={12}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  mt: 1,
                  mb: 2,
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                Meanings
              </Typography>
              <List sx={{ mb: 1 }}>
                {formData.meanings.map((meaning, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      mb: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: alpha("#f8fafc", 0.5),
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: alpha("#f8fafc", 0.8),
                        borderColor: "primary.main",
                        transform: "translateY(-1px)",
                        boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                      },
                      position: "relative",
                    }}
                  >
                    {formData.meanings.length > 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          borderTopLeftRadius: 24,
                          borderBottomRightRadius: 24,
                          backgroundColor: alpha("#ef4444", 0.1),
                          p: 0.5,
                          "&:hover": {
                            backgroundColor: alpha("#ef4444", 0.2),
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <IconButton
                          onClick={() => removeMeaning(index)}
                          color="error"
                          size="small"
                          sx={{
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                    <ListItemText
                      primary={
                        <Box 
                          sx={{ 
                            display: "flex", 
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 1.5, 
                            alignItems: { xs: "stretch", sm: "flex-start" } 
                          }}
                        >
                          <TextField
                            fullWidth
                            label="English Meaning"
                            value={meaning.english_meaning}
                            onChange={(e) =>
                              handleMeaningChange(
                                index,
                                "english_meaning",
                                e.target.value
                              )
                            }
                            required
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                height: "48px",
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "primary.main",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderWidth: 2,
                                },
                              },
                              "& .MuiInputLabel-root": {
                                "&.Mui-focused": {
                                  color: "primary.main",
                                },
                              },
                            }}
                          />
                          {meaning.is_primary && (
                            <Button
                              onClick={() => handleTranslateToGreek(meaning.english_meaning, index)}
                              disabled={loading.translateToGreek || !meaning.english_meaning}
                              variant="contained"
                              color="primary"
                              startIcon={<TranslateIcon />}
                              sx={{
                                minWidth: { xs: "100%", sm: "180px" },
                                height: "48px",
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 500,
                                boxShadow: 2,
                                "&:hover": {
                                  boxShadow: 4,
                                  transform: "translateY(-1px)",
                                },
                                transition: "all 0.2s ease-in-out",
                              }}
                            >
                              {loading.translateToGreek ? "Translating..." : "English → Greek"}
                            </Button>
                          )}
                        </Box>
                      }
                      secondary={
                        <FormControlLabel
                          control={
                            <Switch
                              checked={meaning.is_primary}
                              onChange={(e) =>
                                handleMeaningChange(
                                  index,
                                  "is_primary",
                                  e.target.checked
                                )
                              }
                              color="primary"
                            />
                          }
                          label="Primary Meaning"
                          sx={{ 
                            mt: 0.5,
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.875rem",
                              color: "text.secondary",
                            },
                          }}
                        />
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                startIcon={<AddIcon />}
                onClick={addMeaning}
                variant="outlined"
                color="primary"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  height: "40px",
                  "&:hover": {
                    backgroundColor: alpha("#2563eb", 0.04),
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Add Meaning
              </Button>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: "primary.main",
                    },
                  },
                }}
              />
            </Grid>

            <Grid size={12}>
              <Box sx={{ display: "flex", gap: 2 }}>
                {editWord && onCancel && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onCancel}
                    fullWidth
                    size="large"
                    sx={{
                      mt: 1,
                      height: "48px",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                      borderColor: "divider",
                      color: "text.secondary",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        borderColor: "text.secondary",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{
                    mt: 1,
                    height: "48px",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {editWord ? "Update Word" : "Add Word"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddWord;