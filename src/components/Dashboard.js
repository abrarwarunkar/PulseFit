import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import {
  FitnessCenter,
  Restaurant,
  TrendingUp,
  Timer,
  Edit as EditIcon
} from '@mui/icons-material';
import {
  getUserData,
  saveUserData,
  STORAGE_KEYS,
  checkAndResetDailyData,
  getArchivedData,
  DEFAULT_GOALS
} from '../utils/storage';

const Dashboard = () => {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [profile, setProfile] = useState(null);
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [editDialog, setEditDialog] = useState({
    open: false,
    type: null,
    value: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    if (user) {
      // Check for daily reset
      const wasReset = checkAndResetDailyData(user.id);
      if (wasReset) {
        setSnackbar({
          open: true,
          message: 'Data has been reset for a new day!',
          severity: 'info'
        });
      }

      // Load data for selected date
      loadDataForDate(selectedDate);
      
      // Load user goals
      const userGoals = getUserData(user.id, STORAGE_KEYS.GOALS);
      if (userGoals) {
        setGoals(userGoals);
      }
    }
  }, [user, selectedDate]);

  const loadDataForDate = (date) => {
    const dateStr = date;
    const today = new Date().toISOString().split('T')[0];

    if (dateStr === today) {
      // Load current day's data
      const userWorkouts = getUserData(user.id, STORAGE_KEYS.WORKOUTS) || [];
      const userMeals = getUserData(user.id, STORAGE_KEYS.MEALS) || [];
      const userProfile = getUserData(user.id, STORAGE_KEYS.PROFILE);
      const userGoals = getUserData(user.id, STORAGE_KEYS.GOALS) || DEFAULT_GOALS;

      setWorkouts(userWorkouts);
      setMeals(userMeals);
      setProfile(userProfile);
      setGoals(userGoals);
    } else {
      // Load archived data
      setWorkouts(getArchivedData(user.id, dateStr, 'workouts') || []);
      setMeals(getArchivedData(user.id, dateStr, 'meals') || []);
    }
  };

  const getRecentWorkouts = () => {
    return workouts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const getRecentMeals = () => {
    return meals
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const calculateDailyStats = () => {
    const today = selectedDate;
    const todayWorkouts = workouts.filter(w => w.date.startsWith(today));
    const todayMeals = meals.filter(m => m.date.startsWith(today));

    return {
      workouts: todayWorkouts.length,
      calories: todayMeals.reduce((sum, meal) => sum + (parseInt(meal.calories) || 0), 0),
      totalWorkoutMinutes: todayWorkouts.reduce((sum, workout) => sum + (parseInt(workout.duration) || 0), 0),
    };
  };

  const handleEditClick = (type, currentValue) => {
    setEditDialog({
      open: true,
      type,
      value: currentValue.toString()
    });
  };

  const handleCloseDialog = () => {
    setEditDialog({
      open: false,
      type: null,
      value: ''
    });
  };

  const handleSaveGoal = () => {
    if (!user) return;

    const newValue = Number(editDialog.value);
    if (isNaN(newValue) || newValue <= 0) return;

    const newGoals = {
      ...goals,
      [editDialog.type]: newValue
    };

    setGoals(newGoals);
    saveUserData(user.id, STORAGE_KEYS.GOALS, newGoals);
    handleCloseDialog();
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.firstName || user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User';
  };

  if (!user) return null;

  const dailyStats = calculateDailyStats();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Date Selection */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            inputProps={{
              max: new Date().toISOString().split('T')[0]
            }}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          >
            Today
          </Button>
        </Box>
      </Paper>

      {/* Welcome Section */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to PulseFit, {getUserDisplayName()}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {selectedDate === new Date().toISOString().split('T')[0]
              ? "Here's your health and fitness overview for today"
              : `Viewing data for ${new Date(selectedDate).toLocaleDateString()}`}
          </Typography>
        </Paper>
      </Grid>

      {/* Daily Stats */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Timer sx={{ mr: 1 }} />
            <Typography variant="h6">Today's Activity</Typography>
          </Box>
          <List>
            <ListItem>
              <ListItemText 
                primary="Workouts Completed"
                secondary={dailyStats.workouts}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Total Workout Minutes"
                secondary={`${dailyStats.totalWorkoutMinutes} mins`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Calories Consumed"
                secondary={`${dailyStats.calories} kcal`}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      {/* Recent Workouts */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FitnessCenter sx={{ mr: 1 }} />
            <Typography variant="h6">Recent Workouts</Typography>
          </Box>
          <List>
            {getRecentWorkouts().length > 0 ? (
              getRecentWorkouts().map((workout, index) => (
                <React.Fragment key={workout.id}>
                  <ListItem>
                    <ListItemText
                      primary={workout.name}
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(workout.date).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip 
                              label={`${workout.duration} mins`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                            <Chip 
                              label={workout.type} 
                              size="small" 
                              color="secondary" 
                              variant="outlined"
                            />
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < getRecentWorkouts().length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Typography color="text.secondary" align="center">
                No recent workouts
              </Typography>
            )}
          </List>
        </Paper>
      </Grid>

      {/* Recent Meals */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Restaurant sx={{ mr: 1 }} />
            <Typography variant="h6">Recent Meals</Typography>
          </Box>
          <List>
            {getRecentMeals().length > 0 ? (
              getRecentMeals().map((meal, index) => (
                <React.Fragment key={meal.id}>
                  <ListItem>
                    <ListItemText
                      primary={meal.name}
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(meal.date).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip 
                              label={`${meal.calories} kcal`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                            <Chip 
                              label={meal.type} 
                              size="small" 
                              color="secondary" 
                              variant="outlined"
                            />
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < getRecentMeals().length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Typography color="text.secondary" align="center">
                No recent meals
              </Typography>
            )}
          </List>
        </Paper>
      </Grid>

      {/* Progress Section */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUp sx={{ mr: 1 }} />
            <Typography variant="h6">Progress Overview</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">
                    Weekly Workout Goal
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditClick('weeklyWorkouts', goals.weeklyWorkouts)}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(workouts.length / goals.weeklyWorkouts) * 100} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {workouts.length} of {goals.weeklyWorkouts} workouts
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">
                    Daily Calorie Goal
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditClick('dailyCalories', goals.dailyCalories)}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(dailyStats.calories / goals.dailyCalories) * 100} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {dailyStats.calories} of {goals.dailyCalories} calories
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">
                    Activity Minutes Goal
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditClick('dailyActivityMinutes', goals.dailyActivityMinutes)}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(dailyStats.totalWorkoutMinutes / goals.dailyActivityMinutes) * 100} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {dailyStats.totalWorkoutMinutes} of {goals.dailyActivityMinutes} minutes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">
                    Weight Goal
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditClick('weightGoal', goals.weightGoal)}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={((profile?.currentWeight || 0) / goals.weightGoal) * 100} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {profile?.currentWeight || 0} of {goals.weightGoal} kg
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Edit Goal Dialog */}
      <Dialog open={editDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>
          Edit {editDialog.type === 'weeklyWorkouts' ? 'Weekly Workout' : 
                editDialog.type === 'dailyCalories' ? 'Daily Calorie' : 
                editDialog.type === 'dailyActivityMinutes' ? 'Activity Minutes' : 
                'Weight'} Goal
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Goal"
            type="number"
            fullWidth
            value={editDialog.value}
            onChange={(e) => setEditDialog(prev => ({ ...prev, value: e.target.value }))}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveGoal} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
