import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { sportTheme } from './theme/sportTheme';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import WorkoutTracker from './components/WorkoutTracker';
import MealPlanner from './components/MealPlanner';
import ProgressTracker from './components/ProgressTracker';
import GoalTracker from './components/GoalTracker';
import AICoach from './components/AICoach';

function App() {
  return (
    <ThemeProvider theme={sportTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D1117 0%, #161B22 50%, #0D1117 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout><Outlet /></Layout>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/workout" element={<WorkoutTracker />} />
              <Route path="/meal" element={<MealPlanner />} />
              <Route path="/progress" element={<ProgressTracker />} />
              <Route path="/goals" element={<GoalTracker />} />
              <Route path="/ai-coach" element={<AICoach />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;