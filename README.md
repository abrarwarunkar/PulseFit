# PulseFit - AI-Powered Fitness Companion

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-6.1.10-blue.svg)](https://mui.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-orange.svg)](https://clerk.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI-green.svg)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

PulseFit is a comprehensive AI-powered fitness tracking and wellness application designed to help users maintain a healthy lifestyle through personalized workout plans, smart nutrition recommendations, and intelligent progress monitoring.

## 🌟 Key Highlights

- **🤖 AI-Powered Coaching**: Advanced AI generates personalized workout plans and meal recommendations
- **📊 Real-time Analytics**: Comprehensive progress tracking with visual dashboards
- **🔐 Secure Authentication**: Clerk-powered user management and data privacy
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **💾 Offline-First**: Local storage ensures data persistence and offline functionality

## 🚀 Features

### Core Functionality
- **Dashboard**: Comprehensive overview with AI insights and progress metrics
- **AI Fitness Coach**: Intelligent workout and meal plan generation
- **Workout Tracker**: Log and monitor exercise sessions with detailed analytics
- **Meal Planner**: Track nutrition with AI-powered meal suggestions
- **Progress Monitoring**: Visual charts and goal tracking
- **User Profiles**: Personalized experience with customizable fitness goals

### AI-Powered Features
- **Smart Workout Generation**: Personalized plans based on fitness level, equipment, and goals
- **Intelligent Meal Planning**: Calorie-aware meal recommendations with dietary preferences
- **Real-time Insights**: AI-driven analysis and motivational coaching
- **Adaptive Recommendations**: Learning from user progress and preferences

### Technical Features
- **Progressive Web App**: Installable on mobile devices
- **Offline Support**: Core functionality works without internet connection
- **Data Synchronization**: Seamless sync across devices
- **Performance Optimized**: Fast loading with efficient state management

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern JavaScript library for building user interfaces
- **Material-UI 6.1.10** - React components implementing Google's Material Design
- **React Router DOM 6.28.0** - Declarative routing for React applications
- **Chart.js 4.4.7** - Simple yet flexible JavaScript charting library

### Backend & Services
- **Clerk** - Complete user management and authentication solution
- **Groq AI** - Fast AI inference for workout and meal generation
- **Local Storage** - Client-side data persistence

### Development Tools
- **Create React App** - Build setup and development server
- **ESLint** - Code linting and formatting
- **React Testing Library** - Testing utilities for React components

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16.0.0 or higher)
- **npm** (version 7.0.0 or higher) or **yarn**
- **Git** for version control

### API Keys Required
- **Clerk Publishable Key** - For user authentication
- **Groq API Key** - For AI-powered features (optional - app works with fallback)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/pulsefit.git
cd pulsefit
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Groq AI (Optional - app works without it)
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

### 4. Get API Keys

#### Clerk Setup
1. Visit [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the publishable key to your `.env.local` file

#### Groq AI Setup (Optional)
1. Visit [Groq Console](https://console.groq.com/)
2. Create an API key
3. Add it to your `.env.local` file

### 5. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📖 Usage Guide

### Getting Started
1. **Create Profile**: Set up your fitness profile with personal details and goals
2. **Explore Dashboard**: View your fitness overview and AI insights
3. **Generate Plans**: Use AI Coach to create personalized workout and meal plans
4. **Track Progress**: Log workouts and meals to monitor your journey

### Key Workflows

#### AI Workout Generation
1. Navigate to the AI Coach section
2. Select workout preferences (duration, equipment, focus)
3. Click "Generate Workout" for AI-powered recommendations
4. Save and track your personalized workout plan

#### Meal Planning
1. Access the AI Meal Planner
2. Choose meal type (breakfast, lunch, dinner, snack)
3. Generate AI recommendations based on your goals
4. Track nutritional intake with smart suggestions

#### Progress Tracking
1. Use the Dashboard to view daily/weekly progress
2. Monitor goal achievement with visual progress bars
3. Receive AI insights and motivational feedback

## 🏗️ Project Structure

```
pulsefit/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── AICoach.js          # AI-powered coaching interface
│   │   ├── AIStatus.js         # AI service status indicator
│   │   ├── CreateProfile.js    # User profile creation
│   │   ├── CustomSignIn.js     # Authentication components
│   │   ├── CustomSignUp.js
│   │   ├── Dashboard.js        # Main dashboard with analytics
│   │   ├── GoalTracker.js      # Goal setting and tracking
│   │   ├── Layout.js           # App layout and navigation
│   │   ├── MealPlanner.js      # Meal planning interface
│   │   ├── Profile.js          # User profile management
│   │   ├── ProgressTracker.js  # Progress visualization
│   │   └── WorkoutTracker.js   # Workout logging
│   ├── context/
│   │   └── ThemeContext.js     # Theme management
│   ├── services/
│   │   └── aiService.js        # AI integration service
│   ├── theme/
│   │   ├── aiTheme.js          # AI-specific theming
│   │   └── sportTheme.js       # Sports-themed components
│   ├── utils/
│   │   └── storage.js          # Data persistence utilities
│   ├── App.css
│   ├── App.js                  # Main application component
│   ├── index.css
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── vercel.json
```

## 🔧 API Documentation

### AI Service Methods

#### `generateWorkoutPlan(userProfile, preferences)`
Generates personalized workout plans based on user profile and preferences.

**Parameters:**
- `userProfile`: Object containing user details (age, gender, height, weight, goals)
- `preferences`: Object with workout preferences (duration, equipment, focus)

**Returns:** Promise resolving to workout plan object

#### `generateMealPlan(userProfile, mealType)`
Creates personalized meal recommendations.

**Parameters:**
- `userProfile`: User profile object
- `mealType`: String ('breakfast', 'lunch', 'dinner', 'snack')

**Returns:** Promise resolving to meal recommendation object

#### `generateFitnessInsights(userData)`
Analyzes user data to provide personalized insights.

**Parameters:**
- `userData`: Object containing workouts, meals, goals, and profile

**Returns:** Array of insight strings

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Build
```bash
npm run build
```

Serve the `build` folder with any static server.

## 🧪 Testing

```bash
npm test
```

Runs the test suite using React Testing Library.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks guidelines
- Use Material-UI components for consistent UI
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Clerk** for seamless authentication
- **Groq** for fast AI inference
- **Material-UI** for beautiful React components
- **Chart.js** for data visualization
- **React Community** for excellent documentation and tools

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Made with ❤️ for fitness enthusiasts worldwide**

*Transform your fitness journey with the power of AI*

