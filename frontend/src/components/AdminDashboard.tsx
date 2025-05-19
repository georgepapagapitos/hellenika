import {
  Add as AddIcon,
  Analytics as AnalyticsIcon,
  ContentPaste as ContentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  adminService,
  DashboardStats,
  RecentContent,
  RecentUser,
} from "../services/adminService";

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentContent, setRecentContent] = useState<RecentContent[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, contentData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentUsers(),
        adminService.getRecentContent(),
      ]);

      setStats(statsData);
      setRecentUsers(usersData);
      setRecentContent(contentData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (!stats) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom={false}>
          Admin Dashboard
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(37, 99, 235, 0.08)",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <CardHeader
              title="Total Users"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <PeopleIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="h3" color="primary" gutterBottom>
                {stats.total_users}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.user_growth}% growth this month
              </Typography>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(37, 99, 235, 0.12)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <CardHeader
              title="Active Users"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                  <PeopleIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="h3" color="success.main" gutterBottom>
                {stats.active_users}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((stats.active_users / stats.total_users) * 100)}% of
                total users
              </Typography>
              <LinearProgress
                variant="determinate"
                value={80}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(22, 163, 74, 0.12)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <CardHeader
              title="Total Content"
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                  <ContentIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="h3" color="info.main" gutterBottom>
                {stats.total_content}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.content_growth}% growth this month
              </Typography>
              <LinearProgress
                variant="determinate"
                value={60}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(14, 165, 233, 0.12)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Users */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <CardHeader
              title="Recent Users"
              action={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                    },
                  }}
                >
                  Add User
                </Button>
              }
            />
            <List>
              {recentUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <ListItem>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          mb: 0.5,
                          gap: { xs: 0.5, sm: 1 },
                        }}
                      >
                        <Typography variant="subtitle1" component="span">
                          {user.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                        >
                          {user.email}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: { xs: 0.5, sm: 1 },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                        >
                          Joined {user.joined}
                        </Typography>
                        <Chip
                          size="small"
                          label={user.status}
                          color={
                            user.status === "active" ? "success" : "default"
                          }
                        />
                      </Box>
                    </Box>
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(37, 99, 235, 0.08)",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(239, 68, 68, 0.08)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {user.id < recentUsers.length && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Recent Content */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 2,
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <CardHeader
              title="Recent Content"
              action={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                    },
                  }}
                >
                  Add Content
                </Button>
              }
            />
            <List>
              {recentContent.map((content) => (
                <React.Fragment key={content.id}>
                  <ListItem>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          mb: 0.5,
                          gap: { xs: 0.5, sm: 1 },
                        }}
                      >
                        <Typography variant="subtitle1" component="span">
                          {content.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                        >
                          {content.type}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: { xs: 0.5, sm: 1 },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                        >
                          Created {content.created}
                        </Typography>
                        <Chip
                          size="small"
                          label={content.status}
                          color={
                            content.status === "published"
                              ? "success"
                              : "default"
                          }
                        />
                      </Box>
                    </Box>
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(37, 99, 235, 0.08)",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(239, 68, 68, 0.08)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {content.id < recentContent.length && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={12}>
          <Card
            sx={{
              borderRadius: 2,
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Grid container spacing={2}>
                {[
                  {
                    icon: <PeopleIcon />,
                    title: "Manage Users",
                    color: theme.palette.primary.main,
                  },
                  {
                    icon: <ContentIcon />,
                    title: "Content Management",
                    color: theme.palette.info.main,
                  },
                  {
                    icon: <SettingsIcon />,
                    title: "System Settings",
                    color: theme.palette.warning.main,
                  },
                  {
                    icon: <AnalyticsIcon />,
                    title: "Analytics",
                    color: theme.palette.success.main,
                  },
                ].map((action, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: "center",
                        cursor: "pointer",
                        borderRadius: 2,
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: "rgba(37, 99, 235, 0.08)",
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: 40,
                          color: action.color,
                          mb: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography variant="subtitle1">
                        {action.title}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
