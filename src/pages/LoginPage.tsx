import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole: 'student' | 'faculty') => {
    if (demoRole === 'faculty') {
      setEmail('faculty@test.edu');
      setPassword('demo123');
    } else {
      setEmail('student@test.edu');
      setPassword('demo123');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%', borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 3 }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                CPTNCF
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Testing Suite Login
              </Typography>
            </Box>
          </Stack>

          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'info.light', bgcolor: alpha => alpha.palette.info.main + '08' }}>
            <Typography variant="body2" color="info.dark">
              <strong>Demo Accounts:</strong><br />
              Student: student@test.edu / demo123<br />
              Faculty: faculty@test.edu / demo123
            </Typography>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoComplete="email"
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoComplete="current-password"
              />

              <FormControl fullWidth>
                <InputLabel>Login As</InputLabel>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'student' | 'faculty')}
                  label="Login As"
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1A252F 0%, #2C3E50 100%)'
                  }
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleDemoLogin('student')}
            >
              Demo Student
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleDemoLogin('faculty')}
            >
              Demo Faculty
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            CPTNCF - Comprehensive Peer Teaching Nursing Competency Framework
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};