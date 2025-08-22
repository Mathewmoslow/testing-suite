import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Stack,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data
  const upcomingAssessments = [
    { id: '1', title: 'Week 5 Quiz - Respiratory', dueDate: '2024-01-15', type: 'quiz' },
    { id: '2', title: 'Midterm Exam', dueDate: '2024-01-20', type: 'exam' }
  ];

  const recentGrades = [
    { assessment: 'Week 4 Quiz', grade: 85, date: '2024-01-08' },
    { assessment: 'Diabetes Management', grade: 78, date: '2024-01-05' },
    { assessment: 'Hematology Quiz', grade: 92, date: '2024-01-02' }
  ];

  const groupMembers = [
    { name: 'Alice Johnson', role: 'Teacher', avatar: 'AJ' },
    { name: 'Bob Smith', role: 'Facilitator', avatar: 'BS' },
    { name: 'You', role: 'Assessor', avatar: user?.name[0] || 'Y' }
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Your current role this week: <Chip label={user?.currentRole || 'Student'} color="primary" size="small" />
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="body2">
                  Overall Grade
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="success.main">
                  82.5%
                </Typography>
                <Chip label="B" color="success" size="small" sx={{ width: 'fit-content' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="body2">
                  Assessments Completed
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  12/15
                </Typography>
                <LinearProgress variant="determinate" value={80} color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="body2">
                  Group Performance
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="info.main">
                  76.8%
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TrendingUpIcon color="success" fontSize="small" />
                  <Typography variant="caption" color="success.main">+3.2%</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="body2">
                  Teaching Score
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  88/100
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  {[1, 2, 3, 4].map((star) => (
                    <StarIcon key={star} fontSize="small" color="warning" />
                  ))}
                  <StarIcon fontSize="small" color="disabled" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Assessments */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Assessments
              </Typography>
              <List>
                {upcomingAssessments.map((assessment, index) => (
                  <React.Fragment key={assessment.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <AssignmentIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={assessment.title}
                        secondary={`Due: ${assessment.dueDate}`}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/assessment/${assessment.id}`)}
                      >
                        Start
                      </Button>
                    </ListItem>
                    {index < upcomingAssessments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Grades */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Grades
              </Typography>
              <List>
                {recentGrades.map((grade, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color={grade.grade >= 80 ? 'success' : 'warning'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={grade.assessment}
                        secondary={grade.date}
                      />
                      <Typography variant="h6" color={grade.grade >= 80 ? 'success.main' : 'warning.main'}>
                        {grade.grade}%
                      </Typography>
                    </ListItem>
                    {index < recentGrades.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Group Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">
                  Your Group This Week
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<GroupIcon />}
                  onClick={() => navigate('/group')}
                >
                  View Group Page
                </Button>
              </Stack>
              <Grid container spacing={2}>
                {groupMembers.map((member) => (
                  <Grid item xs={12} md={4} key={member.name}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: member.name === 'You' ? 'primary.main' : 'secondary.main' }}>
                          {member.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {member.name}
                          </Typography>
                          <Chip label={member.role} size="small" variant="outlined" />
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};