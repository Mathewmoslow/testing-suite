import { 
  StudentResponse, 
  GamingPattern, 
  Assessment, 
  AnalyticsData,
  InterventionAlert,
  GradeCalculation,
  Question,
  PeerEvaluation
} from '../types';

interface AssessmentResult {
  assessmentId: string;
  studentId: string;
  studentName: string;
  responses: StudentResponse[];
  gamingPatterns: GamingPattern[];
  startTime: Date;
  endTime: Date;
  totalTimeSpent: number;
  score: number;
  answerAccuracy: number;
  rationaleAccuracy: number;
  suspiciousBehavior: boolean;
  completedAt: Date;
}

interface StoredData {
  assessmentResults: AssessmentResult[];
  interventionAlerts: InterventionAlert[];
  analyticsData: AnalyticsData[];
  peerEvaluations: PeerEvaluation[];
  grades: GradeCalculation[];
}

class DataService {
  private readonly STORAGE_KEY = 'cptncf_assessment_data';
  private readonly ALERT_KEY = 'cptncf_intervention_alerts';
  private readonly ANALYTICS_KEY = 'cptncf_analytics_data';

  // Initialize with some mock historical data if empty
  constructor() {
    if (!this.getData()) {
      this.initializeMockData();
    }
  }

  private initializeMockData() {
    const mockData: StoredData = {
      assessmentResults: this.generateMockAssessmentResults(),
      interventionAlerts: [],
      analyticsData: [],
      peerEvaluations: [],
      grades: []
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockData));
  }

  private generateMockAssessmentResults(): AssessmentResult[] {
    return [
      {
        assessmentId: 'mock-1',
        studentId: 'student-1',
        studentName: 'John Smith',
        responses: [],
        gamingPatterns: [],
        startTime: new Date(Date.now() - 86400000 * 7),
        endTime: new Date(Date.now() - 86400000 * 7 + 3600000),
        totalTimeSpent: 3600,
        score: 78,
        answerAccuracy: 75,
        rationaleAccuracy: 81,
        suspiciousBehavior: false,
        completedAt: new Date(Date.now() - 86400000 * 7)
      },
      {
        assessmentId: 'mock-2',
        studentId: 'student-2',
        studentName: 'Jane Doe',
        responses: [],
        gamingPatterns: [
          {
            studentId: 'student-2',
            patternType: 'rationale_mining',
            confidence: 0.75,
            detectedAt: new Date(Date.now() - 86400000 * 5),
            details: { answerAccuracy: 45, rationaleAccuracy: 82 }
          }
        ],
        startTime: new Date(Date.now() - 86400000 * 5),
        endTime: new Date(Date.now() - 86400000 * 5 + 3600000),
        totalTimeSpent: 3600,
        score: 65,
        answerAccuracy: 45,
        rationaleAccuracy: 82,
        suspiciousBehavior: true,
        completedAt: new Date(Date.now() - 86400000 * 5)
      },
      {
        assessmentId: 'mock-3',
        studentId: 'student-3',
        studentName: 'Bob Wilson',
        responses: [],
        gamingPatterns: [],
        startTime: new Date(Date.now() - 86400000 * 3),
        endTime: new Date(Date.now() - 86400000 * 3 + 2700000),
        totalTimeSpent: 2700,
        score: 92,
        answerAccuracy: 90,
        rationaleAccuracy: 94,
        suspiciousBehavior: false,
        completedAt: new Date(Date.now() - 86400000 * 3)
      }
    ];
  }

  private getData(): StoredData | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    
    // Convert date strings back to Date objects
    if (parsed.assessmentResults) {
      parsed.assessmentResults = parsed.assessmentResults.map((r: any) => ({
        ...r,
        startTime: new Date(r.startTime),
        endTime: new Date(r.endTime),
        completedAt: new Date(r.completedAt),
        responses: r.responses?.map((resp: any) => ({
          ...resp,
          answerLockedAt: new Date(resp.answerLockedAt),
          rationaleSubmittedAt: resp.rationaleSubmittedAt ? new Date(resp.rationaleSubmittedAt) : undefined
        })) || [],
        gamingPatterns: r.gamingPatterns?.map((p: any) => ({
          ...p,
          detectedAt: new Date(p.detectedAt)
        })) || []
      }));
    }
    
    if (parsed.interventionAlerts) {
      parsed.interventionAlerts = parsed.interventionAlerts.map((a: any) => ({
        ...a,
        createdAt: new Date(a.createdAt),
        resolvedAt: a.resolvedAt ? new Date(a.resolvedAt) : undefined
      }));
    }
    
    return parsed;
  }

  private saveData(data: StoredData) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Save assessment result from completed assessment
  saveAssessmentResult(
    assessmentId: string,
    studentId: string,
    studentName: string,
    responses: StudentResponse[],
    gamingPatterns: GamingPattern[],
    startTime: Date,
    endTime: Date,
    totalTimeSpent: number,
    questions: Question[]
  ): AssessmentResult {
    const data = this.getData() || {
      assessmentResults: [],
      interventionAlerts: [],
      analyticsData: [],
      peerEvaluations: [],
      grades: []
    };

    // Calculate scores
    const answerCorrect = responses.filter(r => {
      const q = questions.find(q => q.id === r.questionId);
      return q?.correctAnswerId === r.answerId;
    }).length;

    const rationaleCorrect = responses.filter(r => {
      const q = questions.find(q => q.id === r.questionId);
      const rationale = q?.rationales.find(rat => rat.id === r.rationaleId);
      return rationale?.isCorrect;
    }).length;

    const totalQuestions = questions.length;
    const answerAccuracy = (answerCorrect / totalQuestions) * 100;
    const rationaleAccuracy = (rationaleCorrect / totalQuestions) * 100;
    const score = (answerAccuracy * 0.6 + rationaleAccuracy * 0.4); // Weighted score

    const result: AssessmentResult = {
      assessmentId,
      studentId,
      studentName,
      responses,
      gamingPatterns,
      startTime,
      endTime,
      totalTimeSpent,
      score: Math.round(score),
      answerAccuracy: Math.round(answerAccuracy),
      rationaleAccuracy: Math.round(rationaleAccuracy),
      suspiciousBehavior: gamingPatterns.length > 0,
      completedAt: new Date()
    };

    data.assessmentResults.push(result);

    // Generate intervention alerts if needed
    if (gamingPatterns.length > 0) {
      this.generateInterventionAlert(studentId, studentName, gamingPatterns, data);
    }

    // Update analytics data
    this.updateAnalytics(result, responses, questions, data);

    this.saveData(data);
    return result;
  }

  private generateInterventionAlert(
    studentId: string,
    studentName: string,
    patterns: GamingPattern[],
    data: StoredData
  ) {
    const highConfidencePatterns = patterns.filter(p => p.confidence > 0.7);
    
    if (highConfidencePatterns.length > 0) {
      const alert: InterventionAlert = {
        id: `alert-${Date.now()}`,
        type: 'individual',
        targetId: studentId,
        reason: `Gaming patterns detected for ${studentName}: ${highConfidencePatterns.map(p => p.patternType).join(', ')}`,
        priority: highConfidencePatterns.some(p => p.confidence > 0.8) ? 'high' : 'medium',
        status: 'pending',
        createdAt: new Date()
      };
      data.interventionAlerts.push(alert);
    }
  }

  private updateAnalytics(
    result: AssessmentResult,
    responses: StudentResponse[],
    questions: Question[],
    data: StoredData
  ) {
    // Calculate category performance
    const categoryPerformance: Record<string, number> = {};
    const categories = [...new Set(questions.map(q => q.category))];
    
    categories.forEach(category => {
      const categoryQuestions = questions.filter(q => q.category === category);
      const categoryResponses = responses.filter(r => 
        categoryQuestions.some(q => q.id === r.questionId)
      );
      
      const correct = categoryResponses.filter(r => {
        const q = categoryQuestions.find(q => q.id === r.questionId);
        return q?.correctAnswerId === r.answerId;
      }).length;
      
      categoryPerformance[category] = categoryQuestions.length > 0 
        ? (correct / categoryQuestions.length) * 100 
        : 0;
    });

    // Calculate average confidence
    const confidenceValues = responses.filter(r => r.confidence).map(r => r.confidence!);
    const averageConfidence = confidenceValues.length > 0
      ? confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length
      : 0;

    // Calculate average time per question
    const avgTimePerQuestion = result.totalTimeSpent / responses.length;

    const analytics: AnalyticsData = {
      studentId: result.studentId,
      weekNumber: Math.ceil((Date.now() - new Date('2024-01-01').getTime()) / (7 * 86400000)),
      answerAccuracy: result.answerAccuracy,
      rationaleAccuracy: result.rationaleAccuracy,
      averageTimePerQuestion: Math.round(avgTimePerQuestion),
      averageConfidence: Math.round(averageConfidence),
      performanceByCategory: categoryPerformance,
      patternsDetected: result.gamingPatterns
    };

    data.analyticsData.push(analytics);
  }

  // Get all assessment results
  getAllAssessmentResults(): AssessmentResult[] {
    const data = this.getData();
    return data?.assessmentResults || [];
  }

  // Get assessment results for faculty dashboard
  getAssessmentResultsForFaculty(): AssessmentResult[] {
    return this.getAllAssessmentResults();
  }

  // Get intervention alerts
  getInterventionAlerts(): InterventionAlert[] {
    const data = this.getData();
    return data?.interventionAlerts || [];
  }

  // Update intervention alert status
  updateAlertStatus(alertId: string, status: 'acknowledged' | 'resolved', notes?: string) {
    const data = this.getData();
    if (!data) return;

    const alert = data.interventionAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      if (notes) alert.facultyNotes = notes;
      if (status === 'resolved') alert.resolvedAt = new Date();
      this.saveData(data);
    }
  }

  // Get analytics data for dashboard
  getAnalyticsData(weekNumber?: number): AnalyticsData[] {
    const data = this.getData();
    if (!data) return [];

    if (weekNumber) {
      return data.analyticsData.filter(a => a.weekNumber === weekNumber);
    }
    return data.analyticsData;
  }

  // Get class performance statistics
  getClassPerformanceStats() {
    const results = this.getAllAssessmentResults();
    
    // Group by week
    const weeklyStats: any[] = [];
    
    // Ensure we have valid date objects
    const validResults = results.filter(r => r.completedAt && r.completedAt instanceof Date);
    
    if (validResults.length === 0) {
      // Return mock data if no valid results
      return [
        { week: 'Week 1', average: 75, answerAccuracy: 73, rationaleAccuracy: 77, studentsCompleted: 3, suspiciousPatterns: 1 },
        { week: 'Week 2', average: 78, answerAccuracy: 76, rationaleAccuracy: 80, studentsCompleted: 3, suspiciousPatterns: 0 }
      ];
    }
    
    const weeks = [...new Set(validResults.map(r => {
      const completedTime = r.completedAt instanceof Date ? r.completedAt.getTime() : new Date(r.completedAt).getTime();
      return Math.ceil((completedTime - new Date('2024-01-01').getTime()) / (7 * 86400000));
    }))];

    weeks.forEach(week => {
      const weekResults = validResults.filter(r => {
        const completedTime = r.completedAt instanceof Date ? r.completedAt.getTime() : new Date(r.completedAt).getTime();
        return Math.ceil((completedTime - new Date('2024-01-01').getTime()) / (7 * 86400000)) === week;
      });

      if (weekResults.length > 0) {
        weeklyStats.push({
          week: `Week ${week}`,
          average: Math.round(weekResults.reduce((a, b) => a + b.score, 0) / weekResults.length),
          answerAccuracy: Math.round(weekResults.reduce((a, b) => a + b.answerAccuracy, 0) / weekResults.length),
          rationaleAccuracy: Math.round(weekResults.reduce((a, b) => a + b.rationaleAccuracy, 0) / weekResults.length),
          studentsCompleted: weekResults.length,
          suspiciousPatterns: weekResults.filter(r => r.suspiciousBehavior).length
        });
      }
    });

    return weeklyStats.length > 0 ? weeklyStats : [
      { week: 'Week 1', average: 75, answerAccuracy: 73, rationaleAccuracy: 77, studentsCompleted: 3, suspiciousPatterns: 1 }
    ];
  }

  // Get gaming pattern statistics
  getGamingPatternStats() {
    const results = this.getAllAssessmentResults();
    const allPatterns = results.flatMap(r => r.gamingPatterns);
    
    const patternCounts: Record<string, number> = {};
    allPatterns.forEach(p => {
      patternCounts[p.patternType] = (patternCounts[p.patternType] || 0) + 1;
    });

    return Object.entries(patternCounts).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / results.length) * 100)
    }));
  }

  // Get student-specific results
  getStudentResults(studentId: string): AssessmentResult[] {
    const results = this.getAllAssessmentResults();
    return results.filter(r => r.studentId === studentId);
  }

  // Clear all data (for testing)
  clearAllData() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.ALERT_KEY);
    localStorage.removeItem(this.ANALYTICS_KEY);
    this.initializeMockData();
  }
}

export const dataService = new DataService();