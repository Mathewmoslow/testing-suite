import { StudentResponse, GamingPattern, Question, PeerEvaluation } from '../types';

export class PatternDetector {
  private readonly RATIONALE_ACCURACY_THRESHOLD = 30; // 30% difference
  private readonly PEER_TEST_THRESHOLD = 20; // 20% difference
  private readonly VARIANCE_THRESHOLD = 0.1; // 10% variance minimum
  private readonly MISMATCH_THRESHOLD = 0.3; // 30% mismatch rate
  private readonly RAPID_RESPONSE_TIME = 5; // 5 seconds per question

  /**
   * Detect rationale mining pattern where students consistently select correct
   * rationales despite incorrect answers
   */
  detectRationaleMining(
    responses: StudentResponse[],
    questions: Question[]
  ): GamingPattern | null {
    if (responses.length < 5) return null;

    let correctAnswers = 0;
    let correctRationales = 0;
    let totalWithRationales = 0;

    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (!question || !response.rationaleId) return;

      totalWithRationales++;
      
      if (response.answerId === question.correctAnswerId) {
        correctAnswers++;
      }
      
      const rationale = question.rationales.find(r => r.id === response.rationaleId);
      if (rationale?.isCorrect) {
        correctRationales++;
      }
    });

    if (totalWithRationales === 0) return null;

    const answerAccuracy = (correctAnswers / totalWithRationales) * 100;
    const rationaleAccuracy = (correctRationales / totalWithRationales) * 100;
    const difference = rationaleAccuracy - answerAccuracy;

    if (difference > this.RATIONALE_ACCURACY_THRESHOLD) {
      return {
        studentId: responses[0].studentId,
        patternType: 'rationale_mining',
        confidence: Math.min(difference / 50, 1), // Confidence increases with difference
        detectedAt: new Date(),
        details: {
          answerAccuracy: answerAccuracy.toFixed(2),
          rationaleAccuracy: rationaleAccuracy.toFixed(2),
          difference: difference.toFixed(2),
          sampleSize: totalWithRationales
        }
      };
    }

    return null;
  }

  /**
   * Detect reciprocal inflation where students give each other high scores
   * regardless of actual performance
   */
  detectReciprocalInflation(
    evaluations: PeerEvaluation[],
    testScores: Map<string, number>
  ): GamingPattern[] {
    const patterns: GamingPattern[] = [];
    const evaluatorScores = new Map<string, number[]>();
    
    // Group evaluations by evaluator
    evaluations.forEach(eval => {
      if (!evaluatorScores.has(eval.evaluatorId)) {
        evaluatorScores.set(eval.evaluatorId, []);
      }
      evaluatorScores.get(eval.evaluatorId)!.push(eval.rubricScores.totalScore);
    });

    // Check for reciprocal high scoring
    const reciprocalPairs = new Set<string>();
    
    evaluations.forEach(eval1 => {
      const reciprocal = evaluations.find(
        eval2 => eval2.evaluatorId === eval1.teacherId && 
                 eval2.teacherId === eval1.evaluatorId
      );
      
      if (reciprocal) {
        const pairKey = [eval1.evaluatorId, eval1.teacherId].sort().join('-');
        if (!reciprocalPairs.has(pairKey)) {
          reciprocalPairs.add(pairKey);
          
          const testScore1 = testScores.get(eval1.evaluatorId) || 0;
          const testScore2 = testScores.get(eval1.teacherId) || 0;
          
          if (eval1.rubricScores.totalScore > testScore1 + this.PEER_TEST_THRESHOLD &&
              reciprocal.rubricScores.totalScore > testScore2 + this.PEER_TEST_THRESHOLD) {
            patterns.push({
              studentId: eval1.evaluatorId,
              patternType: 'reciprocal_inflation',
              confidence: 0.8,
              detectedAt: new Date(),
              details: {
                pairedWith: eval1.teacherId,
                peerScore: eval1.rubricScores.totalScore,
                testScore: testScore1,
                difference: eval1.rubricScores.totalScore - testScore1
              }
            });
          }
        }
      }
    });

    return patterns;
  }

  /**
   * Detect lack of variance in peer evaluations
   */
  detectNoVariance(evaluations: PeerEvaluation[]): GamingPattern[] {
    const patterns: GamingPattern[] = [];
    const evaluatorGroups = new Map<string, PeerEvaluation[]>();
    
    // Group by evaluator
    evaluations.forEach(eval => {
      if (!evaluatorGroups.has(eval.evaluatorId)) {
        evaluatorGroups.set(eval.evaluatorId, []);
      }
      evaluatorGroups.get(eval.evaluatorId)!.push(eval);
    });

    evaluatorGroups.forEach((evals, evaluatorId) => {
      if (evals.length < 3) return; // Need at least 3 evaluations
      
      const scores = evals.map(e => e.rubricScores.totalScore);
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
      const stdDev = Math.sqrt(variance);
      const coefficientOfVariation = mean > 0 ? stdDev / mean : 0;
      
      if (coefficientOfVariation < this.VARIANCE_THRESHOLD) {
        patterns.push({
          studentId: evaluatorId,
          patternType: 'no_variance',
          confidence: 1 - coefficientOfVariation, // Higher confidence with less variance
          detectedAt: new Date(),
          details: {
            scores,
            mean: mean.toFixed(2),
            standardDeviation: stdDev.toFixed(2),
            coefficientOfVariation: coefficientOfVariation.toFixed(4),
            evaluationCount: evals.length
          }
        });
      }
    });

    return patterns;
  }

  /**
   * Detect answer-rationale mismatch patterns
   */
  detectAnswerRationaleMismatch(
    responses: StudentResponse[],
    questions: Question[]
  ): GamingPattern | null {
    if (responses.length < 5) return null;

    let mismatchCount = 0;
    let totalEvaluated = 0;

    responses.forEach(response => {
      if (!response.rationaleId) return;
      
      const question = questions.find(q => q.id === response.questionId);
      if (!question) return;

      totalEvaluated++;
      
      const isAnswerCorrect = response.answerId === question.correctAnswerId;
      const rationale = question.rationales.find(r => r.id === response.rationaleId);
      const isRationaleCorrect = rationale?.isCorrect || false;
      
      // Check for logical mismatch
      if (isAnswerCorrect !== isRationaleCorrect) {
        mismatchCount++;
      }
    });

    if (totalEvaluated === 0) return null;

    const mismatchRate = mismatchCount / totalEvaluated;
    
    if (mismatchRate > this.MISMATCH_THRESHOLD) {
      return {
        studentId: responses[0].studentId,
        patternType: 'answer_rationale_mismatch',
        confidence: Math.min(mismatchRate / 0.5, 1),
        detectedAt: new Date(),
        details: {
          mismatchCount,
          totalEvaluated,
          mismatchRate: (mismatchRate * 100).toFixed(2) + '%'
        }
      };
    }

    return null;
  }

  /**
   * Detect rapid clicking or random selection patterns
   */
  detectRapidResponse(responses: StudentResponse[]): GamingPattern | null {
    if (responses.length < 3) return null;

    const rapidResponses = responses.filter(r => 
      r.timeOnQuestion < this.RAPID_RESPONSE_TIME
    );

    const rapidRate = rapidResponses.length / responses.length;
    
    if (rapidRate > 0.5) { // More than 50% rapid responses
      return {
        studentId: responses[0].studentId,
        patternType: 'answer_rationale_mismatch', // Using existing type for rapid responses
        confidence: rapidRate,
        detectedAt: new Date(),
        details: {
          rapidResponseCount: rapidResponses.length,
          totalResponses: responses.length,
          averageTime: (responses.reduce((sum, r) => sum + r.timeOnQuestion, 0) / responses.length).toFixed(2),
          rapidResponseThreshold: this.RAPID_RESPONSE_TIME
        }
      };
    }

    return null;
  }

  /**
   * Run all pattern detection algorithms
   */
  detectAllPatterns(
    responses: StudentResponse[],
    questions: Question[],
    evaluations: PeerEvaluation[],
    testScores: Map<string, number>
  ): GamingPattern[] {
    const patterns: GamingPattern[] = [];

    // Rationale Mining Detection
    const rationaleMining = this.detectRationaleMining(responses, questions);
    if (rationaleMining) patterns.push(rationaleMining);

    // Answer-Rationale Mismatch Detection
    const mismatch = this.detectAnswerRationaleMismatch(responses, questions);
    if (mismatch) patterns.push(mismatch);

    // Rapid Response Detection
    const rapidResponse = this.detectRapidResponse(responses);
    if (rapidResponse) patterns.push(rapidResponse);

    // Reciprocal Inflation Detection
    const reciprocalInflation = this.detectReciprocalInflation(evaluations, testScores);
    patterns.push(...reciprocalInflation);

    // No Variance Detection
    const noVariance = this.detectNoVariance(evaluations);
    patterns.push(...noVariance);

    return patterns;
  }

  /**
   * Calculate confidence score for pattern detection
   */
  calculatePatternConfidence(patterns: GamingPattern[]): number {
    if (patterns.length === 0) return 0;
    
    const totalConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0);
    return Math.min(totalConfidence / patterns.length, 1);
  }

  /**
   * Generate intervention recommendations based on patterns
   */
  generateInterventions(patterns: GamingPattern[]): string[] {
    const interventions: string[] = [];
    
    patterns.forEach(pattern => {
      switch (pattern.patternType) {
        case 'rationale_mining':
          interventions.push('Review test-taking strategies with student');
          interventions.push('Implement stricter time controls between phases');
          break;
        case 'reciprocal_inflation':
          interventions.push('Adjust peer evaluation weights');
          interventions.push('Require faculty calibration for this group');
          break;
        case 'no_variance':
          interventions.push('Provide rubric training session');
          interventions.push('Require written justification for scores');
          break;
        case 'answer_rationale_mismatch':
          interventions.push('Schedule individual meeting to discuss understanding');
          interventions.push('Recommend additional practice with rationale selection');
          break;
      }
    });
    
    return [...new Set(interventions)]; // Remove duplicates
  }
}

export const patternDetector = new PatternDetector();