import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  AlertTitle,
  Stack,
  IconButton,
  Tooltip,
  LinearProgress,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  NotificationsActive as NotificationIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
} from 'recharts';
import { InterventionAlert, GamingPattern } from '../../types';
import { dataService } from '../../services/dataService';

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

export const FacultyDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [interventionAlerts, setInterventionAlerts] = useState<InterventionAlert[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<any[]>([]);
  const [classPerformance, setClassPerformance] = useState<any[]>([]);
  const [patternStats, setPatternStats] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<InterventionAlert | null>(null);
  const [alertNotes, setAlertNotes] = useState('');
  const [categoryPerformance, setCategoryPerformance] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [selectedWeek]);

  const loadDashboardData = () => {
    setRefreshing(true);
    
    // Load real data from dataService
    const results = dataService.getAssessmentResultsForFaculty();
    const alerts = dataService.getInterventionAlerts();
    const stats = dataService.getClassPerformanceStats();
    const patterns = dataService.getGamingPatternStats();
    
    setAssessmentResults(results);
    setInterventionAlerts(alerts);
    setClassPerformance(stats);
    setPatternStats(patterns);
    
    // Calculate category performance from latest results
    if (results.length > 0) {
      const categories = ['diabetes', 'immunity', 'hematology', 'hemodynamics'];
      const categoryData = categories.map(cat => {
        const analytics = dataService.getAnalyticsData();
        const catPerformance = analytics.map(a => a.performanceByCategory[cat] || 0);
        const avg = catPerformance.length > 0 
          ? catPerformance.reduce((a, b) => a + b, 0) / catPerformance.length 
          : 0;
        return { 
          category: cat.charAt(0).toUpperCase() + cat.slice(1), 
          score: Math.round(avg),
          students: analytics.filter(a => a.performanceByCategory[cat] !== undefined).length
        };
      });
      setCategoryPerformance(categoryData);
    }
    
    setRefreshing(false);
  };

  const handleAlertAction = (alertId: string, action: 'acknowledge' | 'resolve') => {
    dataService.updateAlertStatus(alertId, action, alertNotes);
    setSelectedAlert(null);
    setAlertNotes('');
    loadDashboardData();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ErrorIcon color="error" />;
      case 'acknowledged': return <InfoIcon color="info" />;
      case 'resolved': return <CheckCircleIcon color="success" />;
      default: return null;
    }
  };

  const exportReport = () => {
    const report = {
      exportDate: new Date().toISOString(),
      week: selectedWeek,
      summary: {
        totalAssessments: assessmentResults.length,
        averageScore: assessmentResults.length > 0 
          ? Math.round(assessmentResults.reduce((a, b) => a + b.score, 0) / assessmentResults.length)
          : 0,
        alertsActive: interventionAlerts.filter(a => a.status === 'pending').length,
        gamingPatternsDetected: assessmentResults.filter(r => r.suspiciousBehavior).length
      },
      assessmentResults,
      interventionAlerts,
      classPerformance,
      patternStats
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `faculty_report_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Calculate real-time stats
  const pendingAlerts = interventionAlerts.filter(a => a.status === 'pending').length;
  const criticalAlerts = interventionAlerts.filter(a => 
    (a.priority === 'critical' || a.priority === 'high') && a.status === 'pending'
  ).length;
  const totalPatterns = assessmentResults.reduce((sum, r) => sum + r.gamingPatterns.length, 0);
  const averageScore = assessmentResults.length > 0 
    ? Math.round(assessmentResults.reduce((a, b) => a + b.score, 0) / assessmentResults.length)
    : 0;

  // Prepare chart data
  const patternDistribution = patternStats.map(p => ({
    name: p.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: p.count,
    percentage: p.percentage
  }));

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFA07A'];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Faculty Dashboard - Live Analytics
        </Typography>
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              label="Period"
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value={1}>Week 1</MenuItem>
              <MenuItem value={2}>Week 2</MenuItem>
              <MenuItem value={3}>Week 3</MenuItem>
              <MenuItem value={4}>Week 4</MenuItem>
              <MenuItem value={5}>Current Week</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadDashboardData}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={exportReport}>
            Export Report
          </Button>
        </Stack>
      </Stack>

      {/* Real-time Alert if gaming detected */}
      {totalPatterns > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>Gaming Patterns Detected</AlertTitle>
          {totalPatterns} suspicious patterns have been detected across {
            assessmentResults.filter(r => r.suspiciousBehavior).length
          } student assessments. Review intervention alerts below.
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: criticalAlerts > 0 
              ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Alerts
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {pendingAlerts}
                  </Typography>
                  {criticalAlerts > 0 && (
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {criticalAlerts} critical
                    </Typography>
                  )}
                </Box>
                <Badge badgeContent={criticalAlerts} color="error">
                  <NotificationIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Badge>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Gaming Patterns
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {totalPatterns}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {assessmentResults.filter(r => r.suspiciousBehavior).length} students
                  </Typography>
                </Box>
                <FlagIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Assessments
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {assessmentResults.length}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Completed
                  </Typography>
                </Box>
                <AssessmentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: averageScore >= 70 
              ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
              : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Class Average
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {averageScore}%
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {averageScore >= 70 ? 'Passing' : 'Below Target'}
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
          <Tab label="Overview" />
          <Tab label="Intervention Alerts" />
          <Tab label="Gaming Analysis" />
          <Tab label="Individual Results" />
          <Tab label="Performance Trends" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            {/* Class Performance Chart */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Class Performance Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={classPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip />
                      <Legend />
                      <Area type="monotone" dataKey="average" stackId="1" stroke="#8884d8" fill="#8884d8" name="Overall" />
                      <Area type="monotone" dataKey="answerAccuracy" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Answer Accuracy" />
                      <Area type="monotone" dataKey="rationaleAccuracy" stackId="3" stroke="#ffc658" fill="#ffc658" name="Rationale Accuracy" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Category Performance */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance by Category
                  </Typography>
                  <List>
                    {categoryPerformance.map((cat) => (
                      <ListItem key={cat.category}>
                        <ListItemText 
                          primary={cat.category}
                          secondary={`${cat.students} students assessed`}
                        />
                        <Box sx={{ minWidth: 80 }}>
                          <Stack spacing={1}>
                            <Typography variant="body2" align="right" fontWeight="bold">
                              {cat.score}%
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={cat.score} 
                              color={cat.score >= 70 ? 'success' : 'warning'}
                            />
                          </Stack>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Pattern Distribution */}
            {patternDistribution.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Gaming Pattern Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={patternDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {patternDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Answer vs Rationale Accuracy */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Answer vs Rationale Accuracy
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={assessmentResults.slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="studentName" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip />
                      <Legend />
                      <Bar dataKey="answerAccuracy" fill="#8884d8" name="Answer" />
                      <Bar dataKey="rationaleAccuracy" fill="#82ca9d" name="Rationale" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Intervention Alerts Tab */}
        <TabPanel value={currentTab} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Target</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interventionAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{getStatusIcon(alert.status)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={alert.priority} 
                        color={getPriorityColor(alert.priority) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={alert.type} 
                        variant="outlined" 
                        size="small"
                        icon={alert.type === 'group' ? <GroupsIcon /> : <PersonIcon />}
                      />
                    </TableCell>
                    <TableCell>{alert.targetId}</TableCell>
                    <TableCell>{alert.reason}</TableCell>
                    <TableCell>
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {alert.status === 'pending' && (
                        <Stack direction="row" spacing={1}>
                          <Button 
                            size="small" 
                            onClick={() => setSelectedAlert(alert)}
                          >
                            Review
                          </Button>
                        </Stack>
                      )}
                      {alert.status === 'acknowledged' && (
                        <Button 
                          size="small" 
                          color="success"
                          onClick={() => handleAlertAction(alert.id, 'resolve')}
                        >
                          Resolve
                        </Button>
                      )}
                      {alert.status === 'resolved' && (
                        <Typography variant="body2" color="success.main">
                          Resolved
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Gaming Analysis Tab */}
        <TabPanel value={currentTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>Pattern Detection Active</AlertTitle>
                The system is actively monitoring for gaming patterns including rationale mining, 
                reciprocal inflation, no variance in evaluations, and answer-rationale mismatches.
              </Alert>
            </Grid>
            
            {assessmentResults.filter(r => r.gamingPatterns.length > 0).map(result => (
              <Grid item xs={12} md={6} key={result.studentId}>
                <Card>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="h6">
                        {result.studentName}
                      </Typography>
                      <Chip 
                        label="Suspicious" 
                        color="warning" 
                        size="small"
                        icon={<WarningIcon />}
                      />
                    </Stack>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Answer Accuracy
                        </Typography>
                        <Typography variant="h4">
                          {result.answerAccuracy}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Rationale Accuracy
                        </Typography>
                        <Typography variant="h4" color={
                          result.rationaleAccuracy > result.answerAccuracy + 20 ? 'warning.main' : 'text.primary'
                        }>
                          {result.rationaleAccuracy}%
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Detected Patterns:
                    </Typography>
                    {result.gamingPatterns.map((pattern: GamingPattern, idx: number) => (
                      <Chip 
                        key={idx}
                        label={`${pattern.patternType.replace(/_/g, ' ')} (${Math.round(pattern.confidence * 100)}%)`}
                        size="small"
                        color="warning"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Individual Results Tab */}
        <TabPanel value={currentTab} index={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Assessment</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Answer Acc.</TableCell>
                  <TableCell>Rationale Acc.</TableCell>
                  <TableCell>Time Spent</TableCell>
                  <TableCell>Patterns</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assessmentResults.map((result) => (
                  <TableRow key={`${result.studentId}-${result.assessmentId}`}>
                    <TableCell>{result.studentName}</TableCell>
                    <TableCell>{result.assessmentId}</TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        color={result.score >= 70 ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {result.score}%
                      </Typography>
                    </TableCell>
                    <TableCell>{result.answerAccuracy}%</TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2"
                        color={result.rationaleAccuracy > result.answerAccuracy + 20 ? 'warning.main' : 'text.primary'}
                      >
                        {result.rationaleAccuracy}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {Math.floor(result.totalTimeSpent / 60)}m {result.totalTimeSpent % 60}s
                    </TableCell>
                    <TableCell>
                      {result.gamingPatterns.length > 0 ? (
                        <Chip 
                          label={result.gamingPatterns.length} 
                          color="warning" 
                          size="small"
                        />
                      ) : (
                        <Chip 
                          label="Clean" 
                          color="success" 
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(result.completedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Performance Trends Tab */}
        <TabPanel value={currentTab} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Weekly Performance Comparison
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={classPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="average" stroke="#8884d8" name="Overall Average" strokeWidth={2} />
                      <Line type="monotone" dataKey="answerAccuracy" stroke="#82ca9d" name="Answer Accuracy" />
                      <Line type="monotone" dataKey="rationaleAccuracy" stroke="#ffc658" name="Rationale Accuracy" />
                      <Line type="monotone" dataKey="suspiciousPatterns" stroke="#ff7979" name="Suspicious Cases" yAxisId="right" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Alert Review Dialog */}
      <Dialog open={!!selectedAlert} onClose={() => setSelectedAlert(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Review Intervention Alert</DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Target"
                value={selectedAlert.targetId}
                disabled
                fullWidth
              />
              <TextField
                label="Reason"
                value={selectedAlert.reason}
                disabled
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label="Faculty Notes"
                value={alertNotes}
                onChange={(e) => setAlertNotes(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Add notes about actions taken..."
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedAlert(null)}>Cancel</Button>
          <Button 
            onClick={() => selectedAlert && handleAlertAction(selectedAlert.id, 'acknowledge')}
            color="info"
          >
            Acknowledge
          </Button>
          <Button 
            onClick={() => selectedAlert && handleAlertAction(selectedAlert.id, 'resolve')}
            variant="contained"
            color="success"
          >
            Resolve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};