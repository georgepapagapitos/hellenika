import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  ContentPaste as ContentIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const stats = {
    totalUsers: 150,
    activeUsers: 120,
    totalContent: 500,
    userGrowth: 15,
    contentGrowth: 25,
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2 days ago', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '3 days ago', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', joined: '5 days ago', status: 'inactive' },
  ];

  const recentContent = [
    { id: 1, title: 'Basic Verbs', type: 'Lesson', created: '1 day ago', status: 'published' },
    { id: 2, title: 'Common Phrases', type: 'Exercise', created: '2 days ago', status: 'draft' },
    { id: 3, title: 'Grammar Rules', type: 'Quiz', created: '3 days ago', status: 'published' },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
        {/* Welcome Card */}
        <Grid size={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Welcome back, {user?.email}!
            </Typography>
            <Typography variant="body1">
              Here's what's happening with your application today.
            </Typography>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid size={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardHeader 
              title="Total Users" 
              avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}><PeopleIcon /></Avatar>}
            />
            <CardContent>
              <Typography variant="h3" color="primary" gutterBottom>
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.userGrowth}% growth this month
              </Typography>
              <LinearProgress variant="determinate" value={75} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardHeader 
              title="Active Users" 
              avatar={<Avatar sx={{ bgcolor: theme.palette.success.main }}><PeopleIcon /></Avatar>}
            />
            <CardContent>
              <Typography variant="h3" color="success.main" gutterBottom>
                {stats.activeUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users
              </Typography>
              <LinearProgress variant="determinate" value={80} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardHeader 
              title="Total Content" 
              avatar={<Avatar sx={{ bgcolor: theme.palette.info.main }}><ContentIcon /></Avatar>}
            />
            <CardContent>
              <Typography variant="h3" color="info.main" gutterBottom>
                {stats.totalContent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.contentGrowth}% growth this month
              </Typography>
              <LinearProgress variant="determinate" value={60} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Users */}
        <Grid size={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardHeader 
              title="Recent Users"
              action={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" component="span">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                          {user.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" component="span">
                          Joined {user.joined}
                        </Typography>
                        <Chip 
                          size="small"
                          label={user.status}
                          color={user.status === 'active' ? 'success' : 'default'}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </Box>
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
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
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardHeader 
              title="Recent Content"
              action={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle1" component="span">
                          {content.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                          {content.type}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" component="span">
                          Created {content.created}
                        </Typography>
                        <Chip 
                          size="small"
                          label={content.status}
                          color={content.status === 'published' ? 'success' : 'default'}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </Box>
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
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
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <PeopleIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="subtitle1">Manage Users</Typography>
                  </Paper>
                </Grid>
                <Grid size={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <ContentIcon sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
                    <Typography variant="subtitle1">Content Management</Typography>
                  </Paper>
                </Grid>
                <Grid size={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <SettingsIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                    <Typography variant="subtitle1">System Settings</Typography>
                  </Paper>
                </Grid>
                <Grid size={3}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <AnalyticsIcon sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
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