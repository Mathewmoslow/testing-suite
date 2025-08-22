import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  AvatarGroup,
  Button,
  Grid,
  Stack,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Group as GroupIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as SwapIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface GroupMember {
  id: string;
  name: string;
  email: string;
  currentRole: 'Teacher' | 'Facilitator' | 'Assessor';
  weeklyScore: number;
  trend: 'up' | 'down' | 'stable';
  avatar: string;
}

interface GroupSchedule {
  week: number;
  teacher: string;
  facilitator: string;
  assessor: string;
  topic: string;
  status: 'completed' | 'current' | 'upcoming';
}

export const GroupPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(4);

  const groupMembers: GroupMember[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.j@university.edu',
      currentRole: 'Teacher',
      weeklyScore: 85,
      trend: 'up',
      avatar: 'AJ'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.s@university.edu',
      currentRole: 'Facilitator',
      weeklyScore: 78,
      trend: 'stable',
      avatar: 'BS'
    },
    {
      id: '3',
      name: user?.name || 'You',
      email: user?.email || 'you@university.edu',
      currentRole: 'Assessor',
      weeklyScore: 82,
      trend: 'up',
      avatar: user?.name[0] || 'Y'
    }
  ];

  const groupSchedule: GroupSchedule[] = [
    {
      week: 1,
      teacher: 'Alice Johnson',
      facilitator: 'You',
      assessor: 'Bob Smith',
      topic: 'Diabetes Management',
      status: 'completed'
    },
    {
      week: 2,
      teacher: 'Bob Smith',
      facilitator: 'Alice Johnson',
      assessor: 'You',
      topic: 'Immunity & HIV/AIDS',
      status: 'completed'
    },
    {
      week: 3,
      teacher: 'You',
      facilitator: 'Bob Smith',
      assessor: 'Alice Johnson',
      topic: 'Hematology',
      status: 'completed'
    },
    {
      week: 4,
      teacher: 'Alice Johnson',
      facilitator: 'You',
      assessor: 'Bob Smith',
      topic: 'Hemodynamics',
      status: 'current'
    },
    {
      week: 5,
      teacher: 'Bob Smith',
      facilitator: 'Alice Johnson',
      assessor: 'You',
      topic: 'Respiratory',
      status: 'upcoming'
    }
  ];

  const groupPerformance = {
    average: 81.7,
    rank: 3,
    totalGroups: 12,
    weeklyScores: [78, 80, 79, 82]
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Teacher': return 'primary';
      case 'Facilitator': return 'secondary';
      case 'Assessor': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'current': return 'info';
      case 'upcoming': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Group C - Week {selectedWeek}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<EmailIcon />}>
            Message Group
          </Button>
          <Button variant="contained" startIcon={<AssessmentIcon />} onClick={() => navigate('/peer-evaluation/1')}>
            Evaluate Peer
          </Button>
        </Stack>
      </Stack>

      {/* Current Week Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Current Week Role Assignment</AlertTitle>
        Your role this week: <strong>Assessor</strong> - You will evaluate Alice Johnson's teaching presentation on Hemodynamics.
      </Alert>

      {/* Group Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="body2">
                  Group Average
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {groupPerformance.average}%
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TrendingUpIcon color="success" fontSize="small" />
                  <Typography variant="caption" color="success.main">+2.5% this week</Typography>
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
                  Group Rank
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  #{groupPerformance.rank}
                </Typography>
                <Typography variant="caption">
                  out of {groupPerformance.totalGroups} groups
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="body2">
                  Rotations Complete
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  3/12
                </Typography>
                <LinearProgress variant="determinate" value={25} sx={{ height: 6, borderRadius: 3 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="text.secondary" variant="body2">
                  Next Role Change
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  3
                </Typography>
                <Typography variant="caption">
                  days remaining
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Group Members */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Group Members
              </Typography>
              <List>
                {groupMembers.map((member, index) => (
                  <React.Fragment key={member.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getRoleColor(member.currentRole) + '.main' }}>
                          {member.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle1">
                              {member.name}
                            </Typography>
                            {member.name.includes('You') && (
                              <Chip label="You" size="small" color="primary" />
                            )}
                          </Stack>
                        }
                        secondary={
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              {member.email}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Chip 
                                label={member.currentRole} 
                                size="small" 
                                color={getRoleColor(member.currentRole) as any}
                              />
                              <Chip 
                                label={`${member.weeklyScore}%`} 
                                size="small" 
                                variant="outlined"
                              />
                            </Stack>
                          </Stack>
                        }
                      />
                      <Stack alignItems="center">
                        {member.trend === 'up' && <TrendingUpIcon color="success" />}
                        {member.trend === 'down' && <TrendingDownIcon color="error" />}
                        {member.trend === 'stable' && <SwapIcon color="action" />}
                      </Stack>
                    </ListItem>
                    {index < groupMembers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Performance Trend
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {groupPerformance.weeklyScores.map((score, index) => (
                  <Grid item xs={3} key={index}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Week {index + 1}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color={score >= 80 ? 'success.main' : 'warning.main'}>
                        {score}%
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Alert severity="success" sx={{ mt: 2 }}>
                Your group is performing above the class average of 74.2%
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Role Rotation Schedule */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Role Rotation Schedule
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Week</TableCell>
                      <TableCell>Topic</TableCell>
                      <TableCell>Teacher</TableCell>
                      <TableCell>Facilitator</TableCell>
                      <TableCell>Assessor</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupSchedule.map((schedule) => (
                      <TableRow 
                        key={schedule.week}
                        sx={{ 
                          bgcolor: schedule.status === 'current' ? 'action.selected' : 'inherit',
                          '& td': { fontWeight: schedule.status === 'current' ? 'bold' : 'normal' }
                        }}
                      >
                        <TableCell>{schedule.week}</TableCell>
                        <TableCell>{schedule.topic}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {schedule.teacher}
                            {schedule.teacher.includes('You') && <Chip label="You" size="small" />}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {schedule.facilitator}
                            {schedule.facilitator.includes('You') && <Chip label="You" size="small" />}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {schedule.assessor}
                            {schedule.assessor.includes('You') && <Chip label="You" size="small" />}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={schedule.status} 
                            size="small" 
                            color={getStatusColor(schedule.status) as any}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};