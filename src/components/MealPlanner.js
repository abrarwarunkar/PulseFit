import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Add as AddIcon, Psychology as AIIcon } from '@mui/icons-material';
import { getUserData, saveUserData, STORAGE_KEYS } from '../utils/storage';

// Sample meal suggestions for different goals and dietary preferences
const MEAL_SUGGESTIONS = {
  bulking: {
    veg: {
      breakfast: ['Oatmeal with protein powder, banana, and nuts', 'Protein smoothie with fruits and peanut butter'],
      lunch: ['Chickpea curry with brown rice', 'Quinoa bowl with roasted vegetables'],
      dinner: ['Lentil pasta with vegetable sauce', 'Bean and sweet potato burrito bowl'],
      snacks: ['Trail mix', 'Protein shake with almonds']
    },
    nonVeg: {
      breakfast: ['Eggs with whole grain toast and avocado', 'Protein pancakes with Greek yogurt'],
      lunch: ['Chicken breast with brown rice and vegetables', 'Tuna pasta with olive oil'],
      dinner: ['Salmon with quinoa and roasted vegetables', 'Turkey and sweet potato bowl'],
      snacks: ['Greek yogurt with berries', 'Protein bar']
    },
    vegan: {
      breakfast: ['Tofu scramble with vegetables', 'Protein smoothie bowl with plant milk'],
      lunch: ['Tempeh stir-fry with rice', 'Seitan and vegetable bowl'],
      dinner: ['Vegan protein pasta', 'Black bean and quinoa bowl'],
      snacks: ['Vegan protein shake', 'Mixed nuts and dried fruits']
    }
  },
  cutting: {
    veg: {
      breakfast: ['Greek yogurt with berries', 'Egg white omelet with vegetables'],
      lunch: ['Mixed green salad with tofu', 'Vegetable soup with lentils'],
      dinner: ['Roasted vegetables with cottage cheese', 'Zucchini noodles with vegetable sauce'],
      snacks: ['Celery with hummus', 'Apple slices']
    },
    nonVeg: {
      breakfast: ['Egg whites with spinach', 'Turkey bacon with vegetables'],
      lunch: ['Grilled chicken salad', 'Tuna with mixed greens'],
      dinner: ['White fish with steamed vegetables', 'Turkey breast with asparagus'],
      snacks: ['Protein shake', 'Hard-boiled egg']
    },
    vegan: {
      breakfast: ['Protein smoothie with plant milk', 'Overnight oats with chia seeds'],
      lunch: ['Kale and tempeh salad', 'Vegetable soup with beans'],
      dinner: ['Cauliflower rice stir-fry', 'Mushroom and tofu bowl'],
      snacks: ['Carrot sticks with hummus', 'Rice cakes with almond butter']
    }
  },
  maintenance: {
    veg: {
      breakfast: ['Yogurt parfait with granola', 'Vegetable and cheese sandwich'],
      lunch: ['Buddha bowl with tofu', 'Mediterranean salad with feta'],
      dinner: ['Stir-fried vegetables with paneer', 'Vegetable lasagna'],
      snacks: ['Mixed nuts', 'Fruit with yogurt']
    },
    nonVeg: {
      breakfast: ['Scrambled eggs with toast', 'Chicken sandwich'],
      lunch: ['Grilled fish with rice', 'Turkey wrap with vegetables'],
      dinner: ['Lean beef stir-fry', 'Chicken with sweet potato'],
      snacks: ['Protein bar', 'Mixed nuts']
    },
    vegan: {
      breakfast: ['Vegan breakfast burrito', 'Chia seed pudding'],
      lunch: ['Quinoa bowl with roasted vegetables', 'Chickpea wrap'],
      dinner: ['Lentil curry with rice', 'Buddha bowl with tahini dressing'],
      snacks: ['Energy balls', 'Roasted chickpeas']
    }
  }
};

// Add meal nutrition estimates for different types
const MEAL_NUTRITION = {
  bulking: {
    breakfast: { calories: 600, protein: 40, carbs: 70, fats: 20 },
    lunch: { calories: 700, protein: 45, carbs: 80, fats: 25 },
    dinner: { calories: 800, protein: 50, carbs: 90, fats: 30 },
    snacks: { calories: 300, protein: 20, carbs: 30, fats: 15 }
  },
  cutting: {
    breakfast: { calories: 300, protein: 30, carbs: 30, fats: 10 },
    lunch: { calories: 400, protein: 35, carbs: 40, fats: 15 },
    dinner: { calories: 500, protein: 40, carbs: 50, fats: 20 },
    snacks: { calories: 200, protein: 15, carbs: 20, fats: 8 }
  },
  maintenance: {
    breakfast: { calories: 450, protein: 35, carbs: 50, fats: 15 },
    lunch: { calories: 550, protein: 40, carbs: 60, fats: 20 },
    dinner: { calories: 650, protein: 45, carbs: 70, fats: 25 },
    snacks: { calories: 250, protein: 18, carbs: 25, fats: 12 }
  }
};

