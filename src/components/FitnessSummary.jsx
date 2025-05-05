import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { getFitnessSummary } from '../utils/storage';

const FitnessSummary = () => {
  const fitnessSummary = getFitnessSummary();
  console.log('Fitness Summary Data:', fitnessSummary);
  
  const MUSCLE_GROUPS = [
    'biceps',
    'back',
    'shoulders',
    'chest',
    'legs',
    'abs',
    'triceps'
  ];

  const getColor = (count) => {
    if (count === 0) return 'transparent';
    if (count === 1) return '#4C1D95';
    if (count === 2) return '#5B21B6';
    if (count === 3) return '#6D28D9';
    return '#7C3AED';
  };

  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Weekly Workout Summary
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        {MUSCLE_GROUPS.map((muscle) => {
          console.log(`Weekly data for ${muscle}:`, fitnessSummary[muscle]?.weekly);
          return (
            <Box key={muscle} sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mb: 1 }}>
                {muscle}
              </Typography>
              <Box
                sx={{
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                {[...Array(fitnessSummary[muscle]?.weekly || 0)].map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '100%',
                      height: '15px',
                      backgroundColor: getColor(index + 1),
                      borderRadius: '4px',
                    }}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Typography variant="h6" gutterBottom>
        Overall Workout Summary
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {MUSCLE_GROUPS.map((muscle) => {
          console.log(`Total data for ${muscle}:`, fitnessSummary[muscle]?.total);
          const count = fitnessSummary[muscle]?.total || 0;
          return (
            <Box key={muscle} sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mb: 1 }}>
                {muscle}
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: `${Math.min(200, count * 20)}px`,
                  backgroundColor: getColor(count),
                  borderRadius: 1,
                  transition: 'height 0.3s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  boxShadow: 1
                }}
              >
                {count}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default FitnessSummary; 