import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { HABITS, CHALLENGE_START_DATE, CHALLENGE_END_DATE } from '../constants/habits.js';

const STORAGE_KEY = 'habit-tracker-data';
const FITNESS_STORAGE_KEY = 'fitness-tracker-data';
const DAILY_METRICS_STORAGE_KEY = 'daily_metrics';

const getStoredData = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  console.log('Raw localStorage data:', storedData);
  return storedData ? JSON.parse(storedData) : {};
};

const saveData = (data) => {
  console.log('Saving to localStorage:', data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getHabitData = () => {
  return getStoredData();
};

export const getHabitStatus = (date, habitId) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const data = getStoredData();
  return data[dateStr]?.[habitId] || false;
};

export const updateHabitStatus = (date, habitId, completed) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const data = getStoredData();
  
  if (!data[dateStr]) {
    data[dateStr] = {};
  }
  
  data[dateStr][habitId] = completed;
  saveData(data);
};

export const getHabitSummary = () => {
  const data = getStoredData();
  return data || {};
};

export const getDayProgress = (date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const data = getStoredData();
  console.log('Storage data for', dateStr, ':', data[dateStr]);
  
  const dayData = data[dateStr] || {};
  const completed = HABITS.filter(habit => dayData[habit.id]).length;
  const total = HABITS.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { completed, total, percentage };
};

export const getWeekSummary = (date) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  const summary = {};

  HABITS.forEach(habit => {
    summary[habit.id] = {
      completed: 0,
      total: 0
    };
  });

  let currentDate = weekStart;
  while (currentDate <= weekEnd) {
    HABITS.forEach(habit => {
      if (getHabitStatus(currentDate, habit.id)) {
        summary[habit.id].completed++;
      }
      summary[habit.id].total++;
    });
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  return summary;
};

export const getOverallSummary = () => {
  const startDate = parseISO(CHALLENGE_START_DATE);
  const endDate = parseISO(CHALLENGE_END_DATE);
  const summary = {};

  HABITS.forEach(habit => {
    summary[habit.id] = {
      completed: 0,
      total: 0
    };
  });

  let currentDate = startDate;
  while (currentDate <= endDate) {
    HABITS.forEach(habit => {
      if (getHabitStatus(currentDate, habit.id)) {
        summary[habit.id].completed++;
      }
      summary[habit.id].total++;
    });
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  return summary;
};

// Fitness data functions
export const getFitnessData = () => {
  const storedData = localStorage.getItem(FITNESS_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : {};
};

export const saveFitnessData = (data) => {
  localStorage.setItem(FITNESS_STORAGE_KEY, JSON.stringify(data));
};

export const updateFitnessData = (data) => {
  saveFitnessData(data);
};

export const getFitnessSummary = () => {
  const data = getFitnessData();
  const summary = {};
  const startDate = parseISO(CHALLENGE_START_DATE);
  const endDate = parseISO(CHALLENGE_END_DATE);
  const today = new Date();
  
  // Initialize summary for each muscle group
  const MUSCLE_GROUPS = [
    'biceps',
    'back',
    'shoulders',
    'chest',
    'legs',
    'abs',
    'triceps'
  ];
  
  MUSCLE_GROUPS.forEach(muscle => {
    summary[muscle] = {
      total: 0,
      weekly: 0
    };
  });

  // Calculate weekly totals for the current week (Sunday to Saturday)
  const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 }); // Saturday
  
  let currentDate = weekStart;
  while (currentDate <= weekEnd) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayData = data[dateStr] || [];
    
    // Count each muscle group's workouts for this day
    MUSCLE_GROUPS.forEach(muscle => {
      if (dayData.includes(muscle)) {
        summary[muscle].weekly++;
      }
    });
    
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  // Calculate overall totals for the entire challenge period
  currentDate = startDate;
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayData = data[dateStr] || [];
    
    // Count each muscle group's workouts for this day
    MUSCLE_GROUPS.forEach(muscle => {
      if (dayData.includes(muscle)) {
        summary[muscle].total++;
      }
    });
    
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  console.log('Fitness Summary Data:', {
    data,
    summary,
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
    today: format(today, 'yyyy-MM-dd'),
    weekStart: format(weekStart, 'yyyy-MM-dd'),
    weekEnd: format(weekEnd, 'yyyy-MM-dd')
  });

  return summary;
};

export const getDailyMetrics = (date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const data = JSON.parse(localStorage.getItem(DAILY_METRICS_STORAGE_KEY) || '{}');
  return data[dateStr] || null;
};

export const updateDailyMetrics = (date, metrics) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const data = JSON.parse(localStorage.getItem(DAILY_METRICS_STORAGE_KEY) || '{}');
  data[dateStr] = metrics;
  localStorage.setItem(DAILY_METRICS_STORAGE_KEY, JSON.stringify(data));
}; 