import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  School as SchoolIcon,
  Style as StyleIcon,
  ViewList as ViewListIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
    setDrawerOpen(false);
  };

  const navItems = isAuthenticated
    ? [
        { text: "Word List", path: "/", icon: <ViewListIcon /> },
        { text: "Add Word", path: "/add", icon: <AddIcon /> },
        { text: "Flashcards", path: "/flashcards", icon: <StyleIcon /> },
        ...(user?.role === "admin"
          ? [
              {
                text: "Admin Dashboard",
                path: "/admin",
                icon: <DashboardIcon />,
              },
            ]
          : []),
      ]
    : [];

  const DrawerContent = () => (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={() => setDrawerOpen(false)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
                },
                transition: "all 0.2s",
              }}
            >
              <ListItemIcon sx={{ color: "primary.main" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1, borderColor: "divider" }} />
        {isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
                },
                transition: "all 0.2s",
              }}
            >
              <ListItemIcon sx={{ color: "primary.main" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/auth"
              onClick={() => setDrawerOpen(false)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
                },
                transition: "all 0.2s",
              }}
            >
              <ListItemIcon sx={{ color: "primary.main" }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText
                primary="Login"
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="primary"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{
              mr: 2,
              "&:hover": {
                backgroundColor: "rgba(37, 99, 235, 0.08)",
              },
              transition: "all 0.2s",
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <IconButton
          edge={isMobile ? false : "start"}
          color="primary"
          aria-label="home"
          component={Link}
          to="/"
          sx={{
            mr: 2,
            "&:hover": {
              backgroundColor: "rgba(37, 99, 235, 0.08)",
            },
            transition: "all 0.2s",
          }}
        >
          <SchoolIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "primary.main",
            fontWeight: 600,
            letterSpacing: "-0.5px",
          }}
        >
          Hellenika
        </Typography>
        {!isMobile && (
          <Box sx={{ display: "flex" }}>
            {isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    color="primary"
                    startIcon={item.icon}
                    sx={{
                      mx: 1,
                      "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 0.08)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                <Button
                  onClick={handleLogout}
                  color="primary"
                  startIcon={<LogoutIcon />}
                  sx={{
                    mx: 1,
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                component={Link}
                to="/auth"
                color="primary"
                startIcon={<LoginIcon />}
                sx={{
                  mx: 1,
                  "&:hover": {
                    backgroundColor: "rgba(37, 99, 235, 0.08)",
                  },
                  transition: "all 0.2s",
                }}
              >
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <DrawerContent />
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
