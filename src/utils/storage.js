// Utility functions for user-specific data storage

// Storage keys constants
export const STORAGE_KEYS = {
  PROFILE: 'userProfile',
  WORKOUTS: 'workouts',
  MEALS: 'meals',
  PROGRESS: 'progress',
  GOALS: 'goals',
  HAS_PROFILE: 'hasProfile',
  LAST_RESET_DATE: 'last_reset_date'
};

// Save data with user-specific key
export const saveUserData = (userId, key, data) => {
  if (!userId) return;
  const userKey = `${key}_${userId}`;
  localStorage.setItem(userKey, JSON.stringify(data));
};

// Get data with user-specific key
export const getUserData = (userId, key) => {
  if (!userId) return null;
  const userKey = `${key}_${userId}`;
  const data = localStorage.getItem(userKey);
  return data ? JSON.parse(data) : null;
};

// Remove data with user-specific key
export const removeUserData = (userId, key) => {
  if (!userId) return;
  const userKey = `${key}_${userId}`;
  localStorage.removeItem(userKey);
};

// Clear all data for a specific user
export const clearUserData = (userId) => {
  if (!userId) return;
  Object.values(STORAGE_KEYS).forEach(key => {
    removeUserData(userId, key);
  });
};

// Check if data needs to be reset for a new day
export const checkAndResetDailyData = (userId) => {
  if (!userId) return;

  const today = new Date().toISOString().split('T')[0];
  const lastResetDate = getUserData(userId, STORAGE_KEYS.LAST_RESET_DATE);

  if (lastResetDate !== today) {
    // Archive previous day's data
    const workouts = getUserData(userId, STORAGE_KEYS.WORKOUTS) || [];
    const meals = getUserData(userId, STORAGE_KEYS.MEALS) || [];

    // Save archived data with date
    const archiveKey = `archive_${lastResetDate || 'old'}`;
    saveUserData(userId, `${archiveKey}_workouts`, workouts);
    saveUserData(userId, `${archiveKey}_meals`, meals);

    // Reset daily data
    saveUserData(userId, STORAGE_KEYS.WORKOUTS, []);
    saveUserData(userId, STORAGE_KEYS.MEALS, []);
    saveUserData(userId, STORAGE_KEYS.LAST_RESET_DATE, today);

    return true; // Data was reset
  }

  return false; // No reset needed
};

// Get archived data for a specific date
export const getArchivedData = (userId, date, dataType) => {
  if (!userId || !date) return null;
  const archiveKey = `archive_${date}`;
  return getUserData(userId, `${archiveKey}_${dataType}`);
};

// Get data for a date range
export const getDataForDateRange = (userId, startDate, endDate, dataType) => {
  if (!userId || !startDate || !endDate) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const data = [];

  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const dayData = getArchivedData(userId, dateStr, dataType) || [];
    data.push({
      date: dateStr,
      data: dayData
    });
  }

  return data;
};

// Default goals
export const DEFAULT_GOALS = {
  weeklyWorkouts: 5,
  dailyCalories: 2000,
  dailyActivityMinutes: 30,
  weightGoal: 70 // Default weight goal in kg
};
