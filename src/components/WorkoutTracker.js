import React, { useState, useEffect } from 'react';
// Removed Clerk import
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Add as AddIcon, 
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Psychology as AIIcon
} from '@mui/icons-material';
import { saveUserData, getUserData, STORAGE_KEYS } from '../utils/storage';

const EXERCISE_CATEGORIES = {
  weightTraining: {
    name: 'Weight Training',
    icon: <AddIcon />,
    exercises: [
      { name: 'Bench Press', muscleGroups: ['Chest', 'Triceps'] },
      { name: 'Squats', muscleGroups: ['Legs', 'Glutes'] },
      { name: 'Deadlifts', muscleGroups: ['Back', 'Legs'] },
      { name: 'Shoulder Press', muscleGroups: ['Shoulders', 'Triceps'] },
      { name: 'Bicep Curls', muscleGroups: ['Biceps'] },
      { name: 'Tricep Extensions', muscleGroups: ['Triceps'] },
      { name: 'Lat Pulldowns', muscleGroups: ['Back'] },
      { name: 'Leg Press', muscleGroups: ['Legs'] }
    ]
  },
  cardio: {
    name: 'Cardio',
    icon: <AddIcon />,
    exercises: [
      { name: 'Running', muscleGroups: ['Legs', 'Cardiovascular'] },
      { name: 'Cycling', muscleGroups: ['Legs', 'Cardiovascular'] },
      { name: 'Swimming', muscleGroups: ['Full Body', 'Cardiovascular'] },
      { name: 'Rowing', muscleGroups: ['Full Body', 'Cardiovascular'] },
      { name: 'Jump Rope', muscleGroups: ['Legs', 'Cardiovascular'] },
      { name: 'Elliptical', muscleGroups: ['Legs', 'Cardiovascular'] }
    ]
  },
  bodyweight: {
    name: 'Bodyweight',
    icon: <AddIcon />,
    exercises: [
      { name: 'Push-ups', muscleGroups: ['Chest', 'Triceps'] },
      { name: 'Pull-ups', muscleGroups: ['Back', 'Biceps'] },
      { name: 'Squats', muscleGroups: ['Legs', 'Glutes'] },
      { name: 'Lunges', muscleGroups: ['Legs'] },
      { name: 'Plank', muscleGroups: ['Core'] },
      { name: 'Burpees', muscleGroups: ['Full Body'] }
    ]
  }
};

