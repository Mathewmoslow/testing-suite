import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Question, StudentResponse, Assessment, GamingPattern } from '../types';
import { adultHealth1Questions } from '../data/questionBankUpdated';
import { dataService } from '../services/dataService';
import { useAuth } from './AuthContext';

interface AssessmentPhase {
  type: 'answer' | 'rationale' | 'locked' | 'complete';
  canNavigate: boolean;
  isLocked: boolean;
}

interface AssessmentContextType {
  // Assessment State
  currentAssessment: Assessment | null;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  phase: AssessmentPhase;
  
  // Response Tracking
  lockedAnswer: string | null;
  selectedAnswer: string | null;
  selectedRationale: string | null;
  responses: StudentResponse[];
  
  // Timing
  timeSpent: number;
  timeRemaining: number;
  questionStartTime: Date | null;
  phaseStartTime: Date | null;
  
  // Pattern Detection
  gamingPatterns: GamingPattern[];
  suspiciousBehavior: boolean;
  
  // Actions
  startAssessment: (assessmentId: string) => void;
  selectAnswer: (answerId: string) => void;
  lockAnswer: () => void;
  selectRationale: (rationaleId: string) => void;
  submitRationale: () => void;
  navigateToQuestion: (index: number) => void;
  completeAssessment: () => void;
  flagForReview: () => void;
  
