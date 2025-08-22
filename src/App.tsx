import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Stack,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  School as SchoolIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

// Import theme
import { theme } from './styles/theme';

// Import contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { AssessmentProvider } from './context/AssessmentContext';

// Import components
import { TwoPhaseAssessment } from './components/Assessment/TwoPhaseAssessment';
import { PeerEvaluationRubric } from './components/Rubric/PeerEvaluationRubric';
import { FacultyDashboard } from './components/Dashboard/FacultyDashboard';

// Import pages
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AssessmentListPage } from './pages/AssessmentListPage';
import { GradesPage } from './pages/GradesPage';
import { GroupPage } from './pages/GroupPage';

const drawerWidth = 240;

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: ('student' | 'faculty' | 'admin')[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
    roles: ['student', 'faculty', 'admin']
  },
  {
    title: 'Assessments',
    path: '/assessments',
    icon: <AssignmentIcon />,
    roles: ['student', 'faculty']
  },
  {
    title: 'My Group',
    path: '/group',
    icon: <GroupIcon />,
    roles: ['student']
  },
  {
    title: 'Grades',
    path: '/grades',
    icon: <SchoolIcon />,
    roles: ['student', 'faculty']
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: <AnalyticsIcon />,
    roles: ['faculty', 'admin']
  }
];

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const filteredNavItems = navigationItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            CPTNCF Testing Suite
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={user.role.toUpperCase()}
              size="small"
              sx={{ bgcolor: 'white', color: 'primary.main' }}
            />
            {user.currentRole && (
              <Chip
                label={`Role: ${user.currentRole}`}
                size="small"
                sx={{ bgcolor: 'secondary.main', color: 'white' }}
              />
            )}
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user.name[0].toUpperCase()}
              </Avatar>
            </IconButton>
          </Stack>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: 8
          }
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {filteredNavItems.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route 
              path="/dashboard" 
              element={
                user.role === 'faculty' ? <FacultyDashboard /> : <StudentDashboard />
              } 
            />
            <Route path="/assessments" element={<AssessmentListPage />} />
            <Route path="/assessment/:id" element={<TwoPhaseAssessment />} />
            <Route path="/group" element={<GroupPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route 
              path="/analytics" 
              element={
                user.role === 'faculty' || user.role === 'admin' 
                  ? <FacultyDashboard /> 
                  : <Navigate to="/dashboard" />
              } 
            />
            <Route path="/peer-evaluation/:teacherId" element={<PeerEvaluationRubric teacherId="teacher-1" teacherName="John Doe" weekNumber={1} onSubmit={() => {}} />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AssessmentProvider>
            <AppContent />
          </AssessmentProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;