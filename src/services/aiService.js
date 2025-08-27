import Groq from 'groq-sdk';

console.log('🔑 GROQ API KEY:', process.env.REACT_APP_GROQ_API_KEY ? 'Found' : 'Missing');
console.log('🔑 Key starts with:', process.env.REACT_APP_GROQ_API_KEY?.substring(0, 10));

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Check if API key is available
if (!process.env.REACT_APP_GROQ_API_KEY) {
  console.warn('⚠️ GROQ API KEY NOT FOUND - Using fallback responses');
}

export const aiService = {
  // Generate personalized workout plan
  async generateWorkoutPlan(userProfile, preferences = {}) {
    console.log('🤖 AI WORKOUT: Starting generation with profile:', userProfile);
    
    const prompt = `Create a personalized ${preferences.duration || 30} minute workout for:
- Age: ${userProfile.age} years old
- Gender: ${userProfile.gender}
- Height: ${userProfile.height}cm, Weight: ${userProfile.weight}kg
- Fitness Goal: ${userProfile.fitnessGoal}
- Activity Level: ${userProfile.activityLevel}
- Equipment: ${preferences.equipment || 'bodyweight'}
- Focus: ${preferences.focus || 'general'}

Generate 4-5 specific exercises with sets, reps, and detailed instructions tailored to this profile.`;

    console.log('🤖 AI PROMPT:', prompt);

    try {
      console.log('🤖 Calling Groq API...');
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 200
      });
      
      console.log('✅ AI RESPONSE:', response);
      const result = this.parseWorkoutResponse(response.choices[0].message.content, preferences);
      result.aiGenerated = true;
      result.profileUsed = `${userProfile.age}yr ${userProfile.gender}, ${userProfile.fitnessGoal}`;
      return result;
    } catch (error) {
      console.error('❌ AI FAILED:', error);
      const fallback = this.getFallbackWorkout(userProfile, preferences);
      fallback.aiGenerated = false;
      fallback.profileUsed = `Smart Fallback for ${userProfile.age}yr ${userProfile.gender}`;
      fallback.rateLimited = error.message?.includes('Rate limit');
      return fallback;
    }
  },

  // Generate meal recommendations
  async generateMealPlan(userProfile, mealType = 'lunch') {
    console.log('🍽️ AI MEAL: Starting generation for', mealType, 'with profile:', userProfile);
    
    const prompt = `Create a personalized ${mealType} meal for:
- Age: ${userProfile.age} years, Gender: ${userProfile.gender}
- Height: ${userProfile.height}cm, Weight: ${userProfile.weight}kg
- Fitness Goal: ${userProfile.fitnessGoal}
- Activity Level: ${userProfile.activityLevel}
- Target Calories: ${userProfile.dailyCalories || 2000} per day

Suggest a specific meal with name, ingredients, and calorie count tailored to this profile.`;

    console.log('🍽️ AI PROMPT:', prompt);

    try {
      console.log('🍽️ Calling Groq API...');
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.6,
        max_tokens: 150
      });
      
      console.log('✅ AI MEAL RESPONSE:', response);
      const result = this.parseMealResponse(response.choices[0].message.content, mealType, userProfile);
      result.aiGenerated = true;
      result.profileUsed = `${userProfile.age}yr ${userProfile.gender}, ${userProfile.fitnessGoal}`;
      return result;
    } catch (error) {
      console.error('❌ AI MEAL FAILED:', error);
      const fallback = this.getFallbackMeal(mealType, userProfile);
      fallback.aiGenerated = false;
      fallback.profileUsed = `Smart Fallback for ${userProfile.age}yr ${userProfile.gender}`;
      fallback.rateLimited = error.message?.includes('Rate limit');
      return fallback;
    }
  },

  // Generate fitness insights
  async generateFitnessInsights(userData) {
    const { workouts, meals, goals, profile } = userData;
    const prompt = `Analyze fitness data for personalized insights:
User Profile:
- Age: ${profile.age}, Gender: ${profile.gender}
- Height: ${profile.height}cm, Weight: ${profile.weight}kg
- Fitness Goal: ${profile.fitnessGoal}
- Activity Level: ${profile.activityLevel}

Current Progress:
- Workouts completed: ${workouts.length}/${goals.weeklyWorkouts} weekly goal
- Meals tracked: ${meals.length}
- Average calories: ${meals.length > 0 ? Math.round(meals.reduce((sum, m) => sum + (parseInt(m.calories) || 0), 0) / meals.length) : 0}

Provide 2-3 specific, actionable insights based on this profile and progress.`;

    try {
      console.log('🧠 Calling Groq API...');
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.6,
        max_tokens: 180
      });
      
      console.log('✅ AI INSIGHTS RESPONSE:', response);
      const result = this.parseInsightsResponse(response.choices[0].message.content, userData);
      return result;
    } catch (error) {
      console.error('❌ AI INSIGHTS FAILED:', error);
      const fallbackInsights = this.getFallbackInsights(userData);
      if (error.message?.includes('Rate limit')) {
        fallbackInsights.unshift('⏱️ AI is temporarily rate-limited. Using smart recommendations based on your profile.');
      }
      return fallbackInsights;
    }
  },

  // Helper methods
  parseWorkoutResponse(text, preferences) {
    // Try to extract workout from AI response
    const lines = text.split('\n').filter(line => line.trim());
    const exercises = [];
    
    // Simple parsing - look for exercise patterns
    lines.forEach(line => {
      if (line.includes('sets') || line.includes('reps') || line.includes(':')) {
        const parts = line.split(/[:-]/);
        if (parts.length >= 2) {
          exercises.push({
            name: parts[0].trim(),
            sets: 3,
            reps: parts[1].trim() || '10-15',
            instructions: parts[2]?.trim() || 'Perform with proper form'
          });
        }
      }
    });
    
    // If parsing fails, use fallback
    if (exercises.length === 0) {
      const fallback = this.getFallbackWorkout({ activityLevel: 'moderate' }, preferences);
      return { ...fallback, aiGenerated: false };
    }
    
    return {
      title: `AI Generated ${preferences.equipment || 'Bodyweight'} Workout`,
      duration: preferences.duration || 30,
      exercises: exercises.slice(0, 5),
      difficulty: 'AI Personalized',
      aiGenerated: true,
      profileUsed: `Generated by AI`
    };
  },

  parseMealResponse(text, mealType, userProfile) {
    console.log('🍽️ PARSING AI RESPONSE:', text);
    
    // Extract meal name (first meaningful line)
    const lines = text.split('\n').filter(line => line.trim());
    let mealName = `AI ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`;
    let ingredients = '';
    let calories = 0;
    
    // Look for meal name in first few lines
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i].trim();
      if (line && !line.toLowerCase().includes('here') && !line.toLowerCase().includes('breakdown')) {
        // Clean up the meal name
        mealName = line.replace(/^(meal|recipe|suggestion):/gi, '').replace(/[*#-]/g, '').trim();
        if (mealName.length > 5) break;
      }
    }
    
    // Extract ingredients (look for lines with commas or ingredient keywords)
    lines.forEach(line => {
      const lower = line.toLowerCase();
      if ((lower.includes('ingredients') || lower.includes('recipe') || line.includes(',')) && 
          !lower.includes('calorie') && line.length > 10) {
        ingredients = line.replace(/ingredients?:?/gi, '').replace(/recipe:?/gi, '').trim();
      }
    });
    
    // Extract calories
    const calorieMatch = text.match(/(\d+)\s*(cal|kcal|calories)/i);
    if (calorieMatch) {
      calories = parseInt(calorieMatch[1]);
    }
    
    // Fallback if parsing completely fails
    if (!ingredients || ingredients.length < 5) {
      const fallback = this.getFallbackMeal(mealType, userProfile);
      return {
        ...fallback,
        name: mealName.length > 5 ? mealName : fallback.name,
        calories: calories > 0 ? calories : fallback.calories,
        aiGenerated: true,
        profileUsed: `${userProfile.age}yr ${userProfile.gender}, ${userProfile.fitnessGoal}`
      };
    }
    
    return {
      name: mealName,
      ingredients: ingredients,
      calories: calories || 400,
      aiGenerated: true,
      profileUsed: `${userProfile.age}yr ${userProfile.gender}, ${userProfile.fitnessGoal}`
    };
  },

  parseInsightsResponse(text, userData) {
    // Try to extract insights from AI response
    const lines = text.split('\n').filter(line => line.trim() && line.length > 20);
    const insights = [];
    
    // Extract meaningful sentences
    lines.forEach(line => {
      if (line.includes('.') && (line.includes('workout') || line.includes('nutrition') || line.includes('goal'))) {
        insights.push(line.trim());
      }
    });
    
    // If parsing fails, use fallback
    if (insights.length === 0) {
      return this.getFallbackInsights(userData);
    }
    
    return insights.slice(0, 3);
  },

  getFallbackWorkout(userProfile, preferences) {
    const { equipment = 'bodyweight', focus = 'general', duration = 30 } = preferences;
    const activityLevel = userProfile.activityLevel || 'moderately_active';
    
    const workoutsByEquipment = {
      bodyweight: {
        title: `${duration}-Min Bodyweight Workout`,
        exercises: [
          { name: 'Push-ups', sets: 3, reps: '8-15', instructions: 'Keep body straight, modify on knees if needed' },
          { name: 'Squats', sets: 3, reps: '12-20', instructions: 'Feet shoulder-width apart, sit back like sitting in chair' },
          { name: 'Plank', sets: 3, reps: '20-60 seconds', instructions: 'Hold straight line from head to heels' },
          { name: 'Lunges', sets: 3, reps: '10 each leg', instructions: 'Step forward, lower back knee toward ground' }
        ]
      },
      dumbbells: {
        title: `${duration}-Min Dumbbell Workout`,
        exercises: [
          { name: 'Dumbbell Press', sets: 3, reps: '8-12', instructions: 'Press weights overhead, control the movement' },
          { name: 'Dumbbell Rows', sets: 3, reps: '10-15', instructions: 'Pull weights to chest, squeeze shoulder blades' },
          { name: 'Goblet Squats', sets: 3, reps: '12-15', instructions: 'Hold weight at chest, squat down' },
          { name: 'Dumbbell Deadlifts', sets: 3, reps: '10-12', instructions: 'Hinge at hips, keep back straight' }
        ]
      },
      gym: {
        title: `${duration}-Min Gym Workout`,
        exercises: [
          { name: 'Bench Press', sets: 3, reps: '8-12', instructions: 'Control weight down to chest, press up' },
          { name: 'Lat Pulldowns', sets: 3, reps: '10-15', instructions: 'Pull bar to chest, squeeze back muscles' },
          { name: 'Leg Press', sets: 3, reps: '12-20', instructions: 'Press weight with legs, full range of motion' },
          { name: 'Cable Rows', sets: 3, reps: '10-15', instructions: 'Pull handle to torso, keep back straight' }
        ]
      }
    };
    
    return workoutsByEquipment[equipment] || workoutsByEquipment.bodyweight;
  },

  getFallbackMeal(mealType, userProfile = {}) {
    const goal = userProfile.fitnessGoal || 'maintenance';
    
    const mealsByGoal = {
      weight_loss: {
        breakfast: { name: 'Greek Yogurt Bowl', calories: 280, ingredients: 'Greek yogurt, berries, chia seeds, honey' },
        lunch: { name: 'Grilled Chicken Salad', calories: 350, ingredients: 'Chicken breast, mixed greens, vegetables, olive oil dressing' },
        dinner: { name: 'Baked Fish with Vegetables', calories: 400, ingredients: 'White fish, steamed broccoli, quinoa' },
        snack: { name: 'Celery with Almond Butter', calories: 150, ingredients: 'Celery sticks, natural almond butter' }
      },
      muscle_gain: {
        breakfast: { name: 'Protein Pancakes', calories: 450, ingredients: 'Oats, protein powder, banana, eggs, milk' },
        lunch: { name: 'Chicken Rice Bowl', calories: 600, ingredients: 'Chicken breast, brown rice, vegetables, avocado' },
        dinner: { name: 'Salmon with Sweet Potato', calories: 650, ingredients: 'Salmon fillet, roasted sweet potato, asparagus' },
        snack: { name: 'Protein Smoothie', calories: 300, ingredients: 'Protein powder, banana, peanut butter, milk' }
      },
      maintenance: {
        breakfast: { name: 'Oatmeal with Fruits', calories: 350, ingredients: 'Oats, mixed berries, nuts, honey' },
        lunch: { name: 'Turkey Sandwich', calories: 450, ingredients: 'Whole grain bread, turkey, vegetables, hummus' },
        dinner: { name: 'Lean Beef Stir-fry', calories: 500, ingredients: 'Lean beef, mixed vegetables, brown rice' },
        snack: { name: 'Apple with Peanut Butter', calories: 200, ingredients: 'Apple slices, natural peanut butter' }
      }
    };
    
    const goalMeals = mealsByGoal[goal] || mealsByGoal.maintenance;
    return goalMeals[mealType] || goalMeals.lunch;
  },

  getFallbackInsights(userData) {
    const { workouts = [], meals = [], goals = {}, profile = {} } = userData;
    const insights = [];
    
    // Workout insights
    if (workouts.length === 0) {
      insights.push("Ready to start your fitness journey? Begin with 2-3 workouts this week to build momentum!");
    } else if (workouts.length < (goals.weeklyWorkouts || 3)) {
      insights.push(`Great start! You've completed ${workouts.length} workouts. Try to reach your goal of ${goals.weeklyWorkouts || 3} workouts this week.`);
    } else {
      insights.push("Excellent consistency with your workouts! Consider gradually increasing intensity or trying new exercises.");
    }
    
    // Nutrition insights
    const avgCalories = meals.length > 0 ? meals.reduce((sum, m) => sum + (parseInt(m.calories) || 0), 0) / meals.length : 0;
    const targetCalories = goals.dailyCalories || 2000;
    
    if (meals.length === 0) {
      insights.push("Start tracking your meals to get personalized nutrition insights and reach your goals faster!");
    } else if (avgCalories < targetCalories * 0.8) {
      insights.push("Consider adding more nutrient-dense calories to fuel your workouts and recovery.");
    } else if (avgCalories > targetCalories * 1.2) {
      insights.push("Focus on portion control and choosing nutrient-dense foods to align with your goals.");
    } else {
      insights.push("Your nutrition tracking is on point! Keep maintaining this balanced approach.");
    }
    
    // Goal-specific insights
    if (profile.fitnessGoal === 'weight_loss') {
      insights.push("For weight loss, combine regular cardio with strength training and maintain a slight caloric deficit.");
    } else if (profile.fitnessGoal === 'muscle_gain') {
      insights.push("Focus on progressive overload in your workouts and ensure adequate protein intake for muscle growth.");
    } else {
      insights.push("Maintain a balanced approach with both cardio and strength training for overall fitness.");
    }
    
    return insights.slice(0, 3); // Return max 3 insights
  },

  calculateProgress(userData) {
    const { workouts, goals } = userData;
    const workoutProgress = (workouts.length / goals.weeklyWorkouts) * 100;
    return Math.min(workoutProgress, 100);
  }
};