const MealPlanner = () => {
  const { user } = useUser();
  const [meals, setMeals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    type: 'breakfast',
    ingredients: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [generatedMeal, setGeneratedMeal] = useState(null);
  const [mealPreferences, setMealPreferences] = useState({
    goal: 'maintenance',
    dietType: 'nonVeg'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (user) {
      const userMeals = getUserData(user.id, STORAGE_KEYS.MEALS) || [];
      setMeals(userMeals);
    }
  }, [user]);

  const handleAddMeal = () => {
    if (!user) return;

    const updatedMeals = [...meals, { ...newMeal, id: Date.now() }];
    setMeals(updatedMeals);
    saveUserData(user.id, STORAGE_KEYS.MEALS, updatedMeals);
    setOpenDialog(false);
    setNewMeal({
      name: '',
      type: 'breakfast',
      ingredients: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const generateMealPlan = () => {
    const { goal, dietType } = mealPreferences;
    const suggestions = MEAL_SUGGESTIONS[goal][dietType];
    setGeneratedMeal(suggestions);
    setSnackbar({
      open: true,
      message: 'Meal plan generated successfully!',
      severity: 'success'
    });
  };

  const handleAddGeneratedMeal = (mealType, meal) => {
    if (!user) return;

    const nutrition = MEAL_NUTRITION[mealPreferences.goal][mealType];
    const newMeal = {
      id: Date.now(),
      name: meal,
      date: new Date().toISOString().split('T')[0],
      ...nutrition
    };

    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    saveUserData(user.id, STORAGE_KEYS.MEALS, updatedMeals);
    setSnackbar({
      open: true,
      message: 'Meal added to your list!',
      severity: 'success'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* AI Meal Suggestion Banner */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AIIcon sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h6">Smart Meal Planning</Typography>
                <Typography variant="body2">Get AI-powered personalized meal recommendations</Typography>
              </Box>
            </Box>
            <Button 
              variant="outlined" 
              sx={{ color: 'white', borderColor: 'white' }}
              onClick={() => window.location.href = '/ai-coach'}
            >
              AI Coach
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        mb: 4,
        gap: 2
      }}>
        <Typography variant="h4" sx={{ mb: { xs: 2, sm: 0 } }}>
          Meal Planner
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => window.location.href = '/ai-coach'}
            fullWidth={false}
          >
            🤖 AI Meal Plan
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            fullWidth={false}
          >
            Add Meal
          </Button>
        </Box>
      </Box>



      {/* Existing Meals Display */}
      <Grid container spacing={3}>
        {meals.map((meal) => (
          <Grid item xs={12} sm={6} md={4} key={meal.id}>
            <Card>
              <CardContent sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                <Typography variant="h6" noWrap>{meal.name}</Typography>
                <Typography color="text.secondary">Date: {meal.date}</Typography>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5
                }}>
                  <Typography>Calories: {meal.calories}</Typography>
                  <Typography>Protein: {meal.protein}g</Typography>
                  <Typography>Carbs: {meal.carbs}g</Typography>
                  <Typography>Fats: {meal.fats}g</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Meal Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Meal</DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 2
          }}>
            <FormControl fullWidth>
              <InputLabel>Meal Type</InputLabel>
              <Select
                value={newMeal.type || 'breakfast'}
                onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
              >
                <MenuItem value="breakfast">Breakfast</MenuItem>
                <MenuItem value="lunch">Lunch</MenuItem>
                <MenuItem value="dinner">Dinner</MenuItem>
                <MenuItem value="snack">Snack</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Meal Name"
              fullWidth
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              placeholder="e.g., Grilled Chicken Salad"
            />
            <TextField
              label="Ingredients"
              fullWidth
              multiline
              rows={2}
              value={newMeal.ingredients || ''}
              onChange={(e) => setNewMeal({ ...newMeal, ingredients: e.target.value })}
              placeholder="e.g., Chicken breast, mixed greens, tomatoes, olive oil"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Calories"
                  type="number"
                  fullWidth
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                  placeholder="300"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Protein (g)"
                  type="number"
                  fullWidth
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                  placeholder="25"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Carbs (g)"
                  type="number"
                  fullWidth
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                  placeholder="30"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Fats (g)"
                  type="number"
                  fullWidth
                  value={newMeal.fats}
                  onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
                  placeholder="10"
                />
              </Grid>
            </Grid>
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={newMeal.date}
              onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMeal} variant="contained">
            Add
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

export default MealPlanner;
