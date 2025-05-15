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
  Menu,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Word, WordType, Gender } from "../types";
import AddWord from "./AddWord";
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
  const [pageSize, setPageSize] = useState(50);
  const [actionMenu, setActionMenu] = useState<{
    anchorEl: null | HTMLElement;
    wordId: number | null;
  }>({
    anchorEl: null,
    wordId: null,
  });

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
  }, [searchTerm, wordTypeFilter, genderFilter, page, pageSize]);

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

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    wordId: number
  ) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      wordId,
    });
  };

  const handleMenuClose = () => {
    setActionMenu({
      anchorEl: null,
      wordId: null,
    });
  };

  const getWordTypeColor = (type: WordType) => {
    const colors: Record<WordType, { bg: string; text: string }> = {
      [WordType.NOUN]: { bg: "#EFF6FF", text: "#3B82F6" }, // Light Blue
      [WordType.VERB]: { bg: "#F5F3FF", text: "#8B5CF6" }, // Light Purple
      [WordType.ADJECTIVE]: { bg: "#ECFDF5", text: "#10B981" }, // Light Green
      [WordType.ADVERB]: { bg: "#ECFEFF", text: "#06B6D4" }, // Light Cyan
      [WordType.PRONOUN]: { bg: "#FFFBEB", text: "#F59E0B" }, // Light Amber
      [WordType.PREPOSITION]: { bg: "#FEF2F2", text: "#EF4444" }, // Light Red
      [WordType.CONJUNCTION]: { bg: "#F3F4F6", text: "#6B7280" }, // Light Gray
      [WordType.ARTICLE]: { bg: "#F9FAFB", text: "#9CA3AF" }, // Lighter Gray
    };
    return colors[type];
  };

  const getGenderColor = (gender: Gender) => {
    const colors: Record<Gender, { bg: string; text: string }> = {
      [Gender.MASCULINE]: { bg: "#EFF6FF", text: "#2563EB" }, // Light Blue
      [Gender.FEMININE]: { bg: "#FDF2F8", text: "#EC4899" }, // Light Pink
      [Gender.NEUTER]: { bg: "#F0FDFA", text: "#14B8A6" }, // Light Teal
    };
    return colors[gender];
  };

  const getBorderColor = (color: string) => (theme: any) => alpha(color, 0.2);

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
                {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
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
                {gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {editingWord ? (
        <AddWord
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
                    <TableCell width="20%">Greek</TableCell>
                    <TableCell width="30%">English</TableCell>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {word.meanings.find((m) => m.is_primary)?.english_meaning ||
                            word.meanings[0]?.english_meaning}
                          {word.meanings.length > 1 && (
                            <Tooltip 
                              title={`${word.meanings.length - 1} more meaning${word.meanings.length > 2 ? 's' : ''}`}
                              arrow
                              placement="top"
                            >
                              <Box
                                component="span"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(word);
                                }}
                                sx={{
                                  ml: 0.5,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  color: 'primary.main',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  opacity: 0.8,
                                  '&:hover': {
                                    opacity: 1,
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                +{word.meanings.length - 1}
                              </Box>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={word.word_type.toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 400,
                            fontSize: "0.75rem",
                            "& .MuiChip-label": {
                              px: 1,
                              fontWeight: 400,
                            },
                            backgroundColor: getWordTypeColor(word.word_type)
                              .bg,
                            color: getWordTypeColor(word.word_type).text,
                            border: "1px solid",
                            borderColor: getBorderColor(
                              getWordTypeColor(word.word_type).text
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {word.word_type === WordType.NOUN && word.gender && (
                          <Chip
                            label={word.gender.toUpperCase()}
                            size="small"
                            sx={{
                              fontWeight: 400,
                              fontSize: "0.75rem",
                              "& .MuiChip-label": {
                                px: 1,
                                fontWeight: 400,
                              },
                              backgroundColor: getGenderColor(word.gender).bg,
                              color: getGenderColor(word.gender).text,
                              border: "1px solid",
                              borderColor: getBorderColor(
                                getGenderColor(word.gender).text
                              ),
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              word.id !== undefined &&
                              handleMenuOpen(e, word.id)
                            }
                            sx={{
                              "&:hover": {
                                backgroundColor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>

          <Menu
            anchorEl={actionMenu.anchorEl}
            open={Boolean(actionMenu.anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 1,
                boxShadow: (theme) =>
                  `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                const word = words.find((w) => w.id === actionMenu.wordId);
                if (word) {
                  handleViewDetails(word);
                }
                handleMenuClose();
              }}
              sx={{ py: 1 }}
            >
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
              View Details
            </MenuItem>
            <MenuItem
              onClick={() => {
                const word = words.find((w) => w.id === actionMenu.wordId);
                if (word) {
                  setEditingWord(word);
                }
                handleMenuClose();
              }}
              sx={{ py: 1 }}
            >
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (actionMenu.wordId !== null) {
                  handleDeleteClick(actionMenu.wordId);
                }
                handleMenuClose();
              }}
              sx={{ py: 1, color: "error.main" }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>

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
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {words.length} of {totalItems} words
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1); // Reset to first page when changing page size
                    }}
                    sx={{ height: 32 }}
                  >
                    <MenuItem value={25}>25 per page</MenuItem>
                    <MenuItem value={50}>50 per page</MenuItem>
                    <MenuItem value={75}>75 per page</MenuItem>
                    <MenuItem value={100}>100 per page</MenuItem>
                  </Select>
                </FormControl>
              </Box>
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
                  label={detailsDialog.word.word_type.toUpperCase()}
                  size="small"
                  sx={{
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    "& .MuiChip-label": {
                      px: 1,
                      fontWeight: 400,
                    },
                    backgroundColor: getWordTypeColor(
                      detailsDialog.word.word_type
                    ).bg,
                    color: getWordTypeColor(detailsDialog.word.word_type).text,
                    border: "1px solid",
                    borderColor: getBorderColor(
                      getWordTypeColor(detailsDialog.word.word_type).text
                    ),
                  }}
                />
                {detailsDialog.word.word_type === WordType.NOUN &&
                  detailsDialog.word.gender && (
                    <Chip
                      label={detailsDialog.word.gender.toUpperCase()}
                      size="small"
                      sx={{
                        fontWeight: 400,
                        fontSize: "0.75rem",
                        "& .MuiChip-label": {
                          px: 1,
                          fontWeight: 400,
                        },
                        backgroundColor: getGenderColor(
                          detailsDialog.word.gender
                        ).bg,
                        color: getGenderColor(detailsDialog.word.gender).text,
                        border: "1px solid",
                        borderColor: getBorderColor(
                          getGenderColor(detailsDialog.word.gender).text
                        ),
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
