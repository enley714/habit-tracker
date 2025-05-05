import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  LinearProgress,
} from '@mui/material';
import { format, eachDayOfInterval, startOfWeek, parseISO } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CHALLENGE_START_DATE, CHALLENGE_END_DATE, HABITS } from '../constants/habits';
import { getHabitStatus } from '../utils/storage';

const HabitSummary = ({ summary, habit, selectedDate, onBack }) => {
  // If we're showing a single habit's summary
  if (habit && selectedDate) {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const challengeStart = parseISO(CHALLENGE_START_DATE);
    const challengeEnd = parseISO(CHALLENGE_END_DATE);

    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: weekEnd
    });

    const allDays = eachDayOfInterval({
      start: challengeStart,
      end: challengeEnd
    });

    const getColor = (completed) => {
      return completed ? '#7C3AED' : 'transparent';
    };

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{habit.name}</Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Weekly Progress ({format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')})
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'flex-start', 
            pb: 1,
            width: '100%',
            justifyContent: 'space-between'
          }}>
            {weekDays.map((day) => {
              const completed = getHabitStatus(day, habit.id);
              return (
                <Box key={format(day, 'yyyy-MM-dd')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.7rem',
                      mb: 0.5,
                      color: 'text.secondary'
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>
                  <Box
                    sx={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: getColor(completed),
                      border: '1px solid',
                      borderColor: completed ? 'primary.main' : 'divider',
                      borderRadius: '4px',
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Overall Progress
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 0.5, 
            alignItems: 'flex-start', 
            pb: 1,
            width: '100%',
            justifyContent: 'space-between'
          }}>
            {allDays.map((day) => {
              const completed = getHabitStatus(day, habit.id);
              return (
                <Box key={format(day, 'yyyy-MM-dd')} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.6rem',
                      mb: 0.5,
                      color: 'text.secondary'
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>
                  <Box
                    sx={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: getColor(completed),
                      border: '1px solid',
                      borderColor: completed ? 'primary.main' : 'divider',
                      borderRadius: '3px',
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>
    );
  }

  // If we're showing a summary of all habits
  const totalHabits = HABITS.length;
  const completedHabits = Object.values(summary).filter(Boolean).length;
  const percentage = Math.round((completedHabits / totalHabits) * 100);

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" component="div">
          Completed {completedHabits} out of {totalHabits} habits ({percentage}%)
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={percentage} 
          sx={{ mt: 1, height: 10, borderRadius: 5 }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        {HABITS.map(habit => (
          <Box key={habit.id} sx={{ mb: 1 }}>
            <Typography variant="body2" component="div">
              {habit.name}: {summary[habit.id] ? '✓' : '✗'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HabitSummary; 