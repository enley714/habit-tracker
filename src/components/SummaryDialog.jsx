import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  LinearProgress
} from '@mui/material';
import { format, startOfWeek, endOfWeek, differenceInDays, parseISO } from 'date-fns';
import { getOverallSummary, getFitnessSummary } from '../utils/storage';
import { exportChallengeData } from '../utils/export';
import FitnessSummary from './FitnessSummary';
import { HABITS, CHALLENGE_START_DATE } from '../constants/habits';

const SummaryDialog = ({ open, onClose, selectedDate }) => {
  const overallSummary = getOverallSummary();
  const fitnessSummary = getFitnessSummary();

  // Calculate week range
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 }); // Saturday
  const weekRange = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  // Calculate days passed in challenge
  const daysPassed = differenceInDays(selectedDate, parseISO(CHALLENGE_START_DATE)) + 1;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          Summary for Week of {weekRange}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Habit Progress
        </Typography>
        <Box sx={{ mb: 4 }}>
          {HABITS.map((habit) => {
            const completed = overallSummary[habit.id]?.completed || 0;
            const percentage = Math.round((completed / daysPassed) * 100);
            
            return (
              <Paper 
                key={habit.id} 
                elevation={1} 
                sx={{ 
                  mb: 2, 
                  p: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                    {habit.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {percentage}% completed ({completed} of {daysPassed} days)
                  </Typography>
                  <Box sx={{ position: 'relative', height: 8, bgcolor: 'divider', borderRadius: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        backgroundColor: 'transparent',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 1,
                          backgroundColor: 'primary.main',
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Fitness Summary
        </Typography>
        <Paper elevation={1} sx={{ p: 2 }}>
          <FitnessSummary />
        </Paper>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={exportChallengeData} 
          variant="contained" 
          color="primary"
          size="small"
        >
          Export
        </Button>
        <Button onClick={onClose} variant="outlined" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SummaryDialog; 