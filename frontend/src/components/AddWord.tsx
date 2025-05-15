import React, { useState } from "react";
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
  ListItemSecondaryAction,
  IconButton,
  Switch,
  FormControlLabel,
  SelectChangeEvent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { WordType, Gender, WordFormData, MeaningFormData } from "../types";
import { wordService } from "../services/api";
import {
  translateToGreek,
  translateToEnglish,
} from "../services/translationService";

const AddWord = () => {
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
      await wordService.create(formData);
      setFormData({
        greek_word: "",
        word_type: WordType.NOUN,
        gender: Gender.MASCULINE,
        notes: "",
        meanings: [{ english_meaning: "", is_primary: true }],
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  const handleTranslateToGreek = async (englishText: string, index: number) => {
    // Only translate if there's text to translate
    if (!englishText.trim()) return;

    setLoading((prev) => ({ ...prev, translateToGreek: true }));
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
      setLoading((prev) => ({ ...prev, translateToGreek: false }));
    }
  };

  const handleTranslateToEnglish = async (greekText: string) => {
    // Only translate if there's text to translate
    if (!greekText.trim()) return;

    setLoading((prev) => ({ ...prev, translateToEnglish: true }));
    try {
      const englishText = await translateToEnglish(greekText);
      if (englishText) {
        // Add as a new meaning if we have a meaningful translation
        setFormData((prev) => ({
          ...prev,
          meanings: [
            ...prev.meanings.map((m) => ({ ...m, is_primary: false })),
            { english_meaning: englishText, is_primary: true },
          ],
        }));
      }
    } catch (error) {
      console.error("Error translating to English:", error);
    } finally {
      setLoading((prev) => ({ ...prev, translateToEnglish: false }));
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add New Word
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <TextField
                  fullWidth
                  label="Greek Word"
                  name="greek_word"
                  value={formData.greek_word}
                  onChange={handleChange}
                  required
                />
                <Button
                  onClick={() => handleTranslateToEnglish(formData.greek_word)}
                  disabled={loading.translateToEnglish || !formData.greek_word}
                  variant="outlined"
                  size="medium"
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
                >
                  {Object.values(WordType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleSelectChange}
                  label="Gender"
                >
                  {Object.values(Gender).map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Meanings
              </Typography>
              <List>
                {formData.meanings.map((meaning, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
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
                          />
                          <Button
                            onClick={() => handleTranslateToGreek(meaning.english_meaning, index)}
                            disabled={loading.translateToGreek || !meaning.english_meaning}
                            variant="outlined"
                            size="medium"
                          >
                            {loading.translateToGreek ? "Translating..." : "English → Greek"}
                          </Button>
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
                            />
                          }
                          label="Primary Meaning"
                        />
                      }
                    />
                    <ListItemSecondaryAction>
                      {formData.meanings.length > 1 && (
                        <IconButton
                          edge="end"
                          onClick={() => removeMeaning(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Button
                startIcon={<AddIcon />}
                onClick={addMeaning}
                sx={{ mb: 2 }}
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
                rows={4}
              />
            </Grid>
            <Grid size={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Add Word
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddWord;