import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../../context/AssessmentContext';
import { adultHealth1Questions } from '../../data/questionBankUpdated';

export const AssessmentComplete: React.FC = () => {
  const navigate = useNavigate();
  const { responses, timeSpent, gamingPatterns } = useAssessment();

  // Calculate scores
  const calculateScores = () => {
    let correctAnswers = 0;
    let correctRationales = 0;
    let totalQuestions = responses.length;

    responses.forEach(response => {
      const question = adultHealth1Questions.find(q => q.id === response.questionId);
      if (question) {
        if (response.answerId === question.correctAnswerId) {
          correctAnswers++;
        }
        const rationale = question.rationales.find(r => r.id === response.rationaleId);
        if (rationale?.isCorrect) {
          correctRationales++;
        }
      }
    });

    const answerScore = (correctAnswers / totalQuestions) * 100;
    const rationaleScore = (correctRationales / totalQuestions) * 100;
    const overallScore = (answerScore * 0.7 + rationaleScore * 0.3);

    return {
      answerScore,
      rationaleScore,
      overallScore,
      correctAnswers,
      correctRationales,
      totalQuestions
    };
  };

  const scores = calculateScores();
  const passed = scores.overallScore >= 70;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon 
            sx={{ fontSize: 64, color: passed ? 'success.main' : 'warning.main', mb: 2 }} 
          />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Assessment Complete!
          </Typography>
          <Typography variant="h2" fontWeight="bold" color={passed ? 'success.main' : 'error.main'}>
            {scores.overallScore.toFixed(1)}%
          </Typography>
          <Chip 
            label={passed ? 'PASSED' : 'NEEDS IMPROVEMENT'} 
            color={passed ? 'success' : 'error'}
            size="large"
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      {gamingPatterns.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Pattern Detected</AlertTitle>
          Your response pattern has been flagged for review. This may affect your final grade.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Answer Accuracy
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {scores.answerScore.toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {scores.correctAnswers} of {scores.totalQuestions} correct
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={scores.answerScore} 
              sx={{ mt: 2, height: 8, borderRadius: 4 }}
              color={scores.answerScore >= 70 ? 'success' : 'error'}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Rationale Accuracy
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {scores.rationaleScore.toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {scores.correctRationales} of {scores.totalQuestions} correct
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={scores.rationaleScore} 
              sx={{ mt: 2, height: 8, borderRadius: 4 }}
              color={scores.rationaleScore >= 70 ? 'success' : 'error'}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Time Spent
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {formatTime(timeSpent)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg: {formatTime(Math.floor(timeSpent / responses.length))} per question
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Question Review
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell align="center">Your Answer</TableCell>
                  <TableCell align="center">Rationale</TableCell>
                  <TableCell align="center">Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {responses.map((response, index) => {
                  const question = adultHealth1Questions.find(q => q.id === response.questionId);
                  const isAnswerCorrect = response.answerId === question?.correctAnswerId;
                  const rationale = question?.rationales.find(r => r.id === response.rationaleId);
                  const isRationaleCorrect = rationale?.isCorrect;

                  return (
                    <TableRow key={response.id}>
                      <TableCell>Question {index + 1}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={isAnswerCorrect ? 'Correct' : 'Incorrect'}
                          color={isAnswerCorrect ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={isRationaleCorrect ? 'Correct' : 'Incorrect'}
                          color={isRationaleCorrect ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {formatTime(response.timeOnQuestion)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="outlined"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </Button>
        <Button
          variant="contained"
          size="large"
          startIcon={<AssessmentIcon />}
          onClick={() => navigate('/assessments')}
        >
          View All Assessments
        </Button>
      </Stack>
    </Box>
  );
};