import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Hellenika
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Word List
          </Button>
          <Button color="inherit" component={RouterLink} to="/add">
            Add Word
          </Button>
          <Button color="inherit" component={RouterLink} to="/flashcards">
            Flashcards
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
