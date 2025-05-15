import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Word, WordType, Gender } from "../types";
import WordForm from "./WordForm";
import { wordService } from "../services/api";

const WordList = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, wordId: number | null}>({
    open: false,
    wordId: null
  });

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

  const handleWordUpdated = (updatedWord: Word) => {
    setWords(
      words.map((word) => (word.id === updatedWord.id ? updatedWord : word))
    );
    setEditingWord(null);
  };

  const handleWordAdded = (newWord: Word) => {
    setWords([...words, newWord]);
  };
  
  const handleDeleteClick = (wordId: number) => {
    setDeleteDialog({
      open: true,
      wordId
    });
  };
  
  const handleDeleteConfirm = async () => {
    if (deleteDialog.wordId !== null) {
      try {
        await wordService.delete(deleteDialog.wordId);
        setWords(words.filter(word => word.id !== undefined && word.id !== deleteDialog.wordId));
        setDeleteDialog({ open: false, wordId: null });
      } catch (error) {
        console.error("Error deleting word:", error);
      }
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, wordId: null });
  };

  const getWordTypeColor = (type: WordType) => {
    const colors: Record<WordType, string> = {
      [WordType.NOUN]: "primary",
      [WordType.VERB]: "secondary",
      [WordType.ADJECTIVE]: "success",
      [WordType.ADVERB]: "info",
      [WordType.PRONOUN]: "warning",
      [WordType.PREPOSITION]: "error",
      [WordType.CONJUNCTION]: "default",
      [WordType.ARTICLE]: "default",
    };
    return colors[type];
  };

  const getGenderColor = (gender: Gender) => {
    const colors: Record<Gender, string> = {
      [Gender.MASCULINE]: "primary",
      [Gender.FEMININE]: "secondary",
      [Gender.NEUTER]: "info",
    };
    return colors[gender];
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Greek Words
      </Typography>
      {editingWord ? (
        <WordForm
          editWord={editingWord}
          onWordUpdated={handleWordUpdated}
          onWordAdded={handleWordAdded}
          onCancel={() => setEditingWord(null)}
        />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Greek Word</TableCell>
                <TableCell>English Meanings</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {words.map((word) => (
                <TableRow key={word.id}>
                  <TableCell>{word.greek_word}</TableCell>
                  <TableCell>
                    <List dense>
                      {word.meanings.map((meaning) => (
                        <ListItem key={meaning.id}>
                          <ListItemText
                            primary={meaning.english_meaning}
                            secondary={
                              meaning.is_primary ? "Primary" : "Secondary"
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={word.word_type}
                      color={getWordTypeColor(word.word_type) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {word.word_type === WordType.NOUN && word.gender && (
                      <Chip
                        label={word.gender}
                        color={getGenderColor(word.gender) as any}
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>{word.notes}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton
                        color="primary"
                        onClick={() => setEditingWord(word)}
                        size="small"
                        disabled={word.id === undefined}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => word.id !== undefined && handleDeleteClick(word.id)}
                        size="small"
                        disabled={word.id === undefined}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Word
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this word? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WordList;
