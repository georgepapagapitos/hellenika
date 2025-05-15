import React, { useEffect, useState, useCallback } from "react";
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
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  alpha,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Word, WordType, Gender } from "../types";
import WordForm from "./WordForm";
import { wordService } from "../services/api";

const WordList = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    wordId: number | null;
  }>({
    open: false,
    wordId: null,
  });
  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean;
    word: Word | null;
  }>({
    open: false,
    word: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [wordTypeFilter, setWordTypeFilter] = useState<WordType | "">("");
  const [genderFilter, setGenderFilter] = useState<Gender | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;

  const fetchWords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await wordService.getAll({
        search: searchTerm,
        wordType: wordTypeFilter,
        gender: genderFilter,
        page,
        size: pageSize,
      });
      setWords(response.items);
      setTotalPages(response.pages);
      setTotalItems(response.total);
    } catch (err) {
      setError("Failed to fetch words");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, wordTypeFilter, genderFilter, page]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchWords();
    }, 300); // Debounce search for 300ms

    return () => clearTimeout(debounceTimer);
  }, [fetchWords]);

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
      wordId,
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.wordId !== null) {
      try {
        await wordService.delete(deleteDialog.wordId);
        setWords(
          words.filter(
            (word) => word.id !== undefined && word.id !== deleteDialog.wordId
          )
        );
        setDeleteDialog({ open: false, wordId: null });
      } catch (error) {
        console.error("Error deleting word:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, wordId: null });
  };

  const handleViewDetails = (word: Word) => {
    setDetailsDialog({ open: true, word });
  };

  const handleCloseDetails = () => {
    setDetailsDialog({ open: false, word: null });
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

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button onClick={() => fetchWords()} variant="contained">
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: "1200px", margin: "0 auto" }}>
      {/* <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "primary.main",
          letterSpacing: "-0.5px",
        }}
      >
        Greek Words
      </Typography> */}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search words..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "background.paper",
            },
          }}
        />
        <FormControl sx={{ minWidth: { xs: "100%", sm: 120 } }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={wordTypeFilter}
            label="Type"
            onChange={(e) => setWordTypeFilter(e.target.value as WordType | "")}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All</MenuItem>
            {Object.values(WordType).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: { xs: "100%", sm: 120 } }}>
          <InputLabel>Gender</InputLabel>
          <Select
            value={genderFilter}
            label="Gender"
            onChange={(e) => setGenderFilter(e.target.value as Gender | "")}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All</MenuItem>
            {Object.values(Gender).map((gender) => (
              <MenuItem key={gender} value={gender}>
                {gender}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {editingWord ? (
        <WordForm
          editWord={editingWord}
          onWordUpdated={handleWordUpdated}
          onWordAdded={handleWordAdded}
          onCancel={() => setEditingWord(null)}
        />
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "calc(100vh - 250px)",
              borderRadius: 2,
              boxShadow: (theme) =>
                `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : words.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No words found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filters
                </Typography>
              </Box>
            ) : (
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell width="20%">Greek Word</TableCell>
                    <TableCell width="30%">Primary Meaning</TableCell>
                    <TableCell width="15%">Type</TableCell>
                    <TableCell width="15%">Gender</TableCell>
                    <TableCell width="20%" align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {words.map((word) => (
                    <TableRow
                      key={word.id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      <TableCell>{word.greek_word}</TableCell>
                      <TableCell>
                        {word.meanings.find((m) => m.is_primary)
                          ?.english_meaning ||
                          word.meanings[0]?.english_meaning}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={word.word_type}
                          color={getWordTypeColor(word.word_type) as any}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {word.word_type === WordType.NOUN && word.gender && (
                          <Chip
                            label={word.gender}
                            color={getGenderColor(word.gender) as any}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              "& .MuiChip-label": { px: 1 },
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 0.5,
                          }}
                        >
                          <IconButton
                            color="primary"
                            onClick={() => handleViewDetails(word)}
                            size="small"
                            sx={{
                              "&:hover": {
                                backgroundColor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() => setEditingWord(word)}
                            size="small"
                            disabled={word.id === undefined}
                            sx={{
                              "&:hover": {
                                backgroundColor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() =>
                              word.id !== undefined &&
                              handleDeleteClick(word.id)
                            }
                            size="small"
                            disabled={word.id === undefined}
                            sx={{
                              "&:hover": {
                                backgroundColor: (theme) =>
                                  alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>

          {!loading && words.length > 0 && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 1, sm: 0 },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {words.length} of {totalItems} words
              </Typography>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="small"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Word</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this word? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={detailsDialog.open}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: (theme) =>
              `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
          },
        }}
      >
        {detailsDialog.word && (
          <>
            <DialogTitle
              sx={{
                m: 0,
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "primary.main",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {detailsDialog.word.greek_word}
                </Typography>
                <Chip
                  label={detailsDialog.word.word_type}
                  color={getWordTypeColor(detailsDialog.word.word_type) as any}
                  size="small"
                  sx={{
                    fontWeight: 500,
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
                {detailsDialog.word.word_type === WordType.NOUN &&
                  detailsDialog.word.gender && (
                    <Chip
                      label={detailsDialog.word.gender}
                      color={getGenderColor(detailsDialog.word.gender) as any}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  )}
              </Box>
              <IconButton
                aria-label="close"
                onClick={handleCloseDetails}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                  "&:hover": {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.grey[500], 0.1),
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: "primary.main",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Meanings
                </Typography>
                <List dense sx={{ mb: 3 }}>
                  {detailsDialog.word.meanings.map((meaning) => (
                    <ListItem
                      key={meaning.id}
                      sx={{
                        backgroundColor: meaning.is_primary
                          ? (theme) => alpha(theme.palette.primary.main, 0.08)
                          : (theme) => alpha(theme.palette.grey[200], 0.5),
                        borderRadius: 1,
                        mb: 0.5,
                        border: "1px solid",
                        borderColor: meaning.is_primary
                          ? (theme) => alpha(theme.palette.primary.main, 0.2)
                          : (theme) => alpha(theme.palette.grey[400], 0.2),
                        "&:hover": {
                          backgroundColor: meaning.is_primary
                            ? (theme) => alpha(theme.palette.primary.main, 0.12)
                            : (theme) => alpha(theme.palette.grey[200], 0.7),
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontWeight: meaning.is_primary ? 500 : 400,
                              fontSize: "1rem",
                              color: meaning.is_primary
                                ? "primary.main"
                                : "text.primary",
                            }}
                          >
                            {meaning.english_meaning}
                          </Typography>
                        }
                        secondary={
                          meaning.is_primary && (
                            <Chip
                              label="Primary"
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{
                                mt: 0.5,
                                "& .MuiChip-label": { px: 1 },
                                borderColor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.5),
                              }}
                            />
                          )
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                {detailsDialog.word.notes && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: "primary.main",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      Notes
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.6,
                        color: "text.secondary",
                      }}
                    >
                      {detailsDialog.word.notes}
                    </Typography>
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button
                onClick={handleCloseDetails}
                sx={{
                  fontWeight: 500,
                  textTransform: "none",
                  px: 2,
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default WordList;
