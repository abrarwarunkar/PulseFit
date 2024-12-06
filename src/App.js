import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { Box } from '@mui/material';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import CreateProfile from './components/CreateProfile';
import WorkoutTracker from './components/WorkoutTracker';
import MealPlanner from './components/MealPlanner';
import ProgressTracker from './components/ProgressTracker';
import GoalTracker from './components/GoalTracker';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  
  // Check for user-specific profile completion flag
  const hasProfile = user ? localStorage.getItem(`hasProfile_${user.id}`) : false;

  // If user is newly signed up and hasn't created a profile, redirect to profile creation
  if (user && !hasProfile && window.location.pathname !== '/create-profile') {
    return <Navigate to="/create-profile" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/sign-up"
          element={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
              <SignUp 
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                afterSignUpUrl="/create-profile"
              />
            </Box>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
              <SignIn 
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                afterSignInUrl="/"
              />
            </Box>
          }
        />
        <Route
          path="/create-profile"
          element={
            <>
              <SignedIn>
                <CreateProfile />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          element={
            <>
              <SignedIn>
                <ProtectedRoute>
                  <Layout>
                    <Outlet />
                  </Layout>
                </ProtectedRoute>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/workout" element={<WorkoutTracker />} />
          <Route path="/meal" element={<MealPlanner />} />
          <Route path="/progress" element={<ProgressTracker />} />
          <Route path="/goals" element={<GoalTracker />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;