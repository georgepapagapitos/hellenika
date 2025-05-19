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
      // You might want to show an error message to the user here
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
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid size={4}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
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
              <LinearProgress variant="determinate" value={75} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={4}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
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
              <LinearProgress variant="determinate" value={80} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={4}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
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
              <LinearProgress variant="determinate" value={60} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Users */}
        <Grid size={6}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
            <CardHeader
              title="Recent Users"
              action={
                <Button variant="outlined" size="small" startIcon={<AddIcon />}>
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
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <Typography variant="subtitle1" component="span">
                          {user.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                          sx={{ ml: 1 }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
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
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </Box>
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
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
        <Grid size={6}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
            <CardHeader
              title="Recent Content"
              action={
                <Button variant="outlined" size="small" startIcon={<AddIcon />}>
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
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <Typography variant="subtitle1" component="span">
                          {content.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                          sx={{ ml: 1 }}
                        >
                          {content.type}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
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
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </Box>
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
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
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: 2,
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <PeopleIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.primary.main,
                        mb: 1,
                      }}
                    />
                    <Typography variant="subtitle1">Manage Users</Typography>
                  </Paper>
                </Grid>
                <Grid size={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: 2,
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <ContentIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.info.main,
                        mb: 1,
                      }}
                    />
                    <Typography variant="subtitle1">
                      Content Management
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: 2,
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <SettingsIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.warning.main,
                        mb: 1,
                      }}
                    />
                    <Typography variant="subtitle1">System Settings</Typography>
                  </Paper>
                </Grid>
                <Grid size={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: 2,
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <AnalyticsIcon
                      sx={{
                        fontSize: 40,
                        color: theme.palette.success.main,
                        mb: 1,
                      }}
                    />
                    <Typography variant="subtitle1">Analytics</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
