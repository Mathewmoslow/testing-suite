import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Chip,
  Alert,
  AlertTitle,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack
} from '@mui/material';
import {
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Timer as TimerIcon,
  Flag as FlagIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  NavigateNext as NextIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAssessment } from '../../context/AssessmentContext';

export const TwoPhaseAssessment: React.FC = () => {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    phase,
    selectedAnswer,
    lockedAnswer,
    selectedRationale,
    timeRemaining,
    selectAnswer,
    lockAnswer,
    selectRationale,
    submitRationale,
    canProceed,
    flagForReview,
    calculateProgress,
    suspiciousBehavior
  } = useAssessment();

  const [showLockConfirmation, setShowLockConfirmation] = useState(false);
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);

  useEffect(() => {
    if (phase.type === 'rationale' && phase.isLocked) {
      setShowPhaseTransition(true);
      setTimeout(() => setShowPhaseTransition(false), 2000);
    }
  }, [phase]);

  if (!currentQuestion) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">No question available</Alert>
      </Box>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLockAnswer = () => {
    setShowLockConfirmation(false);
    lockAnswer();
  };

  const getProgressColor = () => {
    const progress = calculateProgress();
    if (progress < 33) return 'error';
    if (progress < 66) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" color="primary">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Typography>
              <Chip 
                label={phase.type === 'answer' ? 'Phase 1: Answer' : 'Phase 2: Rationale'}
                color={phase.type === 'answer' ? 'primary' : 'secondary'}
                size="small"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ px: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress()}
                color={getProgressColor()}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Chip
                icon={<TimerIcon />}
                label={formatTime(timeRemaining)}
                color={timeRemaining < 300 ? 'error' : 'default'}
              />
              <Tooltip title="Flag for review">
                <IconButton onClick={flagForReview} color="warning">
                  <FlagIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Suspicious Behavior Warning */}
      {suspiciousBehavior && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>Unusual Pattern Detected</AlertTitle>
          Your response pattern has been flagged for review. Please ensure you are reading questions carefully.
        </Alert>
      )}

      {/* Clinical Scenario */}
      {currentQuestion.clinicalScenario && (
        <Card sx={{ mb: 3, bgcolor: 'info.light', bgcolor: alpha => alpha.palette.info.main + '08' }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <InfoIcon color="info" />
              <Box>
                <Typography variant="subtitle2" color="info.dark" gutterBottom>
                  Clinical Scenario
                </Typography>
                <Typography variant="body2">
                  {currentQuestion.clinicalScenario}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Lab Values and Vital Signs */}
      {(currentQuestion.labValues || currentQuestion.vitalSigns) && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {currentQuestion.labValues && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Laboratory Values
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  {currentQuestion.labValues.map((lab, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{lab.name}:</Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight={lab.critical ? 'bold' : 'normal'}
                        color={lab.critical ? 'error' : 'text.primary'}
                      >
                        {lab.value} {lab.unit}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
          {currentQuestion.vitalSigns && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Vital Signs
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  {currentQuestion.vitalSigns.bloodPressure && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Blood Pressure:</Typography>
                      <Typography variant="body2">{currentQuestion.vitalSigns.bloodPressure} mmHg</Typography>
                    </Box>
                  )}
                  {currentQuestion.vitalSigns.heartRate && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Heart Rate:</Typography>
                      <Typography variant="body2">{currentQuestion.vitalSigns.heartRate} bpm</Typography>
                    </Box>
                  )}
                  {currentQuestion.vitalSigns.respiratoryRate && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Respiratory Rate:</Typography>
                      <Typography variant="body2">{currentQuestion.vitalSigns.respiratoryRate} /min</Typography>
                    </Box>
                  )}
                  {currentQuestion.vitalSigns.temperature && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Temperature:</Typography>
                      <Typography variant="body2">{currentQuestion.vitalSigns.temperature}°F</Typography>
                    </Box>
                  )}
                  {currentQuestion.vitalSigns.oxygenSaturation && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">O₂ Saturation:</Typography>
                      <Typography variant="body2">{currentQuestion.vitalSigns.oxygenSaturation}%</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Main Question Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            {currentQuestion.content}
          </Typography>
          
          <Divider sx={{ my: 2 }} />

          {/* Phase 1: Answer Selection */}
          {phase.type === 'answer' && !phase.isLocked && (
            <Fade in={true}>
              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Select your answer:
                </Typography>
                <RadioGroup
                  value={selectedAnswer || ''}
                  onChange={(e) => selectAnswer(e.target.value)}
                >
                  {currentQuestion.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={
                        <Typography variant="body1">
                          {option.text}
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </Box>
            </Fade>
          )}

          {/* Locked Answer Display */}
          {phase.isLocked && lockedAnswer && (
            <Box sx={{ mb: 3 }}>
              <Alert severity="info" icon={<LockIcon />}>
                <AlertTitle>Answer Locked</AlertTitle>
                <Typography variant="body2">
                  {currentQuestion.options.find(o => o.id === lockedAnswer)?.text}
                </Typography>
              </Alert>
            </Box>
          )}

          {/* Phase 2: Rationale Selection */}
          {phase.type === 'rationale' && (
            <Fade in={true}>
              <Box>
                <Typography variant="subtitle2" color="secondary" gutterBottom>
                  Select the rationale that best explains your answer:
                </Typography>
                <RadioGroup
                  value={selectedRationale || ''}
                  onChange={(e) => selectRationale(e.target.value)}
                >
                  {currentQuestion.rationales.map((rationale, index) => (
                    <FormControlLabel
                      key={rationale.id}
                      value={rationale.id}
                      control={<Radio color="secondary" />}
                      label={
                        <Typography variant="body1">
                          {rationale.text}
                        </Typography>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </Box>
            </Fade>
          )}
        </CardContent>

        {/* Action Buttons */}
        <Box sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', justifyContent: 'flex-end' }}>
          {phase.type === 'answer' && !phase.isLocked && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!canProceed()}
              onClick={() => setShowLockConfirmation(true)}
              startIcon={<LockOpenIcon />}
            >
              Lock Answer & Continue
            </Button>
          )}
          
          {phase.type === 'rationale' && (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              disabled={!canProceed()}
              onClick={submitRationale}
              endIcon={<NextIcon />}
            >
              Submit Rationale & Next
            </Button>
          )}
        </Box>
      </Card>

      {/* Lock Confirmation Dialog */}
      <Dialog open={showLockConfirmation} onClose={() => setShowLockConfirmation(false)}>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningIcon color="warning" />
            <Typography>Confirm Answer Lock</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Once you lock your answer, you cannot change it. You will then proceed to select a rationale.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Your selected answer: {currentQuestion.options.find(o => o.id === selectedAnswer)?.text}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLockConfirmation(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleLockAnswer}>
            Lock Answer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase Transition Notification */}
      <Fade in={showPhaseTransition}>
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'secondary.main',
            color: 'white',
            p: 3,
            borderRadius: 2,
            boxShadow: 4,
            zIndex: 9999
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <CheckCircleIcon />
            <Typography variant="h6">Answer Locked - Select Rationale</Typography>
          </Stack>
        </Box>
      </Fade>
    </Box>
  );
};