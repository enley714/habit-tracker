import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox, List, ListItem, ListItemText, Typography, Paper, Box } from '@mui/material';
import { HABITS } from '../constants/habits';
import { getHabitStatus, updateHabitStatus } from '../utils/storage';

const HabitList = ({ selectedDate, onHabitUpdate }) => {
  const handleHabitToggle = (habitId) => {
    const currentStatus = getHabitStatus(selectedDate, habitId);
    updateHabitStatus(selectedDate, habitId, !currentStatus);
    onHabitUpdate();
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Daily Habits
        </Typography>
        <List>
          {HABITS.map((habit) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ListItem
                onClick={() => handleHabitToggle(habit.id)}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '8px',
                  mb: 1,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Checkbox
                  checked={getHabitStatus(selectedDate, habit.id)}
                  color="primary"
                  sx={{
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                  }}
                />
                <ListItemText primary={habit.name} />
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default HabitList; 