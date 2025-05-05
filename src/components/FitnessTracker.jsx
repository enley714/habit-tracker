import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Select, MenuItem, Chip, FormControl } from '@mui/material';
import { eachDayOfInterval, format, parseISO } from 'date-fns';
import { CHALLENGE_START_DATE, CHALLENGE_END_DATE } from '../constants/habits';
import { getFitnessData, updateFitnessData } from '../utils/storage';

const MUSCLE_GROUPS = [
  'biceps',
  'back',
  'shoulders',
  'chest',
  'legs',
  'abs',
  'triceps'
];

const FitnessTracker = () => {
  const [fitnessData, setFitnessData] = useState({});
  const challengeStart = parseISO(CHALLENGE_START_DATE);
  const challengeEnd = parseISO(CHALLENGE_END_DATE);

  useEffect(() => {
    const data = getFitnessData();
    setFitnessData(data);
  }, []);

  const handleMuscleGroupChange = (date, selectedGroups) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const newData = {
      ...fitnessData,
      [dateStr]: selectedGroups
    };
    setFitnessData(newData);
    updateFitnessData(newData);
  };

  const days = eachDayOfInterval({
    start: challengeStart,
    end: challengeEnd
  });

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Fitness Tracker
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        alignItems: 'flex-start', 
        pb: 1,
        width: '100%',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const selectedGroups = fitnessData[dateStr] || [];
          
          return (
            <Box key={dateStr} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
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
              <FormControl size="small" sx={{ width: '100%' }}>
                <Select
                  multiple
                  value={selectedGroups}
                  onChange={(e) => handleMuscleGroupChange(day, e.target.value)}
                  renderValue={(selected) => (
                    <Box 
                      sx={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        maxHeight: '70px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: 'transparent',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: '2px',
                        },
                      }}
                    >
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value} 
                          size="small"
                          sx={{ 
                            height: '20px',
                            fontSize: '0.7rem',
                            backgroundColor: 'primary.main',
                            color: 'text.primary'
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    height: '80px',
                    backgroundColor: selectedGroups.length > 0 ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                    border: '1px solid',
                    borderColor: selectedGroups.length > 0 ? 'primary.main' : 'divider',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    '& .MuiSelect-select': {
                      p: 0.5,
                      pr: '8px !important',
                      height: '100% !important',
                      display: 'flex',
                      alignItems: 'flex-start'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      display: 'none'
                    },
                    '& .MuiSelect-icon': {
                      display: 'none'
                    }
                  }}
                  IconComponent={() => null}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  {MUSCLE_GROUPS.map((muscle) => (
                    <MenuItem key={muscle} value={muscle} sx={{ fontSize: '0.8rem' }}>
                      {muscle}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default FitnessTracker; 