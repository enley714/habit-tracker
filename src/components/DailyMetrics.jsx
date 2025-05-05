import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { format } from 'date-fns';
import { getDailyMetrics, updateDailyMetrics } from '../utils/storage';

const DailyMetrics = ({ selectedDate }) => {
  const [metrics, setMetrics] = useState({
    sleepHours: '',
    sleepMinutes: '',
    calories: '',
    energyLevel: '',
    mentalHealthLevel: ''
  });

  useEffect(() => {
    const data = getDailyMetrics(selectedDate);
    if (data) {
      setMetrics(data);
    } else {
      setMetrics({
        sleepHours: '',
        sleepMinutes: '',
        calories: '',
        energyLevel: '',
        mentalHealthLevel: ''
      });
    }
  }, [selectedDate]);

  const handleChange = (field, value) => {
    const newMetrics = { ...metrics, [field]: value };
    setMetrics(newMetrics);
    updateDailyMetrics(selectedDate, newMetrics);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Daily Metrics
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Sleep Duration */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body1" sx={{ minWidth: '100px' }}>
            Sleep Duration:
          </Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Hours</InputLabel>
            <Select
              value={metrics.sleepHours}
              label="Hours"
              onChange={(e) => handleChange('sleepHours', e.target.value)}
            >
              {[...Array(13)].map((_, i) => (
                <MenuItem key={i} value={i}>{i}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Minutes</InputLabel>
            <Select
              value={metrics.sleepMinutes}
              label="Minutes"
              onChange={(e) => handleChange('sleepMinutes', e.target.value)}
            >
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i * 5} value={i * 5}>
                  {i * 5}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Calories */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body1" sx={{ minWidth: '100px' }}>
            Calories:
          </Typography>
          <TextField
            type="number"
            value={metrics.calories}
            onChange={(e) => handleChange('calories', e.target.value)}
            sx={{ width: 120 }}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Box>

        {/* Energy Level */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body1" sx={{ minWidth: '100px' }}>
            Energy Level:
          </Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Out of 10</InputLabel>
            <Select
              value={metrics.energyLevel}
              label="Out of 10"
              onChange={(e) => handleChange('energyLevel', e.target.value)}
            >
              {[...Array(11)].map((_, i) => (
                <MenuItem key={i} value={i}>{i}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Mental Health Level */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body1" sx={{ minWidth: '100px' }}>
            Mental Health:
          </Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Out of 10</InputLabel>
            <Select
              value={metrics.mentalHealthLevel}
              label="Out of 10"
              onChange={(e) => handleChange('mentalHealthLevel', e.target.value)}
            >
              {[...Array(11)].map((_, i) => (
                <MenuItem key={i} value={i}>{i}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Paper>
  );
};

export default DailyMetrics; 