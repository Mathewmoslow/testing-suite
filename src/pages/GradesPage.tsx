import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  LinearProgress,
  Button,
  Grid,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { GradeCalculation } from '../types';
import { gradeCalculator } from '../utils/gradeCalculation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const GradesPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  // Mock grade calculation
  const mockGradeCalculation: GradeCalculation = {
    studentId: 'current-user',
    components: {
      quizzes: 82.5,
      exams: 78.3,
      final: 0,
      teaching: 88.2,
      groupPerformance: 76.5,
      engagement: 91.0,
      feedbackQuality: 85.0,
      reflection: 80.0
    },
    adjustments: {
      gamingPenalty: 0
    },
    finalGrade: 81.2,
    letterGrade: 'B-'
  };

  const assessmentGrades = [
    { name: 'Week 1 Quiz - Diabetes', type: 'quiz', score: 85, weight: 1.875, date: '2024-01-02' },
    { name: 'Week 2 Quiz - Immunity', type: 'quiz', score: 78, weight: 1.875, date: '2024-01-09' },
    { name: 'Week 3 Quiz - Hematology', type: 'quiz', score: 92, weight: 1.875, date: '2024-01-16' },
    { name: 'Week 4 Quiz - Hemodynamics', type: 'quiz', score: 75, weight: 1.875, date: '2024-01-23' },
    { name: 'Midterm Exam', type: 'exam', score: 78.3, weight: 15, date: '2024-01-25' },
    { name: 'Bi-weekly Exam 1', type: 'exam', score: 0, weight: 15, date: 'Pending' }
  ];

  const peerTeachingScores = [
    { week: 'Week 1', role: 'Teacher', peerScore: 92, facultyScore: 88, finalScore: 90 },
    { week: 'Week 2', role: 'Facilitator', peerScore: 85, facultyScore: 85, finalScore: 85 },
    { week: 'Week 3', role: 'Assessor', peerScore: 88, facultyScore: 90, finalScore: 89 },
    { week: 'Week 4', role: 'Teacher', peerScore: 90, facultyScore: 87, finalScore: 88.5 }
  ];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'success';
    if (grade >= 80) return 'info';
    if (grade >= 70) return 'warning';
    return 'error';
  };

  const calculateWeightedContribution = (score: number, weight: number) => {
    return (score * weight) / 100;
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Grade Report
        </Typography>
        <Button variant="contained" startIcon={<DownloadIcon />}>
          Download Transcript
        </Button>
      </Stack>

      {/* Overall Grade Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Grade
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h2" fontWeight="bold" color={getGradeColor(mockGradeCalculation.finalGrade) + '.main'}>
                  {mockGradeCalculation.finalGrade.toFixed(1)}%
                </Typography>
                <Box>
                  <Chip 
                    label={mockGradeCalculation.letterGrade} 
                    color={getGradeColor(mockGradeCalculation.finalGrade) as any}
                    size="large"
                  />
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                    <TrendingUpIcon color="success" fontSize="small" />
                    <Typography variant="caption" color="success.main">+2.3% from last week</Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Grade Breakdown
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">Individual (60%)</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(mockGradeCalculation.components.quizzes + mockGradeCalculation.components.exams) / 2}
                    sx={{ height: 8, borderRadius: 4, my: 1 }}
                  />
                  <Typography variant="body2">
                    {((mockGradeCalculation.components.quizzes + mockGradeCalculation.components.exams) / 2).toFixed(1)}%
                  </Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">Group (25%)</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(mockGradeCalculation.components.teaching + mockGradeCalculation.components.groupPerformance) / 2}
                    sx={{ height: 8, borderRadius: 4, my: 1 }}
                    color="secondary"
                  />
                  <Typography variant="body2">
                    {((mockGradeCalculation.components.teaching + mockGradeCalculation.components.groupPerformance) / 2).toFixed(1)}%
                  </Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">Participation (15%)</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(mockGradeCalculation.components.engagement + mockGradeCalculation.components.feedbackQuality + mockGradeCalculation.components.reflection) / 3}
                    sx={{ height: 8, borderRadius: 4, my: 1 }}
                    color="info"
                  />
                  <Typography variant="body2">
                    {((mockGradeCalculation.components.engagement + mockGradeCalculation.components.feedbackQuality + mockGradeCalculation.components.reflection) / 3).toFixed(1)}%
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, value) => setCurrentTab(value)}>
          <Tab label="Assessments" />
          <Tab label="Peer Teaching" />
          <Tab label="Participation" />
          <Tab label="Adjustments" />
        </Tabs>
      </Paper>

      <TabPanel value={currentTab} index={0}>
        {/* Assessments Tab */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Assessment Grades
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Assessment</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="center">Score</TableCell>
                    <TableCell align="center">Weight (%)</TableCell>
                    <TableCell align="center">Contribution</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assessmentGrades.map((grade, index) => (
                    <TableRow key={index}>
                      <TableCell>{grade.name}</TableCell>
                      <TableCell>
                        <Chip label={grade.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        {grade.score > 0 ? (
                          <Chip 
                            label={`${grade.score}%`}
                            color={getGradeColor(grade.score) as any}
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">{grade.weight}%</TableCell>
                      <TableCell align="center">
                        {grade.score > 0 
                          ? `${calculateWeightedContribution(grade.score, grade.weight).toFixed(2)}%`
                          : '-'
                        }
                      </TableCell>
                      <TableCell>{grade.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        {/* Peer Teaching Tab */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Peer Teaching Evaluations
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>Scoring Information</AlertTitle>
              Your teaching score is calculated from peer evaluations and calibrated with faculty benchmarks.
            </Alert>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Week</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="center">Peer Score</TableCell>
                    <TableCell align="center">Faculty Benchmark</TableCell>
                    <TableCell align="center">Final Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {peerTeachingScores.map((score, index) => (
                    <TableRow key={index}>
                      <TableCell>{score.week}</TableCell>
                      <TableCell>
                        <Chip label={score.role} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">{score.peerScore}</TableCell>
                      <TableCell align="center">{score.facultyScore}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={score.finalScore}
                          color={getGradeColor(score.finalScore) as any}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        {/* Participation Tab */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Engagement (8%)
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {mockGradeCalculation.components.engagement.toFixed(1)}%
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Attendance</Typography>
                    <Typography variant="body2" fontWeight="medium">95%</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Time on Task</Typography>
                    <Typography variant="body2" fontWeight="medium">88%</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Completion Rate</Typography>
                    <Typography variant="body2" fontWeight="medium">100%</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Feedback Quality (4%)
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="secondary">
                  {mockGradeCalculation.components.feedbackQuality.toFixed(1)}%
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Evaluations Given</Typography>
                    <Typography variant="body2" fontWeight="medium">4/4</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Score Variance</Typography>
                    <Typography variant="body2" fontWeight="medium">Good</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Comments Quality</Typography>
                    <Typography variant="body2" fontWeight="medium">Excellent</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Reflections (3%)
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="info">
                  {mockGradeCalculation.components.reflection.toFixed(1)}%
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Submitted</Typography>
                    <Typography variant="body2" fontWeight="medium">4/5</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Average Quality</Typography>
                    <Typography variant="body2" fontWeight="medium">B+</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Timeliness</Typography>
                    <Typography variant="body2" fontWeight="medium">On Time</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        {/* Adjustments Tab */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Grade Adjustments
            </Typography>
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>No Penalties Applied</AlertTitle>
              Your assessment patterns show consistent and honest performance. Keep up the good work!
            </Alert>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Adjustment History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell align="center">Impact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No adjustments have been applied to your grade
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};