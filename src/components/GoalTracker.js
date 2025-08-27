import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  LinearProgress,
  Chip
} from '@mui/material';
// Removed Clerk import
import { getUserData, saveUserData, STORAGE_KEYS } from '../utils/storage';

// Goal Types and Metrics
const GOAL_TYPES = {
  STRENGTH: 'Strength Goals',
  BODY_COMPOSITION: 'Body Composition',
  PERFORMANCE: 'Performance Tracking'
};

const GOAL_METRICS = {
  [GOAL_TYPES.STRENGTH]: [
    'Bench Press (kg)', 
    'Squat (kg)', 
    'Deadlift (kg)', 
    'Overhead Press (kg)'
  ],
  [GOAL_TYPES.BODY_COMPOSITION]: [
    'Weight (kg)', 
    'Body Fat (%)', 
    'Muscle Mass (kg)', 
    'Waist Circumference (cm)'
  ],
  [GOAL_TYPES.PERFORMANCE]: [
    'Workout Frequency (times/week)', 
    'Total Weekly Volume', 
    'Rest Time Between Sets (seconds)', 
    'Cardio Endurance (minutes)'
  ]
};

const GoalTracker = () => {
  // Mock user for demo
  const user = { id: 'demo-user' };
  const [goals, setGoals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: '',
    metric: '',
    currentValue: '',
    targetValue: '',
    deadline: '',
    notes: ''
  });

  // Load goals from localStorage
  useEffect(() => {
    if (user) {
      const savedGoals = getUserData(user.id, STORAGE_KEYS.GOALS) || [];
      setGoals(savedGoals);
    }
  }, [user]);

  // Save goals to localStorage
  useEffect(() => {
    if (user && goals.length > 0) {
      saveUserData(user.id, STORAGE_KEYS.GOALS, goals);
    }
  }, [user, goals]);

  const calculateProgress = (goal) => {
    const progress = (parseFloat(goal.currentValue) / parseFloat(goal.targetValue)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const addGoal = () => {
    if (!newGoal.type || !newGoal.metric || !newGoal.currentValue || !newGoal.targetValue) {
      alert('Please fill in all required fields');
      return;
    }

    const goalToAdd = {
      ...newGoal,
      id: Date.now(),
      startDate: new Date().toISOString(),
      progress: calculateProgress(newGoal),
      history: [
        {
          date: new Date().toISOString(),
          value: parseFloat(newGoal.currentValue)
        }
      ]
    };

    setGoals([...goals, goalToAdd]);
    setOpenDialog(false);
    // Reset form
    setNewGoal({
      type: '',
      metric: '',
      currentValue: '',
      targetValue: '',
      deadline: '',
      notes: ''
    });
  };

  const updateGoalProgress = (goalId, newValue) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedHistory = [
          ...goal.history,
          {
            date: new Date().toISOString(),
            value: parseFloat(newValue)
          }
        ];

        return {
          ...goal,
          progress: calculateProgress({ ...goal, currentValue: newValue }),
          history: updatedHistory
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
  };

  const deleteGoal = (goalId) => {
    const filteredGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(filteredGoals);
  };

  const handleEditGoal = (index) => {
    // TO DO: implement edit goal functionality
  };

  const handleDeleteGoal = (index) => {
    deleteGoal(goals[index].id);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4" gutterBottom>
          Goal Tracker
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setOpenDialog(true)}
        >
          Add New Goal
        </Button>
      </Box>

      {goals.length === 0 ? (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            backgroundColor: 'background.paper' 
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No goals set yet. Click "Add New Goal" to get started!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {goals.map((goal, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column' 
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {goal.type}: {goal.metric}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Current: {goal.currentValue}
                  </Typography>
                  <Typography variant="body2">
                    Target: {goal.targetValue}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateProgress(goal)} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5, 
                    mb: 2 
                  }} 
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip 
                    label={`Deadline: ${goal.deadline}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Box>
                    <Button 
                      size="small" 
                      color="primary" 
                      onClick={() => handleEditGoal(index)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="secondary" 
                      onClick={() => handleDeleteGoal(index)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Goal</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Goal Type</InputLabel>
                <Select
                  value={newGoal.type}
                  label="Goal Type"
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value, metric: '' })}
                >
                  {Object.values(GOAL_TYPES).map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth disabled={!newGoal.type}>
                <InputLabel>Metric</InputLabel>
                <Select
                  value={newGoal.metric}
                  label="Metric"
                  onChange={(e) => setNewGoal({ ...newGoal, metric: e.target.value })}
                >
                  {newGoal.type && GOAL_METRICS[newGoal.type].map(metric => (
                    <MenuItem key={metric} value={metric}>{metric}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Current Value"
                type="number"
                value={newGoal.currentValue}
                onChange={(e) => setNewGoal({ ...newGoal, currentValue: e.target.value })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Target Value"
                type="number"
                value={newGoal.targetValue}
                onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Date"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={newGoal.notes}
                onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={addGoal} 
            variant="contained"
            disabled={!newGoal.type || !newGoal.metric || !newGoal.currentValue || !newGoal.targetValue}
          >
            Create Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GoalTracker;