  // Utilities
  canProceed: () => boolean;
  getQuestionStatus: (questionId: string) => 'unanswered' | 'answered' | 'completed';
  calculateProgress: () => number;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

interface AssessmentProviderProps {
  children: ReactNode;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ children }) => {
  const { user } = useAuth();
  // Core Assessment State
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<AssessmentPhase>({
    type: 'answer',
    canNavigate: true,
    isLocked: false
  });
  const [assessmentStartTime, setAssessmentStartTime] = useState<Date | null>(null);
  
  // Response State
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [lockedAnswer, setLockedAnswer] = useState<string | null>(null);
  const [selectedRationale, setSelectedRationale] = useState<string | null>(null);
  const [responses, setResponses] = useState<StudentResponse[]>([]);
  
  // Timing State
  const [timeSpent, setTimeSpent] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [phaseStartTime, setPhaseStartTime] = useState<Date | null>(null);
  const [answerLockTime, setAnswerLockTime] = useState<Date | null>(null);
  
  // Gaming Detection State
  const [gamingPatterns, setGamingPatterns] = useState<GamingPattern[]>([]);
  const [suspiciousBehavior, setSuspiciousBehavior] = useState(false);
  const [rapidClickCount, setRapidClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState<Date | null>(null);

  const questions = adultHealth1Questions;
  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentAssessment && phase.type !== 'complete') {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentAssessment, phase.type]);

  // Debug phase changes
  useEffect(() => {
    console.log('Phase changed:', phase);
  }, [phase]);

  // Gaming Pattern Detection
  const detectGamingPatterns = useCallback(() => {
    if (responses.length < 3) return;
    
    // Pattern 1: Rationale accuracy exceeding answer accuracy
    const answerCorrect = responses.filter(r => {
      const q = questions.find(q => q.id === r.questionId);
      return q?.correctAnswerId === r.answerId;
    }).length;
    
    const rationaleCorrect = responses.filter(r => {
      const q = questions.find(q => q.id === r.questionId);
      const rationale = q?.rationales.find(rat => rat.id === r.rationaleId);
      return rationale?.isCorrect;
    }).length;
    
    const answerAccuracy = (answerCorrect / responses.length) * 100;
    const rationaleAccuracy = (rationaleCorrect / responses.length) * 100;
    
    if (rationaleAccuracy > answerAccuracy + 30) {
      const pattern: GamingPattern = {
        studentId: 'current-user',
        patternType: 'rationale_mining',
        confidence: 0.8,
        detectedAt: new Date(),
        details: { answerAccuracy, rationaleAccuracy }
      };
      setGamingPatterns(prev => [...prev, pattern]);
      setSuspiciousBehavior(true);
    }
    
    // Pattern 2: Answer-Rationale Mismatch
    const mismatchCount = responses.filter(r => {
      const q = questions.find(q => q.id === r.questionId);
      const isAnswerCorrect = q?.correctAnswerId === r.answerId;
      const rationale = q?.rationales.find(rat => rat.id === r.rationaleId);
      const isRationaleCorrect = rationale?.isCorrect;
      
      return isAnswerCorrect !== isRationaleCorrect;
    }).length;
    
    if (mismatchCount / responses.length > 0.3) {
      const pattern: GamingPattern = {
        studentId: 'current-user',
        patternType: 'answer_rationale_mismatch',
        confidence: 0.7,
        detectedAt: new Date(),
        details: { mismatchCount, totalResponses: responses.length }
      };
      setGamingPatterns(prev => [...prev, pattern]);
      setSuspiciousBehavior(true);
    }
  }, [responses, questions]);

  // Run pattern detection after each response
  useEffect(() => {
    detectGamingPatterns();
  }, [responses, detectGamingPatterns]);

  const startAssessment = (assessmentId: string) => {
    console.log('Starting assessment:', assessmentId);
    const mockAssessment: Assessment = {
      id: assessmentId,
      title: 'Adult Health 1 - Two-Phase Sequential Assessment',
      type: 'quiz',
      courseId: 'course-1',
      weekNumber: 1,
      questions: questions.map(q => q.id),
      timeLimit: 3600,
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      twoPhaseEnabled: true,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingScore: 70,
    };
    
    setCurrentAssessment(mockAssessment);
    setCurrentQuestionIndex(0);
    setPhase({ type: 'answer', canNavigate: false, isLocked: false });
    setResponses([]);
    setTimeSpent(0);
    setTimeRemaining(3600);
    const startTime = new Date();
    setAssessmentStartTime(startTime);
    setQuestionStartTime(startTime);
    setPhaseStartTime(startTime);
    setGamingPatterns([]);
    setSuspiciousBehavior(false);
    console.log('Assessment started, currentAssessment set');
  };

  const selectAnswer = (answerId: string) => {
    if (phase.type !== 'answer' || phase.isLocked) return;
    
    // Detect rapid clicking
    const now = new Date();
    if (lastClickTime && (now.getTime() - lastClickTime.getTime()) < 500) {
      setRapidClickCount(prev => prev + 1);
      if (rapidClickCount > 5) {
        setSuspiciousBehavior(true);
      }
    } else {
      setRapidClickCount(0);
    }
    setLastClickTime(now);
    
    setSelectedAnswer(answerId);
  };

  const lockAnswer = () => {
    console.log('lockAnswer called', { selectedAnswer, phase, currentQuestion: !!currentQuestion, currentAssessment: !!currentAssessment });
    
    if (!selectedAnswer || phase.type !== 'answer' || !currentQuestion || !currentAssessment) {
      console.log('lockAnswer early return', { 
        hasSelectedAnswer: !!selectedAnswer, 
        phaseType: phase.type,
        hasCurrentQuestion: !!currentQuestion,
        hasCurrentAssessment: !!currentAssessment
      });
      return;
    }
    
    const lockTime = new Date();
    console.log('Setting locked answer and transitioning to rationale phase');
    
    setLockedAnswer(selectedAnswer);
    setAnswerLockTime(lockTime);
    setPhase({ type: 'rationale', canNavigate: false, isLocked: true });
    setPhaseStartTime(new Date());
    
    // Record the time spent on answer phase
    const timeOnAnswer = questionStartTime 
      ? Math.floor((lockTime.getTime() - questionStartTime.getTime()) / 1000)
      : 0;
    
    // Create initial response with answer only
    const response: StudentResponse = {
      id: `response-${Date.now()}`,
      studentId: 'current-user',
      questionId: currentQuestion.id,
      assessmentId: currentAssessment.id,
      answerId: selectedAnswer,
      answerLockedAt: lockTime,
      timeOnQuestion: timeOnAnswer,
      confidence: undefined,
      flaggedForReview: false
    };
    
    setResponses(prev => [...prev, response]);
    console.log('Answer locked, phase should now be rationale');
  };

  const selectRationale = (rationaleId: string) => {
    if (phase.type !== 'rationale' || !phase.isLocked) return;
    setSelectedRationale(rationaleId);
  };

  const submitRationale = () => {
    console.log('submitRationale called', { selectedRationale, phase, currentQuestionIndex, totalQuestions });
    
    if (!selectedRationale || phase.type !== 'rationale' || !currentQuestion) {
      console.log('submitRationale early return:', { 
        hasSelectedRationale: !!selectedRationale, 
        phaseType: phase.type, 
        hasCurrentQuestion: !!currentQuestion 
      });
      return;
    }
    
    const now = new Date();
    const timeOnRationale = answerLockTime 
      ? Math.floor((now.getTime() - answerLockTime.getTime()) / 1000)
      : 0;
    
    // Update response with rationale
    const responseIndex = responses.findIndex(r => r.questionId === currentQuestion.id);
    if (responseIndex !== -1) {
      const updatedResponses = [...responses];
      updatedResponses[responseIndex] = {
        ...updatedResponses[responseIndex],
        rationaleId: selectedRationale,
        rationaleSubmittedAt: now,
        timeOnRationale
      };
      setResponses(updatedResponses);
    }
    
    console.log('Moving to next question:', currentQuestionIndex + 1, 'of', totalQuestions);
    
    // Move to next question or complete
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setPhase({ type: 'answer', canNavigate: false, isLocked: false });
      setSelectedAnswer(null);
      setLockedAnswer(null);
      setSelectedRationale(null);
      setQuestionStartTime(new Date());
      setPhaseStartTime(new Date());
      setAnswerLockTime(null);
    } else {
      completeAssessment();
    }
  };

  const navigateToQuestion = (index: number) => {
    // Navigation is restricted in two-phase mode
    // Only allow navigation to review completed questions
    if (phase.type === 'complete') {
      setCurrentQuestionIndex(index);
    }
  };

  const completeAssessment = () => {
    setPhase({ type: 'complete', canNavigate: true, isLocked: true });
    
    // Calculate final statistics
    const totalTimeSpent = timeSpent;
    const averageTimePerQuestion = totalTimeSpent / responses.length;
    
    // Log patterns detected
    if (gamingPatterns.length > 0) {
      console.warn('Gaming patterns detected:', gamingPatterns);
    }
    
    // Save assessment results to localStorage via dataService
    if (currentAssessment && assessmentStartTime && user) {
      const endTime = new Date();
      const result = dataService.saveAssessmentResult(
        currentAssessment.id,
        user.id,
        user.name,
        responses,
        gamingPatterns,
        assessmentStartTime,
        endTime,
        totalTimeSpent,
        questions
      );
      
      console.log('Assessment saved:', result);
    }
    
    console.log('Assessment completed:', {
      responses,
      totalTimeSpent,
      averageTimePerQuestion,
      gamingPatterns,
      suspiciousBehavior
    });
  };

  const flagForReview = () => {
    if (!currentQuestion) return;
    
    const responseIndex = responses.findIndex(r => r.questionId === currentQuestion.id);
    if (responseIndex !== -1) {
      const updatedResponses = [...responses];
      updatedResponses[responseIndex].flaggedForReview = true;
      setResponses(updatedResponses);
    }
  };

  const canProceed = () => {
    if (phase.type === 'answer') {
      const result = selectedAnswer !== null;
      console.log('canProceed answer phase:', result, { selectedAnswer });
      return result;
    }
    if (phase.type === 'rationale') {
      const result = selectedRationale !== null;
      console.log('canProceed rationale phase:', result, { selectedRationale });
      return result;
    }
    return false;
  };

  const getQuestionStatus = (questionId: string) => {
    const response = responses.find(r => r.questionId === questionId);
    if (!response) return 'unanswered';
    if (response.rationaleId) return 'completed';
    return 'answered';
  };

  const calculateProgress = () => {
    const completedQuestions = responses.filter(r => r.rationaleId).length;
    return (completedQuestions / totalQuestions) * 100;
  };

  const value = {
    currentAssessment,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    phase,
    lockedAnswer,
    selectedAnswer,
    selectedRationale,
    responses,
    timeSpent,
    timeRemaining,
    questionStartTime,
    phaseStartTime,
    gamingPatterns,
    suspiciousBehavior,
    startAssessment,
    selectAnswer,
    lockAnswer,
    selectRationale,
    submitRationale,
    navigateToQuestion,
    completeAssessment,
    flagForReview,
    canProceed,
    getQuestionStatus,
    calculateProgress
  };

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
};