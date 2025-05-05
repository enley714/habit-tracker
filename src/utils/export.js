import { format, parseISO, getDay } from 'date-fns';
import { getHabitData, getFitnessData, getDailyMetrics, getOverallSummary } from './storage';
import { CHALLENGE_START_DATE, CHALLENGE_END_DATE, HABITS } from '../constants/habits';

const formatDate = (date) => format(date, 'yyyy-MM-dd');
const getDayOfWeek = (date) => format(date, 'EEEE');

export const exportChallengeData = () => {
  // Force a refresh of all data
  const startDate = parseISO(CHALLENGE_START_DATE);
  const endDate = parseISO(CHALLENGE_END_DATE);
  
  // Get fresh data from storage
  const habitData = getHabitData();
  const fitnessData = getFitnessData();
  const overallSummary = getOverallSummary();
  
  console.log('Exporting data:', {
    habitData,
    fitnessData,
    overallSummary
  });
  
  // Create headers for the CSV
  const headers = [
    'Date',
    'Day of Week',
    'Day Number',
    // Habit columns
    ...HABITS.map(habit => `${habit.name} (Completed)`),
    // Fitness columns
    'Muscle Groups Worked',
    // Daily metrics columns
    'Sleep Hours',
    'Sleep Minutes',
    'Total Sleep (hours)',
    'Calories',
    'Energy Level',
    'Mental Health Level'
  ];

  // Create rows for each day
  const rows = [];
  let currentDate = startDate;
  
  while (currentDate <= endDate) {
    const dateStr = formatDate(currentDate);
    const dayOfWeek = getDayOfWeek(currentDate);
    const dayNumber = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Get habit completion status
    const habitStatuses = HABITS.map(habit => {
      const dayData = habitData[dateStr]?.[habit.id];
      return dayData ? 'Yes' : 'No';
    });

    // Get fitness data
    const muscleGroups = fitnessData[dateStr] || [];
    const muscleGroupsStr = muscleGroups.join('; ');

    // Get daily metrics
    const metrics = getDailyMetrics(currentDate) || {};
    const totalSleepHours = ((metrics.sleepHours || 0) + (metrics.sleepMinutes || 0) / 60).toFixed(2);

    // Create row
    const row = [
      dateStr,
      dayOfWeek,
      dayNumber,
      ...habitStatuses,
      muscleGroupsStr,
      metrics.sleepHours || '',
      metrics.sleepMinutes || '',
      totalSleepHours,
      metrics.calories || '',
      metrics.energyLevel || '',
      metrics.mentalHealthLevel || ''
    ];

    rows.push(row);
    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  // Log the first few rows to verify data
  console.log('First few rows of export data:', rows.slice(0, 3));
  console.log('Sample fitness data:', Object.entries(fitnessData).slice(0, 3));

  // Convert to CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `habit_challenge_data_${formatDate(startDate)}_to_${formatDate(endDate)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 