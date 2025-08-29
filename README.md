# PulseFit - AI-Powered Fitness App 

PulseFit is a comprehensive AI-powered fitness tracking and wellness application designed to help users maintain a healthy lifestyle through personalized workout plans, smart nutrition recommendations, and intelligent progress monitoring.

## 🤖 AI Features

- **AI Fitness Coach**: Get personalized workout plans and fitness insights
- **Smart Meal Planning**: AI-powered nutrition recommendations based on your goals
- **Intelligent Progress Analysis**: AI-driven insights and recommendations
- **Personalized Coaching**: Tailored advice based on your fitness data

## 🚀 Features

- **Dashboard**: Overview of your fitness journey with AI insights
- **Workout Tracker**: Log workouts with AI-generated exercise plans
- **Meal Planner**: Track nutrition with smart meal suggestions
- **Progress Tracking**: Monitor your fitness goals with AI analysis
- **Goal Setting**: Set and track personalized fitness objectives
- **User Profiles**: Personalized experience with Clerk authentication

## 🛠️ Tech Stack

- **Frontend**: React 18, Material-UI
- **Authentication**: Clerk
- **AI Integration**: Hugging Face Inference API
- **Charts**: Chart.js with React Chart.js 2
- **Routing**: React Router DOM
- **Storage**: Local Storage with user-specific data

## 📋 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd PulseFit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your Clerk publishable key
   - Add your Hugging Face API key (get it from https://huggingface.co/settings/tokens)

4. **Start the development server**
   ```bash
   npm start
   ```

## 🔑 Environment Variables

```env
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
REACT_APP_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

## 🎯 AI Coach Features

### Workout Generation
- Personalized workout plans based on fitness level
- Equipment-specific routines (bodyweight, dumbbells, gym)
- Focus-based training (strength, cardio, flexibility)
- Customizable duration and intensity

### Meal Planning
- Smart meal recommendations for different goals
- Dietary preference support (vegetarian, vegan, non-vegetarian)
- Calorie and macro tracking
- Ingredient suggestions

### Fitness Insights
- Progress analysis and recommendations
- Goal achievement tracking
- Personalized coaching tips
- Motivation and encouragement

## 📱 App Structure

```
src/
├── components/
│   ├── AICoach.js          # AI-powered coaching interface
│   ├── Dashboard.js        # Main dashboard with AI insights
│   ├── WorkoutTracker.js   # Workout logging with AI suggestions
│   ├── MealPlanner.js      # Meal planning with AI recommendations
│   └── ...
├── services/
│   └── aiService.js        # AI integration service
└── utils/
    └── storage.js          # Data persistence utilities
```

## 🚀 Getting Started

1. **Create Profile**: Set up your fitness profile with goals and preferences
2. **Explore AI Coach**: Get personalized workout and meal recommendations
3. **Track Progress**: Log workouts and meals to see AI-powered insights
4. **Stay Motivated**: Receive intelligent coaching tips and progress updates

## 🔮 Future Enhancements

- Advanced AI models for better recommendations
- Integration with fitness wearables
- Social features and community challenges
- Nutrition image recognition
- Voice-activated logging
- Advanced analytics and reporting