const WorkoutTracker = () => {
  // Mock user for demo
  const user = { id: 'demo-user', firstName: 'Demo' };
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({
    category: '',
    name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    muscleGroups: []
  });

  useEffect(() => {
    if (user) {
      // Load user-specific workouts
      const savedWorkouts = getUserData(user.id, STORAGE_KEYS.WORKOUTS);
      if (savedWorkouts) {
        setWorkouts(savedWorkouts);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout(prev => ({
      ...prev,
      [name]: value,
      // Update muscle groups when exercise is selected
      muscleGroups: name === 'name' 
        ? findMuscleGroups(value) 
        : prev.muscleGroups
    }));
  };

  const findMuscleGroups = (exerciseName) => {
    for (const category in EXERCISE_CATEGORIES) {
      const exercise = EXERCISE_CATEGORIES[category].exercises
        .find(ex => ex.name === exerciseName);
      return exercise ? exercise.muscleGroups : [];
    }
    return [];
  };

  const handleAddWorkout = () => {
    if (!user) return;

    const workout = {
      ...newWorkout,
      id: Date.now(),
      date: new Date().toISOString(),
    };

    const updatedWorkouts = [...workouts, workout];
    setWorkouts(updatedWorkouts);
    saveUserData(user.id, STORAGE_KEYS.WORKOUTS, updatedWorkouts);

    // Reset form
    setNewWorkout({
      category: '',
      name: '',
      sets: '',
      reps: '',
      weight: '',
      duration: '',
      muscleGroups: []
    });
  };

  const handleDeleteWorkout = (workoutId) => {
    if (!user) return;

    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    setWorkouts(updatedWorkouts);
    saveUserData(user.id, STORAGE_KEYS.WORKOUTS, updatedWorkouts);
  };

  // Always show workout tracker in demo mode

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Workout Tracker
        </Typography>
      </Box>
      
      {/* AI Workout Suggestion */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
          <AIIcon sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Need workout inspiration?</Typography>
            <Typography variant="body2">Get AI-powered personalized workout plans</Typography>
          </Box>
          <Button 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'white' }}
            onClick={() => window.location.href = '/ai-coach'}
          >
            AI Coach
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Workout
        </Typography>
        <Grid container spacing={2}>
          {/* Exercise Category Selection */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Exercise Category</InputLabel>
              <Select
                name="category"
                value={newWorkout.category}
                onChange={handleInputChange}
                label="Exercise Category"
              >
                {Object.entries(EXERCISE_CATEGORIES).map(([key, category]) => (
                  <MenuItem key={key} value={key}>
                    {category.icon}
                    <Box sx={{ ml: 1 }}>{category.name}</Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Exercise Selection */}
          <Grid item xs={12} sm={8}>
            <FormControl 
              fullWidth 
              variant="outlined" 
              disabled={!newWorkout.category}
            >
              <InputLabel>Exercise</InputLabel>
              <Select
                name="name"
                value={newWorkout.name}
                onChange={handleInputChange}
                label="Exercise"
              >
                {newWorkout.category && 
                  EXERCISE_CATEGORIES[newWorkout.category].exercises.map((exercise) => (
                    <MenuItem key={exercise.name} value={exercise.name}>
                      {exercise.name}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>

          {/* Workout Details */}
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Sets"
              name="sets"
              type="number"
              value={newWorkout.sets}
              onChange={handleInputChange}
              variant="outlined"
              disabled={newWorkout.category === 'cardio'}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Reps"
              name="reps"
              type="number"
              value={newWorkout.reps}
              onChange={handleInputChange}
              variant="outlined"
              disabled={newWorkout.category === 'cardio'}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Weight (kg)"
              name="weight"
              type="number"
              value={newWorkout.weight}
              onChange={handleInputChange}
              variant="outlined"
              disabled={newWorkout.category === 'cardio' || newWorkout.category === 'bodyweight'}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="Duration (min)"
              name="duration"
              type="number"
              value={newWorkout.duration}
              onChange={handleInputChange}
              variant="outlined"
              disabled={newWorkout.category !== 'cardio'}
            />
          </Grid>

          {/* Muscle Groups Display */}
          {newWorkout.muscleGroups.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {newWorkout.muscleGroups.map((group) => (
                  <Chip 
                    key={group} 
                    label={group} 
                    size="small" 
                    color="primary" 
                  />
                ))}
              </Box>
            </Grid>
          )}

          {/* Add Workout Button */}
          <Grid item xs={12}>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              onClick={handleAddWorkout}
              startIcon={<AddIcon />}
            >
              Add Workout
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box>
        <Typography variant="h6" gutterBottom>
          Workout History
        </Typography>
        {workouts.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No workouts recorded yet. Start by adding your first workout!
          </Typography>
        ) : (
          workouts.map((workout) => (
            <Accordion key={workout.id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs>
                    <Typography variant="subtitle1">
                      {workout.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {workout.category !== 'cardio' && workout.sets && workout.reps && 
                        `${workout.sets} sets × ${workout.reps} reps`}
                      {workout.weight && ` @ ${workout.weight} kg`}
                      {workout.duration && ` for ${workout.duration} min`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Chip 
                      label={workout.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(workout.date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Duration:</strong> {workout.duration} minutes
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Sets:</strong> {workout.sets}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Reps:</strong> {workout.reps}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Weight:</strong> {workout.weight} kg
                    </Typography>
                  </Grid>
                  {workout.muscleGroups && (
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        <strong>Muscle Groups:</strong> {workout.muscleGroups.join(', ')}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteWorkout(workout.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </Container>
  );
};

export default WorkoutTracker;
