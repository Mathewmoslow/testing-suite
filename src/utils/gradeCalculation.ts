import { 
  StudentResponse, 
  Assessment, 
  PeerEvaluation, 
  GradeCalculation,
  GamingPattern,
  Question 
} from '../types';

export class GradeCalculator {
  // Weight distributions as per CPTNCF framework
  private readonly WEIGHTS = {
    individual: {
      quizzes: 0.15,
      exams: 0.30,
      final: 0.15
    },
    group: {
      teaching: 0.15,
      groupPerformance: 0.10
    },
    participation: {
      engagement: 0.08,
      feedbackQuality: 0.04,
      reflection: 0.03
    }
  };

  // Adjustment factors
  private readonly PEER_CORRELATION_THRESHOLD = 0.3;
  private readonly PEER_ADJUSTMENT_FACTOR = 0.75;
  private readonly GAMING_PENALTY_FACTOR = 0.05; // 5% per pattern detected

  /**
   * Calculate quiz average for a student
   */
  calculateQuizAverage(
    responses: StudentResponse[],
    questions: Question[],
    assessments: Assessment[]
  ): number {
    const quizAssessments = assessments.filter(a => a.type === 'quiz');
    if (quizAssessments.length === 0) return 0;

    let totalScore = 0;
    let totalQuizzes = 0;

    quizAssessments.forEach(assessment => {
      const assessmentResponses = responses.filter(r => r.assessmentId === assessment.id);
      const assessmentQuestions = questions.filter(q => assessment.questions.includes(q.id));
      
      if (assessmentResponses.length > 0) {
        const score = this.calculateAssessmentScore(assessmentResponses, assessmentQuestions);
        totalScore += score;
        totalQuizzes++;
      }
    });

    return totalQuizzes > 0 ? totalScore / totalQuizzes : 0;
  }

  /**
   * Calculate exam average for a student
   */
  calculateExamAverage(
    responses: StudentResponse[],
    questions: Question[],
    assessments: Assessment[]
  ): number {
    const examAssessments = assessments.filter(a => a.type === 'exam');
    if (examAssessments.length === 0) return 0;

    let totalScore = 0;
    let totalExams = 0;

    examAssessments.forEach(assessment => {
      const assessmentResponses = responses.filter(r => r.assessmentId === assessment.id);
      const assessmentQuestions = questions.filter(q => assessment.questions.includes(q.id));
      
      if (assessmentResponses.length > 0) {
        const score = this.calculateAssessmentScore(assessmentResponses, assessmentQuestions);
        totalScore += score;
        totalExams++;
      }
    });

    return totalExams > 0 ? totalScore / totalExams : 0;
  }

  /**
   * Calculate final exam score
   */
  calculateFinalExamScore(
    responses: StudentResponse[],
    questions: Question[],
    assessments: Assessment[]
  ): number {
    const finalAssessment = assessments.find(a => a.type === 'final');
    if (!finalAssessment) return 0;

    const finalResponses = responses.filter(r => r.assessmentId === finalAssessment.id);
    const finalQuestions = questions.filter(q => finalAssessment.questions.includes(q.id));

    return this.calculateAssessmentScore(finalResponses, finalQuestions);
  }

