import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Psychology,
  FitnessCenter,
  Restaurant,
  TrendingUp,
  AutoAwesome,
  PlayArrow,
  Add
} from '@mui/icons-material';
import { aiService } from '../services/aiService';
import { getUserData, saveUserData, STORAGE_KEYS } from '../utils/storage';

const AICoach = () => {
  // Mock user for demo
  const user = { id: 'demo-user' };
  
  // Demo profile data
  const demoProfile = {
    age: 25,
    gender: 'male',
    height: 175,
    weight: 70,
    fitnessGoal: 'muscle_gain',
    activityLevel: 'moderately_active'
  };

  const [profile, setProfile] = useState(demoProfile);
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [goals, setGoals] = useState({ dailyCalories: 2500, weeklyWorkouts: 4 });
  const [insights, setInsights] = useState([
    "Welcome to AI Coach! Let's start your fitness journey.",
    "Set realistic goals and stay consistent for best results.",
    "Track your progress to stay motivated and see improvements."
  ]);
  const [loading, setLoading] = useState(false);
  const [workoutDialog, setWorkoutDialog] = useState(false);
  const [mealDialog, setMealDialog] = useState(false);
  const [workoutPrefs, setWorkoutPrefs] = useState({
    duration: 30,
    equipment: 'bodyweight',
    focus: 'general'
  });
  const [mealType, setMealType] = useState('lunch');
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [generatedMeal, setGeneratedMeal] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const userProfile = getUserData(user.id, STORAGE_KEYS.PROFILE) || demoProfile;
    const userWorkouts = getUserData(user.id, STORAGE_KEYS.WORKOUTS) || [];
    const userMeals = getUserData(user.id, STORAGE_KEYS.MEALS) || [];
    const userGoals = getUserData(user.id, STORAGE_KEYS.GOALS) || { dailyCalories: 2500, weeklyWorkouts: 4 };

    setProfile(userProfile);
    setWorkouts(userWorkouts);
    setMeals(userMeals);
    setGoals(userGoals);
  };

  const generateInsights = async () => {
    setLoading(true);
    try {
      const userData = {
        workouts,
        meals,
        goals,
        profile
      };
      
      const aiInsights = await aiService.generateFitnessInsights(userData);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights([
        "Stay consistent with your workouts for best results!",
        "Focus on balanced nutrition to fuel your fitness goals.",
        "Track your progress weekly to stay motivated."
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWorkout = async () => {
    setLoading(true);
    try {
      const enhancedProfile = {
        ...profile,
        fitnessLevel: profile.activityLevel === 'sedentary' || profile.activityLevel === 'lightly_active' ? 'beginner' :
                     profile.activityLevel === 'moderately_active' ? 'intermediate' : 'advanced',
        goals: profile.fitnessGoal
      };
      const workout = await aiService.generateWorkoutPlan(enhancedProfile, workoutPrefs);
      setGeneratedWorkout(workout);
    } catch (error) {
      console.error('Error generating workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMeal = async () => {
    setLoading(true);
    try {
      const enhancedProfile = {
        ...profile,
        goals: profile.fitnessGoal,
        dailyCalories: goals.dailyCalories || 2000
      };
      const meal = await aiService.generateMealPlan(enhancedProfile, mealType);
      setGeneratedMeal(meal);
    } catch (error) {
      console.error('Error generating meal:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGeneratedWorkout = () => {
    if (!generatedWorkout) return;
    
    const newWorkout = {
      id: Date.now(),
      name: generatedWorkout.title,
      type: 'AI Generated',
      duration: workoutPrefs.duration,
      exercises: generatedWorkout.exercises,
      date: new Date().toISOString(),
      aiGenerated: true
    };
    
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    saveUserData(user.id, STORAGE_KEYS.WORKOUTS, updatedWorkouts);
    setWorkoutDialog(false);
    setGeneratedWorkout(null);
  };

  const saveGeneratedMeal = () => {
    if (!generatedMeal) return;
    
    const newMeal = {
      id: Date.now(),
      name: generatedMeal.name,
      type: mealType,
      calories: generatedMeal.calories,
      ingredients: generatedMeal.ingredients,
      date: new Date().toISOString(),
      aiGenerated: true
    };
    
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    saveUserData(user.id, STORAGE_KEYS.MEALS, updatedMeals);
    setMealDialog(false);
    setGeneratedMeal(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* AI Header */}
      <Box sx={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(0, 230, 118, 0.1) 100%)',
        borderRadius: 4,
        p: 4,
        mb: 4,
        textAlign: 'center',
        overflow: 'hidden',
        border: '1px solid rgba(255, 107, 53, 0.2)',
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Psychology sx={{ 
              fontSize: 50, 
              mr: 2, 
              color: 'primary.main',
              filter: 'drop-shadow(0 0 10px rgba(255, 107, 53, 0.5))'
            }} />
            <Typography variant="h4" sx={{ 
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'primary.main'
            }}>
              AI Fitness Coach
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ 
            color: 'text.secondary',
            fontWeight: 400,
            opacity: 0.9
          }}>
            🤖 Powered by Advanced AI • Personalized for You • Real-time Insights
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* AI Insights */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ 
                  mr: 2, 
                  color: 'primary.main',
                  fontSize: 28
                }} />
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  color: 'primary.main'
                }}>
                  🧠 AI Insights
                </Typography>
                <Button 
                  size="small" 
                  onClick={generateInsights}
                  disabled={loading}
                  sx={{ ml: 'auto' }}
                >
                  {loading ? <CircularProgress size={20} /> : '🔄 Refresh'}
                </Button>
              </Box>
              <List>
                {insights.map((insight, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <AutoAwesome color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={insight} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Workout Generator */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FitnessCenter sx={{ 
                  mr: 2, 
                  color: 'primary.main',
                  fontSize: 32
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  color: 'primary.main'
                }}>
                  💪 AI Workout Generator
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ 
                color: 'text.secondary', 
                mb: 3,
                flexGrow: 1
              }}>
                Generate personalized workouts powered by AI based on your fitness level, goals, and available equipment
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setWorkoutDialog(true)}
                startIcon={<PlayArrow />}
                sx={{ py: 1.5 }}
              >
                🚀 Generate Workout
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Meal Planner */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Restaurant sx={{ 
                  mr: 2, 
                  color: 'secondary.main',
                  fontSize: 32
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  color: 'secondary.main'
                }}>
                  🍽️ AI Meal Planner
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ 
                color: 'text.secondary', 
                mb: 3,
                flexGrow: 1
              }}>
                Get smart meal recommendations tailored to your dietary needs and fitness goals using advanced AI
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setMealDialog(true)}
                startIcon={<PlayArrow />}
                sx={{ py: 1.5 }}
              >
                🎯 Generate Meal Plan
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workout Generator Dialog */}
      <Dialog open={workoutDialog} onClose={() => setWorkoutDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>AI Workout Generator</DialogTitle>
        <DialogContent>
          {!generatedWorkout ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={workoutPrefs.duration}
                  onChange={(e) => setWorkoutPrefs({...workoutPrefs, duration: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Equipment</InputLabel>
                  <Select
                    value={workoutPrefs.equipment}
                    onChange={(e) => setWorkoutPrefs({...workoutPrefs, equipment: e.target.value})}
                  >
                    <MenuItem value="bodyweight">Bodyweight</MenuItem>
                    <MenuItem value="dumbbells">Dumbbells</MenuItem>
                    <MenuItem value="gym">Full Gym</MenuItem>
                    <MenuItem value="resistance-bands">Resistance Bands</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Focus</InputLabel>
                  <Select
                    value={workoutPrefs.focus}
                    onChange={(e) => setWorkoutPrefs({...workoutPrefs, focus: e.target.value})}
                  >
                    <MenuItem value="general">General Fitness</MenuItem>
                    <MenuItem value="strength">Strength</MenuItem>
                    <MenuItem value="cardio">Cardio</MenuItem>
                    <MenuItem value="flexibility">Flexibility</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6">{generatedWorkout.title}</Typography>
                {generatedWorkout.aiGenerated ? (
                  <Chip 
                    icon={<Psychology />} 
                    label="🤖 AI Generated" 
                    size="small" 
                    color="primary"
                  />
                ) : (
                  <Chip 
                    label={generatedWorkout.rateLimited ? "⏱️ Rate Limited" : "📋 Smart Fallback"}
                    size="small" 
                    color="warning"
                  />
                )}
              </Box>
              <Chip label={`${workoutPrefs.duration} minutes`} sx={{ mb: 2 }} />
              <List>
                {generatedWorkout.exercises?.map((exercise, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={exercise.name}
                      secondary={`${exercise.sets} sets × ${exercise.reps} - ${exercise.instructions}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWorkoutDialog(false)}>Cancel</Button>
          {!generatedWorkout ? (
            <Button onClick={handleGenerateWorkout} disabled={loading} variant="contained">
              {loading ? <CircularProgress size={20} /> : 'Generate'}
            </Button>
          ) : (
            <Button onClick={saveGeneratedWorkout} variant="contained" startIcon={<Add />}>
              Add to Workouts
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Meal Generator Dialog */}
      <Dialog open={mealDialog} onClose={() => setMealDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>AI Meal Planner</DialogTitle>
        <DialogContent>
          {!generatedMeal ? (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Meal Type</InputLabel>
              <Select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              >
                <MenuItem value="breakfast">Breakfast</MenuItem>
                <MenuItem value="lunch">Lunch</MenuItem>
                <MenuItem value="dinner">Dinner</MenuItem>
                <MenuItem value="snack">Snack</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6">{generatedMeal.name}</Typography>
                {generatedMeal.aiGenerated ? (
                  <Chip 
                    icon={<Psychology />} 
                    label="🤖 AI Generated" 
                    size="small" 
                    color="secondary"
                  />
                ) : (
                  <Chip 
                    label={generatedMeal.rateLimited ? "⏱️ Rate Limited" : "📋 Smart Fallback"}
                    size="small" 
                    color="warning"
                  />
                )}
              </Box>
              <Chip label={`${generatedMeal.calories} calories`} color="primary" sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>Ingredients:</strong> {generatedMeal.ingredients}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMealDialog(false)}>Cancel</Button>
          {!generatedMeal ? (
            <Button onClick={handleGenerateMeal} disabled={loading} variant="contained">
              {loading ? <CircularProgress size={20} /> : 'Generate'}
            </Button>
          ) : (
            <Button onClick={saveGeneratedMeal} variant="contained" startIcon={<Add />}>
              Add to Meals
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AICoach;