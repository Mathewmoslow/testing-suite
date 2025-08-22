import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Stack,
  LinearProgress,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Lock as LockIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';

interface AssessmentItem {
  id: string;
  title: string;
  type: 'quiz' | 'exam' | 'final';
  status: 'available' | 'completed' | 'locked' | 'in-progress';
  score?: number;
  dueDate: string;
  duration: number;
  questionCount: number;
  category: string;
  week: number;
}

export const AssessmentListPage: React.FC = () => {
  const navigate = useNavigate();
  const { startAssessment } = useAssessment();
  const [filterType, setFilterType] = useState<'all' | 'quiz' | 'exam' | 'final'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'completed' | 'locked'>('all');

  const assessments: AssessmentItem[] = [
    {
      id: 'assessment-1',
      title: 'Adult Health 1 - Diabetes Management',
      type: 'quiz',
      status: 'available',
      dueDate: '2024-01-15',
      duration: 60,
      questionCount: 8,
      category: 'Diabetes',
      week: 1
    },
    {
      id: 'assessment-2',
      title: 'Immunity and HIV/AIDS',
      type: 'quiz',
      status: 'completed',
      score: 85,
      dueDate: '2024-01-08',
      duration: 45,
      questionCount: 10,
      category: 'Immunity',
      week: 2
    },
    {
      id: 'assessment-3',
      title: 'Hematology and Blood Disorders',
      type: 'exam',
      status: 'available',
      dueDate: '2024-01-20',
      duration: 90,
      questionCount: 25,
      category: 'Hematology',
      week: 3
    },
    {
      id: 'assessment-4',
      title: 'Hemodynamics and Shock States',
      type: 'quiz',
      status: 'in-progress',
      dueDate: '2024-01-18',
      duration: 60,
      questionCount: 12,
      category: 'Hemodynamics',
      week: 4
    },
    {
      id: 'assessment-5',
      title: 'Comprehensive Final Exam',
      type: 'final',
      status: 'locked',
      dueDate: '2024-02-01',
      duration: 180,
      questionCount: 50,
      category: 'All Topics',
      week: 8
    }
  ];

  const filteredAssessments = assessments.filter(assessment => {
    if (filterType !== 'all' && assessment.type !== filterType) return false;
    if (filterStatus !== 'all' && assessment.status !== filterStatus) return false;
    return true;
  });

  const handleStartAssessment = (assessmentId: string) => {
    startAssessment(assessmentId);
    navigate(`/assessment/${assessmentId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'completed': return 'default';
      case 'in-progress': return 'warning';
      case 'locked': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <PlayIcon />;
      case 'completed': return <CheckIcon />;
      case 'in-progress': return <ScheduleIcon />;
      case 'locked': return <LockIcon />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'info';
      case 'exam': return 'warning';
      case 'final': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Assessments
        </Typography>
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              label="Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="quiz">Quizzes</MenuItem>
              <MenuItem value="exam">Exams</MenuItem>
              <MenuItem value="final">Final</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="locked">Locked</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'info.light', bgcolor: alpha => alpha.palette.info.main + '08' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <InfoIcon color="info" />
          <Typography variant="body2" color="info.dark">
            All assessments use the two-phase sequential format: Answer phase (locked) followed by Rationale phase.
          </Typography>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {filteredAssessments.map((assessment) => (
          <Grid item xs={12} md={6} key={assessment.id}>
            <Card 
              sx={{ 
                height: '100%',
                opacity: assessment.status === 'locked' ? 0.7 : 1,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: assessment.status !== 'locked' ? 'translateY(-4px)' : 'none',
                  boxShadow: assessment.status !== 'locked' ? 4 : 1
                }
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {assessment.title}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip 
                        label={assessment.type.toUpperCase()} 
                        size="small" 
                        color={getTypeColor(assessment.type) as any}
                      />
                      <Chip 
                        label={`Week ${assessment.week}`} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={assessment.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                  <Chip
                    icon={getStatusIcon(assessment.status) as any}
                    label={assessment.status.replace('-', ' ').toUpperCase()}
                    color={getStatusColor(assessment.status) as any}
                  />
                </Stack>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Questions
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {assessment.questionCount}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {assessment.duration} min
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Due Date
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(assessment.dueDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Score
                    </Typography>
                    {assessment.score ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1" fontWeight="medium" color={assessment.score >= 70 ? 'success.main' : 'error.main'}>
                          {assessment.score}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={assessment.score} 
                          sx={{ width: 50, height: 6, borderRadius: 3 }}
                          color={assessment.score >= 70 ? 'success' : 'error'}
                        />
                      </Stack>
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2}>
                  {assessment.status === 'available' && (
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<PlayIcon />}
                      onClick={() => handleStartAssessment(assessment.id)}
                    >
                      Start Assessment
                    </Button>
                  )}
                  {assessment.status === 'in-progress' && (
                    <Button
                      variant="contained"
                      fullWidth
                      color="warning"
                      startIcon={<ScheduleIcon />}
                      onClick={() => navigate(`/assessment/${assessment.id}`)}
                    >
                      Continue Assessment
                    </Button>
                  )}
                  {assessment.status === 'completed' && (
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<CheckIcon />}
                      onClick={() => navigate(`/assessment/${assessment.id}`)}
                    >
                      Review Results
                    </Button>
                  )}
                  {assessment.status === 'locked' && (
                    <Button
                      variant="contained"
                      fullWidth
                      disabled
                      startIcon={<LockIcon />}
                    >
                      Locked
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};