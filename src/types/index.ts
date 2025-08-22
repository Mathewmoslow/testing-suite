export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  groupId?: string;
  currentRole?: 'teacher' | 'facilitator' | 'assessor';
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  rotationNumber: number;
  formationDate: Date;
  members: string[];
  weeklyPerformance: number[];
}

export interface Question {
  id: string;
  assessmentId: string;
  content: string;
  category: 'diabetes' | 'immunity' | 'hematology' | 'hemodynamics' | 'respiratory' | 'cardiac' | 'renal' | 'neurological';
  subCategory?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  clinicalScenario?: string;
  labValues?: LabValue[];
  vitalSigns?: VitalSigns;
  options: AnswerOption[];
  correctAnswerId: string;
  rationales: Rationale[];
  ncgsCognitiveFunctions: NCGSCognitiveFunction[];
  bloomsLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  timeEstimate: number;
}

export interface LabValue {
  name: string;
  value: number | string;
  unit: string;
  normalRange: string;
  critical?: boolean;
}

export interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  painLevel?: number;
}

export interface AnswerOption {
  id: string;
  text: string;
  order: number;
}

export interface Rationale {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
  distractorType?: 'plausible' | 'partial' | 'common_misconception' | 'opposite';
}

export type NCGSCognitiveFunction = 
  | 'recognize_cues'
  | 'analyze_cues'
  | 'prioritize_hypotheses'
  | 'generate_solutions'
  | 'take_action'
  | 'evaluate_outcomes';

export interface StudentResponse {
  id: string;
  studentId: string;
  questionId: string;
  assessmentId: string;
  answerId: string;
  answerLockedAt: Date;
  rationaleId?: string;
  rationaleSubmittedAt?: Date;
  timeOnQuestion: number;
  timeOnRationale?: number;
  confidence?: number;
  flaggedForReview?: boolean;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'exam' | 'final';
  courseId: string;
  weekNumber: number;
  questions: string[];
  timeLimit: number;
  availableFrom: Date;
  availableUntil: Date;
  twoPhaseEnabled: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  passingScore: number;
}

export interface PeerEvaluation {
  id: string;
  evaluatorId: string;
  teacherId: string;
  weekNumber: number;
  rubricScores: RubricScores;
  comments?: string;
  submittedAt: Date;
  facultyBenchmarkId?: string;
}

export interface RubricScores {
  contentMastery: number;
  professionalApplication: number;
  teachingMethodology: number;
  professionalDelivery: number;
  negativeIndicators: NegativeIndicator[];
  totalScore: number;
}

export interface NegativeIndicator {
  item: string;
  deduction: number;
  applied: boolean;
}

export interface FacultyBenchmark {
  id: string;
  sessionId: string;
  evaluatorId: string;
  scores: RubricScores;
  week: number;
  createdAt: Date;
}

export interface GamingPattern {
  studentId: string;
  patternType: 'rationale_mining' | 'reciprocal_inflation' | 'no_variance' | 'answer_rationale_mismatch';
  confidence: number;
  detectedAt: Date;
  details: any;
}

export interface InterventionAlert {
  id: string;
  type: 'individual' | 'group';
  targetId: string;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'acknowledged' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
  facultyNotes?: string;
}

export interface GradeCalculation {
  studentId: string;
  components: {
    quizzes: number;
    exams: number;
    final: number;
    teaching: number;
    groupPerformance: number;
    engagement: number;
    feedbackQuality: number;
    reflection: number;
  };
  adjustments: {
    peerEvaluationAdjustment?: number;
    gamingPenalty?: number;
  };
  finalGrade: number;
  letterGrade: string;
}

export interface AnalyticsData {
  studentId: string;
  weekNumber: number;
  answerAccuracy: number;
  rationaleAccuracy: number;
  averageTimePerQuestion: number;
  averageConfidence: number;
  performanceByCategory: Record<string, number>;
  patternsDetected: GamingPattern[];
}