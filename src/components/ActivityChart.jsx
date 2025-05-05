import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { CHALLENGE_START_DATE, CHALLENGE_END_DATE, HABITS } from '../constants/habits';
import { getHabitStatus } from '../utils/storage';

const ActivityChart = ({ onDateSelect, selectedDate, updateTrigger }) => {
  const [progressData, setProgressData] = useState({});
  const today = new Date();
  const challengeStart = parseISO(CHALLENGE_START_DATE);
  const challengeEnd = parseISO(CHALLENGE_END_DATE);

  // If today is not in the challenge period, use the first day of the challenge
  const todayOrFirstDay = isSameDay(today, challengeStart) || isSameDay(today, challengeEnd) ? 
    today : 
    challengeStart;

  useEffect(() => {
    const calculateProgress = () => {
      const days = eachDayOfInterval({
        start: challengeStart,
        end: challengeEnd
      });

      const newProgressData = {};
      days.forEach(day => {
        let completed = 0;
        HABITS.forEach(habit => {
          if (getHabitStatus(day, habit.id)) {
            completed++;
          }
        });
        const progress = completed / HABITS.length;
        newProgressData[format(day, 'yyyy-MM-dd')] = progress;
      });
      
      setProgressData(newProgressData);
    };

    calculateProgress();

    // Listen for storage changes
    const handleStorageChange = () => {
      calculateProgress();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [updateTrigger]);

  const getColor = (progress) => {
    if (progress === 0) return 'transparent';
    if (progress === 1) return '#FFD700'; // Gold color for 100% completion
    if (progress <= 0.25) return '#4C1D95';
    if (progress <= 0.5) return '#5B21B6';
    if (progress <= 0.75) return '#6D28D9';
    return '#7C3AED';
  };

  const days = eachDayOfInterval({
    start: challengeStart,
    end: challengeEnd
  });

  const isOnToday = isSameDay(selectedDate, todayOrFirstDay);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mb: 3,
        border: '1px solid',
        borderColor: 'primary.main',
        borderRadius: '12px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Progress
        </Typography>
        <Button
          variant="contained"
          onClick={() => onDateSelect(todayOrFirstDay)}
          disabled={isOnToday}
          sx={{ 
            minWidth: '100px',
            opacity: isOnToday ? 0.5 : 1,
            backgroundColor: isOnToday ? 'transparent' : 'primary.main',
            color: isOnToday ? 'text.secondary' : 'text.primary',
            border: isOnToday ? '1px solid' : 'none',
            borderColor: isOnToday ? 'text.secondary' : 'transparent',
          }}
        >
          Today
        </Button>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        alignItems: 'center', 
        pb: 1,
        width: '100%',
        justifyContent: 'space-between'
      }}>
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const progress = progressData[dateStr] || 0;
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <Box key={dateStr} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.7rem',
                  mb: 0.5,
                  color: isSelected ? 'primary.main' : 'text.secondary',
                  fontWeight: isSelected ? 700 : 400,
                  ...(isSelected && {
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    color: 'primary.main',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid',
                    borderColor: 'primary.main',
                  }),
                  ...(isToday && !isSelected && {
                    backgroundColor: 'primary.main',
                    color: 'text.primary',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  })
                }}
              >
                {format(day, 'd')}
              </Typography>
              <Box
                onClick={() => onDateSelect(day)}
                sx={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: getColor(progress),
                  border: '1px solid',
                  borderColor: progress === 0 ? 'divider' : 'transparent',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: progress === 0 ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default ActivityChart; 