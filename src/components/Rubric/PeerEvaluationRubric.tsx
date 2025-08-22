import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Alert,
  AlertTitle,
  Grid,
  Paper,
  Stack,
  Chip,
  Tooltip,
  IconButton,
  Collapse,
  LinearProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { RubricScores, NegativeIndicator } from '../../types';

interface RubricSection {
  name: string;
  maxPoints: number;
  description: string;
  criteria: string[];
  currentScore: number;
}

interface PeerEvaluationRubricProps {
  teacherId: string;
  teacherName: string;
  weekNumber: number;
  onSubmit: (scores: RubricScores, comments: string) => void;
  facultyBenchmark?: RubricScores;
}

export const PeerEvaluationRubric: React.FC<PeerEvaluationRubricProps> = ({
  teacherId,
  teacherName,
  weekNumber,
  onSubmit,
  facultyBenchmark
}) => {
  const [sections, setSections] = useState<RubricSection[]>([
    {
      name: 'Content Mastery',
      maxPoints: 30,
      currentScore: 15,
      description: 'Demonstration of comprehensive understanding of the subject matter',
      criteria: [
        'Accurate presentation of clinical concepts',
        'Appropriate depth of content coverage',
        'Evidence-based information',
        'Clear connection to NCLEX competencies'
      ]
    },
    {
      name: 'Professional Application',
      maxPoints: 25,
      currentScore: 12,
      description: 'Application of nursing knowledge to clinical scenarios',
      criteria: [
        'Relevant clinical examples',
        'Critical thinking demonstration',
        'Patient safety considerations',
        'Prioritization of nursing interventions'
      ]
    },
    {
      name: 'Teaching Methodology',
      maxPoints: 25,
      currentScore: 12,
      description: 'Effectiveness of teaching strategies and engagement',
      criteria: [
        'Clear learning objectives',
        'Engaging presentation style',
        'Appropriate use of visual aids',
        'Interactive elements and participation'
      ]
    },
    {
      name: 'Professional Delivery',
      maxPoints: 20,
      currentScore: 10,
      description: 'Professional presentation and communication skills',
      criteria: [
        'Clear and organized presentation',
        'Professional demeanor',
        'Time management',
        'Response to questions'
      ]
    }
  ]);

  const [negativeIndicators, setNegativeIndicators] = useState<NegativeIndicator[]>([
    { item: 'No 24-hour advance submission', deduction: 2, applied: false },
    { item: 'Read directly from slides', deduction: 2, applied: false },
    { item: 'Exceeded time limit', deduction: 2, applied: false },
    { item: 'Unprofessional behavior', deduction: 2, applied: false },
    { item: 'Incomplete content coverage', deduction: 2, applied: false },
    { item: 'No interactive elements', deduction: 2, applied: false },
    { item: 'Poor visual aid quality', deduction: 2, applied: false },
    { item: 'Inadequate response to questions', deduction: 2, applied: false },
    { item: 'Missing learning objectives', deduction: 2, applied: false },
    { item: 'No evidence-based references', deduction: 2, applied: false }
  ]);

  const [comments, setComments] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Content Mastery']));
  const [showWarning, setShowWarning] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSectionScoreChange = (index: number, newValue: number) => {
    const newSections = [...sections];
    newSections[index].currentScore = newValue;
    setSections(newSections);
    checkVariance();
  };

  const handleNegativeIndicatorToggle = (index: number) => {
    const newIndicators = [...negativeIndicators];
    newIndicators[index].applied = !newIndicators[index].applied;
    setNegativeIndicators(newIndicators);
  };

  const toggleSectionExpanded = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const calculateTotalScore = () => {
    const positiveScore = sections.reduce((sum, section) => sum + section.currentScore, 0);
    const negativeDeductions = negativeIndicators
      .filter(ind => ind.applied)
      .reduce((sum, ind) => sum + ind.deduction, 0);
    return Math.max(0, positiveScore - negativeDeductions);
  };

  const checkVariance = () => {
    const scores = sections.map(s => s.currentScore / s.maxPoints);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    
    if (variance < 0.01) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const getDeviationFromBenchmark = (sectionIndex: number) => {
    if (!facultyBenchmark) return null;
    
    const benchmarkScores = [
      facultyBenchmark.contentMastery,
      facultyBenchmark.professionalApplication,
      facultyBenchmark.teachingMethodology,
      facultyBenchmark.professionalDelivery
    ];
    
    const deviation = sections[sectionIndex].currentScore - benchmarkScores[sectionIndex];
    const percentDeviation = (deviation / benchmarkScores[sectionIndex]) * 100;
    
    return {
      deviation,
      percentDeviation,
      isSignificant: Math.abs(percentDeviation) > 15
    };
  };

  const handleSubmit = () => {
    const scores: RubricScores = {
      contentMastery: sections[0].currentScore,
      professionalApplication: sections[1].currentScore,
      teachingMethodology: sections[2].currentScore,
      professionalDelivery: sections[3].currentScore,
      negativeIndicators: negativeIndicators.filter(ind => ind.applied),
      totalScore: calculateTotalScore()
    };
    
    onSubmit(scores, comments);
    setSubmitted(true);
  };

  const totalScore = calculateTotalScore();
  const maxPossibleScore = sections.reduce((sum, section) => sum + section.maxPoints, 0);
  const scorePercentage = (totalScore / maxPossibleScore) * 100;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Peer Teaching Evaluation Rubric
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={`Week ${weekNumber}`}
            sx={{ bgcolor: 'white', color: 'primary.main' }}
          />
          <Typography variant="body1">
            Evaluating: <strong>{teacherName}</strong>
          </Typography>
        </Stack>
      </Paper>

      {/* Warning Alert */}
      {showWarning && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>Low Score Variance Detected</AlertTitle>
          Your scores show very little variation. Please ensure you are evaluating each criterion independently.
        </Alert>
      )}

      {/* Faculty Benchmark Alert */}
      {facultyBenchmark && (
        <Alert severity="info" sx={{ mb: 2 }} icon={<InfoIcon />}>
          <AlertTitle>Faculty Benchmark Available</AlertTitle>
          Faculty have evaluated this presentation. Significant deviations from the benchmark will be flagged.
        </Alert>
      )}

      {/* Rubric Sections */}
      {sections.map((section, index) => {
        const isExpanded = expandedSections.has(section.name);
        const deviation = getDeviationFromBenchmark(index);
        
        return (
          <Card key={section.name} sx={{ mb: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h6">{section.name}</Typography>
                  <Chip
                    label={`${section.currentScore} / ${section.maxPoints}`}
                    color={section.currentScore / section.maxPoints >= 0.7 ? 'success' : 'warning'}
                    size="small"
                  />
                  {deviation?.isSignificant && (
                    <Tooltip title={`${deviation.percentDeviation > 0 ? '+' : ''}${deviation.percentDeviation.toFixed(1)}% from faculty benchmark`}>
                      <WarningIcon color="warning" fontSize="small" />
                    </Tooltip>
                  )}
                </Stack>
                <IconButton onClick={() => toggleSectionExpanded(section.name)} size="small">
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Stack>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                {section.description}
              </Typography>
              
              <Box sx={{ px: 2 }}>
                <Slider
                  value={section.currentScore}
                  onChange={(_, value) => handleSectionScoreChange(index, value as number)}
                  max={section.maxPoints}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ mb: 2 }}
                />
              </Box>
              
              <Collapse in={isExpanded}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Evaluation Criteria:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {section.criteria.map((criterion, idx) => (
                    <Stack key={idx} direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography variant="body2">{criterion}</Typography>
                    </Stack>
                  ))}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        );
      })}

      {/* Negative Indicators */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Negative Indicators
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Check any that apply (each deducts 2 points, maximum -20)
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {negativeIndicators.map((indicator, index) => (
              <Grid item xs={12} sm={6} key={indicator.item}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={indicator.applied}
                      onChange={() => handleNegativeIndicatorToggle(index)}
                      color="error"
                    />
                  }
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2">{indicator.item}</Typography>
                      <Chip label={`-${indicator.deduction}`} size="small" color="error" />
                    </Stack>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Additional Comments
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Provide constructive feedback, suggestions for improvement, or highlight exceptional aspects..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            variant="outlined"
          />
        </CardContent>
      </Card>

      {/* Score Summary */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Score Summary
        </Typography>
        <Grid container spacing={2}>
          {sections.map(section => (
            <Grid item xs={6} sm={3} key={section.name}>
              <Typography variant="body2" color="text.secondary">
                {section.name}
              </Typography>
              <Typography variant="h6">
                {section.currentScore}/{section.maxPoints}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              Deductions
            </Typography>
            <Typography variant="h6" color="error">
              -{negativeIndicators.filter(ind => ind.applied).reduce((sum, ind) => sum + ind.deduction, 0)}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="body2" color="text.secondary">
              Final Score
            </Typography>
            <Typography variant="h4" color={scorePercentage >= 70 ? 'success.main' : 'error.main'}>
              {totalScore}/{maxPossibleScore}
            </Typography>
          </Box>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={scorePercentage}
          color={scorePercentage >= 70 ? 'success' : 'error'}
          sx={{ mt: 2, height: 10, borderRadius: 5 }}
        />
      </Paper>

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={submitted ? <CheckCircleIcon /> : <SaveIcon />}
          onClick={handleSubmit}
          disabled={submitted}
          color={submitted ? 'success' : 'primary'}
          sx={{ minWidth: 200 }}
        >
          {submitted ? 'Evaluation Submitted' : 'Submit Evaluation'}
        </Button>
      </Box>
    </Box>
  );
};