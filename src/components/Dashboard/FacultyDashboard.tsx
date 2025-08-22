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
  InputLabel
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
  NotificationsActive as NotificationIcon
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
  Radar
} from 'recharts';
import { InterventionAlert, GamingPattern, Group, AnalyticsData } from '../../types';

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
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [interventionAlerts, setInterventionAlerts] = useState<InterventionAlert[]>([]);
  const [gamingPatterns, setGamingPatterns] = useState<GamingPattern[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  const mockClassPerformance = [
    { week: 'Week 1', average: 72, quizzes: 75, exams: 70, rationales: 68 },
    { week: 'Week 2', average: 74, quizzes: 76, exams: 73, rationales: 71 },
    { week: 'Week 3', average: 71, quizzes: 73, exams: 69, rationales: 70 },
    { week: 'Week 4', average: 76, quizzes: 78, exams: 75, rationales: 74 }
  ];

  const mockGroupPerformance = [
    { name: 'Group A', performance: 82, trend: 'up' },
    { name: 'Group B', performance: 68, trend: 'down' },
    { name: 'Group C', performance: 75, trend: 'stable' },
    { name: 'Group D', performance: 71, trend: 'up' },
    { name: 'Group E', performance: 65, trend: 'down' }
  ];

  const mockCategoryPerformance = [
    { category: 'Diabetes', score: 78 },
    { category: 'Immunity', score: 72 },
    { category: 'Hematology', score: 69 },
    { category: 'Hemodynamics', score: 74 }
  ];

  const mockPatternDistribution = [
    { name: 'Rationale Mining', value: 12, color: '#FF6B6B' },
    { name: 'Reciprocal Inflation', value: 8, color: '#4ECDC4' },
    { name: 'No Variance', value: 15, color: '#45B7D1' },
    { name: 'Answer Mismatch', value: 10, color: '#96CEB4' }
  ];

  useEffect(() => {
    loadDashboardData();
  }, [selectedWeek]);

  const loadDashboardData = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setInterventionAlerts([
        {
          id: 'alert-1',
          type: 'group',
          targetId: 'group-b',
          reason: 'Group performance below 70% for 2 consecutive weeks',
          priority: 'high',
          status: 'pending',
          createdAt: new Date()
        },
        {
          id: 'alert-2',
          type: 'individual',
          targetId: 'student-5',
          reason: 'Rationale accuracy exceeds answer accuracy by 35%',
          priority: 'medium',
          status: 'pending',
          createdAt: new Date()
        },
        {
          id: 'alert-3',
          type: 'individual',
          targetId: 'student-8',
          reason: 'No variance in peer evaluations',
          priority: 'low',
          status: 'acknowledged',
          createdAt: new Date()
        }
      ]);

      setGamingPatterns([
        {
          studentId: 'student-5',
          patternType: 'rationale_mining',
          confidence: 0.85,
          detectedAt: new Date(),
          details: { answerAccuracy: 45, rationaleAccuracy: 80 }
        },
        {
          studentId: 'student-8',
          patternType: 'no_variance',
          confidence: 0.92,
          detectedAt: new Date(),
          details: { varianceScore: 0.05 }
        }
      ]);

      setRefreshing(false);
    }, 1000);
  };

  const handleAlertAction = (alertId: string, action: 'acknowledge' | 'resolve') => {
    setInterventionAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, status: action === 'acknowledge' ? 'acknowledged' : 'resolved' }
          : alert
      )
    );
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Faculty Dashboard
        </Typography>
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Week</InputLabel>
            <Select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value as number)}
              label="Week"
            >
              <MenuItem value={1}>Week 1</MenuItem>
              <MenuItem value={2}>Week 2</MenuItem>
              <MenuItem value={3}>Week 3</MenuItem>
              <MenuItem value={4}>Week 4</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadDashboardData}
            disabled={refreshing}
          >
            Refresh
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Export Report
          </Button>
        </Stack>
      </Stack>

      {/* Alert Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Critical Alerts
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error">
                    {interventionAlerts.filter(a => a.priority === 'critical' || a.priority === 'high').length}
                  </Typography>
                </Box>
                <Badge badgeContent="!" color="error">
                  <NotificationIcon sx={{ fontSize: 40, color: 'error.light' }} />
                </Badge>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Gaming Patterns
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {gamingPatterns.length}
                  </Typography>
                </Box>
                <FlagIcon sx={{ fontSize: 40, color: 'warning.light' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Groups at Risk
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    2
                  </Typography>
                </Box>
                <GroupsIcon sx={{ fontSize: 40, color: 'primary.light' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Class Average
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    74.2%
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.light' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, value) => setCurrentTab(value)}>
          <Tab label="Intervention Queue" />
          <Tab label="Performance Analytics" />
          <Tab label="Pattern Analysis" />
          <Tab label="Group Monitoring" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        {/* Intervention Queue */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Priority Interventions
                </Typography>
                <List>
                  {interventionAlerts.map((alert, index) => (
                    <React.Fragment key={alert.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: `${getPriorityColor(alert.priority)}.main` }}>
                            {alert.type === 'group' ? <GroupsIcon /> : <PersonIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="subtitle1">{alert.reason}</Typography>
                              <Chip
                                label={alert.priority}
                                size="small"
                                color={getPriorityColor(alert.priority) as any}
                              />
                              {getStatusIcon(alert.status)}
                            </Stack>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Target: {alert.targetId} | Created: {alert.createdAt.toLocaleDateString()}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Stack direction="row" spacing={1}>
                            {alert.status === 'pending' && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                              >
                                Acknowledge
                              </Button>
                            )}
                            {alert.status === 'acknowledged' && (
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleAlertAction(alert.id, 'resolve')}
                              >
                                Resolve
                              </Button>
                            )}
                            <IconButton size="small">
                              <ViewIcon />
                            </IconButton>
                          </Stack>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < interventionAlerts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        {/* Performance Analytics */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Class Performance Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockClassPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="average" stroke="#8884d8" name="Overall" />
                    <Line type="monotone" dataKey="quizzes" stroke="#82ca9d" name="Quizzes" />
                    <Line type="monotone" dataKey="exams" stroke="#ffc658" name="Exams" />
                    <Line type="monotone" dataKey="rationales" stroke="#ff7c7c" name="Rationales" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance by Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={mockCategoryPerformance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        {/* Pattern Analysis */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gaming Pattern Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockPatternDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockPatternDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Pattern Detections
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Pattern</TableCell>
                        <TableCell>Confidence</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {gamingPatterns.slice(0, 5).map((pattern) => (
                        <TableRow key={`${pattern.studentId}-${pattern.patternType}`}>
                          <TableCell>{pattern.studentId}</TableCell>
                          <TableCell>
                            <Chip
                              label={pattern.patternType.replace('_', ' ')}
                              size="small"
                              color="warning"
                            />
                          </TableCell>
                          <TableCell>
                            <LinearProgress
                              variant="determinate"
                              value={pattern.confidence * 100}
                              sx={{ width: 60, mr: 1, display: 'inline-block' }}
                            />
                            {(pattern.confidence * 100).toFixed(0)}%
                          </TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <ViewIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        {/* Group Monitoring */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Group Performance Overview
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={mockGroupPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="performance" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Group Details
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Group</TableCell>
                        <TableCell>Performance</TableCell>
                        <TableCell>Trend</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockGroupPerformance.map((group) => (
                        <TableRow key={group.name}>
                          <TableCell>{group.name}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <LinearProgress
                                variant="determinate"
                                value={group.performance}
                                sx={{ width: 100 }}
                                color={group.performance >= 70 ? 'success' : 'error'}
                              />
                              <Typography variant="body2">{group.performance}%</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {group.trend === 'up' && <TrendingUpIcon color="success" />}
                            {group.trend === 'down' && <TrendingDownIcon color="error" />}
                            {group.trend === 'stable' && <RemoveIcon color="action" />}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={group.performance >= 70 ? 'On Track' : 'At Risk'}
                              color={group.performance >= 70 ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="View Details">
                                <IconButton size="small">
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              {group.performance < 70 && (
                                <Tooltip title="Schedule Intervention">
                                  <IconButton size="small" color="warning">
                                    <WarningIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};