  /**
   * Calculate score for a single assessment with two-phase weighting
   */
  private calculateAssessmentScore(
    responses: StudentResponse[],
    questions: Question[]
  ): number {
    if (responses.length === 0 || questions.length === 0) return 0;

    let answerScore = 0;
    let rationaleScore = 0;
    let totalQuestions = 0;

    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (!question) return;

      totalQuestions++;

      // Answer phase scoring (70% weight)
      if (response.answerId === question.correctAnswerId) {
        answerScore += 0.7;
      }

      // Rationale phase scoring (30% weight)
      if (response.rationaleId) {
        const rationale = question.rationales.find(r => r.id === response.rationaleId);
        if (rationale?.isCorrect) {
          rationaleScore += 0.3;
        }
      }
    });

    const rawScore = ((answerScore + rationaleScore) / totalQuestions) * 100;
    return Math.round(rawScore * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Calculate teaching score from peer evaluations
   */
  calculateTeachingScore(
    evaluations: PeerEvaluation[],
    facultyBenchmarks: PeerEvaluation[],
    testScore: number
  ): number {
    if (evaluations.length === 0) return 0;

    // Calculate average peer score
    const peerScores = evaluations.map(e => e.rubricScores.totalScore);
    const averagePeerScore = peerScores.reduce((a, b) => a + b, 0) / peerScores.length;

    // Apply correlation adjustment if peer scores are inflated
    let adjustedScore = averagePeerScore;
    if (averagePeerScore > testScore + 20) {
      adjustedScore = averagePeerScore * this.PEER_ADJUSTMENT_FACTOR;
    }

    // Calibrate with faculty benchmarks if available
    if (facultyBenchmarks.length > 0) {
      const facultyAverage = facultyBenchmarks
        .map(b => b.rubricScores.totalScore)
        .reduce((a, b) => a + b, 0) / facultyBenchmarks.length;
      
      // If peer average deviates significantly from faculty, adjust
      const deviation = Math.abs(adjustedScore - facultyAverage) / facultyAverage;
      if (deviation > 0.15) {
        adjustedScore = (adjustedScore + facultyAverage) / 2; // Average them
      }
    }

    // Normalize to 0-100 scale (assuming max rubric score is 100)
    return Math.min(100, Math.max(0, adjustedScore));
  }

  /**
   * Calculate group performance score
   */
  calculateGroupPerformance(
    groupMemberIds: string[],
    allResponses: Map<string, StudentResponse[]>,
    questions: Question[]
  ): number {
    let totalScore = 0;
    let memberCount = 0;

    groupMemberIds.forEach(memberId => {
      const memberResponses = allResponses.get(memberId);
      if (memberResponses && memberResponses.length > 0) {
        const memberScore = this.calculateAssessmentScore(memberResponses, questions);
        totalScore += memberScore;
        memberCount++;
      }
    });

    return memberCount > 0 ? totalScore / memberCount : 0;
  }

  /**
   * Calculate engagement score based on participation metrics
   */
  calculateEngagementScore(
    responses: StudentResponse[],
    evaluationsGiven: PeerEvaluation[],
    attendanceRate: number
  ): number {
    // Time on task component (30%)
    const avgTimeOnQuestion = responses.length > 0
      ? responses.reduce((sum, r) => sum + r.timeOnQuestion, 0) / responses.length
      : 0;
    const timeScore = Math.min(100, (avgTimeOnQuestion / 60) * 100); // Normalize to 60 seconds

    // Completion rate component (30%)
    const completionRate = responses.filter(r => r.rationaleId).length / responses.length;
    const completionScore = completionRate * 100;

    // Peer evaluation participation (20%)
    const evaluationScore = Math.min(100, evaluationsGiven.length * 20); // 20 points per evaluation, max 100

    // Attendance component (20%)
    const attendanceScore = attendanceRate * 100;

    return (timeScore * 0.3 + completionScore * 0.3 + evaluationScore * 0.2 + attendanceScore * 0.2);
  }

  /**
   * Calculate feedback quality score
   */
  calculateFeedbackQuality(evaluations: PeerEvaluation[]): number {
    if (evaluations.length === 0) return 0;

    let qualityScore = 0;

    evaluations.forEach(evaluation => {
      // Check for variance in scores (30%)
      const scores = [
        evaluation.rubricScores.contentMastery,
        evaluation.rubricScores.professionalApplication,
        evaluation.rubricScores.teachingMethodology,
        evaluation.rubricScores.professionalDelivery
      ];
      const variance = this.calculateVariance(scores);
      const varianceScore = Math.min(100, variance * 1000); // Scale variance

      // Check for comments (40%)
      const hasComments = evaluation.comments && evaluation.comments.length > 50;
      const commentScore = hasComments ? 100 : 0;

      // Check for use of full rubric range (30%)
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);
      const rangeUsed = (maxScore - minScore) / 30; // Assuming max section score is 30
      const rangeScore = rangeUsed * 100;

      qualityScore += (varianceScore * 0.3 + commentScore * 0.4 + rangeScore * 0.3);
    });

    return evaluations.length > 0 ? qualityScore / evaluations.length : 0;
  }

  /**
   * Calculate reflection score (placeholder - would need reflection submissions)
   */
  calculateReflectionScore(reflectionCount: number, reflectionQuality: number): number {
    // Simple calculation based on number and quality of reflections
    const quantityScore = Math.min(100, reflectionCount * 25); // 25 points per reflection, max 100
    return (quantityScore * 0.5 + reflectionQuality * 0.5);
  }

  /**
   * Apply gaming penalties based on detected patterns
   */
  applyGamingPenalties(baseGrade: number, patterns: GamingPattern[]): {
    adjustedGrade: number;
    penalty: number;
  } {
    if (patterns.length === 0) {
      return { adjustedGrade: baseGrade, penalty: 0 };
    }

    // Calculate penalty based on number and confidence of patterns
    let totalPenalty = 0;
    patterns.forEach(pattern => {
      const patternPenalty = this.GAMING_PENALTY_FACTOR * pattern.confidence * 100;
      totalPenalty += patternPenalty;
    });

    // Cap penalty at 20%
    totalPenalty = Math.min(20, totalPenalty);
    const adjustedGrade = Math.max(0, baseGrade - totalPenalty);

    return { adjustedGrade, penalty: totalPenalty };
  }

  /**
   * Calculate final comprehensive grade
   */
  calculateFinalGrade(
    studentId: string,
    responses: StudentResponse[],
    questions: Question[],
    assessments: Assessment[],
    peerEvaluationsReceived: PeerEvaluation[],
    peerEvaluationsGiven: PeerEvaluation[],
    facultyBenchmarks: PeerEvaluation[],
    groupMemberIds: string[],
    allGroupResponses: Map<string, StudentResponse[]>,
    patterns: GamingPattern[],
    attendanceRate: number = 0.95,
    reflectionData: { count: number; quality: number } = { count: 4, quality: 75 }
  ): GradeCalculation {
    // Individual Components (60%)
    const quizzes = this.calculateQuizAverage(responses, questions, assessments);
    const exams = this.calculateExamAverage(responses, questions, assessments);
    const final = this.calculateFinalExamScore(responses, questions, assessments);

    // Group Components (25%)
    const testAverage = (quizzes + exams + final) / 3;
    const teaching = this.calculateTeachingScore(
      peerEvaluationsReceived,
      facultyBenchmarks,
      testAverage
    );
    const groupPerformance = this.calculateGroupPerformance(
      groupMemberIds,
      allGroupResponses,
      questions
    );

    // Participation Components (15%)
    const engagement = this.calculateEngagementScore(
      responses,
      peerEvaluationsGiven,
      attendanceRate
    );
    const feedbackQuality = this.calculateFeedbackQuality(peerEvaluationsGiven);
    const reflection = this.calculateReflectionScore(
      reflectionData.count,
      reflectionData.quality
    );

    // Calculate weighted grade
    const weightedGrade = 
      quizzes * this.WEIGHTS.individual.quizzes +
      exams * this.WEIGHTS.individual.exams +
      final * this.WEIGHTS.individual.final +
      teaching * this.WEIGHTS.group.teaching +
      groupPerformance * this.WEIGHTS.group.groupPerformance +
      engagement * this.WEIGHTS.participation.engagement +
      feedbackQuality * this.WEIGHTS.participation.feedbackQuality +
      reflection * this.WEIGHTS.participation.reflection;

    // Apply gaming penalties
    const { adjustedGrade, penalty } = this.applyGamingPenalties(weightedGrade, patterns);

    // Determine letter grade
    const letterGrade = this.getLetterGrade(adjustedGrade);

    return {
      studentId,
      components: {
        quizzes,
        exams,
        final,
        teaching,
        groupPerformance,
        engagement,
        feedbackQuality,
        reflection
      },
      adjustments: {
        gamingPenalty: penalty
      },
      finalGrade: Math.round(adjustedGrade * 10) / 10,
      letterGrade
    };
  }

  /**
   * Convert numerical grade to letter grade
   */
  private getLetterGrade(grade: number): string {
    if (grade >= 93) return 'A';
    if (grade >= 90) return 'A-';
    if (grade >= 87) return 'B+';
    if (grade >= 83) return 'B';
    if (grade >= 80) return 'B-';
    if (grade >= 77) return 'C+';
    if (grade >= 73) return 'C';
    if (grade >= 70) return 'C-';
    if (grade >= 67) return 'D+';
    if (grade >= 63) return 'D';
    if (grade >= 60) return 'D-';
    return 'F';
  }

  /**
   * Calculate variance for a set of scores
   */
  private calculateVariance(scores: number[]): number {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const squaredDifferences = scores.map(score => Math.pow(score - mean, 2));
    return squaredDifferences.reduce((a, b) => a + b, 0) / scores.length;
  }

  /**
   * Generate grade report with detailed breakdown
   */
  generateGradeReport(calculation: GradeCalculation): string {
    const report = `
Grade Report for Student: ${calculation.studentId}
================================================

INDIVIDUAL COMPONENTS (60%)
---------------------------
Quizzes (15%):           ${calculation.components.quizzes.toFixed(1)}%
Exams (30%):             ${calculation.components.exams.toFixed(1)}%
Final Exam (15%):        ${calculation.components.final.toFixed(1)}%

GROUP COMPONENTS (25%)
----------------------
Teaching Quality (15%):   ${calculation.components.teaching.toFixed(1)}%
Group Performance (10%):  ${calculation.components.groupPerformance.toFixed(1)}%

PARTICIPATION (15%)
-------------------
Engagement (8%):          ${calculation.components.engagement.toFixed(1)}%
Feedback Quality (4%):    ${calculation.components.feedbackQuality.toFixed(1)}%
Reflections (3%):         ${calculation.components.reflection.toFixed(1)}%

ADJUSTMENTS
-----------
Gaming Penalty:           -${calculation.adjustments.gamingPenalty?.toFixed(1) || '0.0'}%

FINAL GRADE
-----------
Numerical Grade:          ${calculation.finalGrade.toFixed(1)}%
Letter Grade:             ${calculation.letterGrade}
`;
    return report;
  }
}

export const gradeCalculator = new GradeCalculator();