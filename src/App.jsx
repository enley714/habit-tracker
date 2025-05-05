import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CssBaseline, ThemeProvider, createTheme, Button, Dialog } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { differenceInDays, parseISO, format, startOfWeek } from 'date-fns';
import HabitList from './components/HabitList';
import ActivityChart from './components/ActivityChart';
import SummaryDialog from './components/SummaryDialog';
import FitnessTracker from './components/FitnessTracker';
import DailyMetrics from './components/DailyMetrics';
import { CHALLENGE_START_DATE } from './constants/habits';
import { getDayProgress } from './utils/storage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6', // Purple
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    secondary: {
      main: '#EC4899', // Pink
    },
    background: {
      default: '#0F172A', // Dark blue
      paper: '#1E293B', // Slightly lighter blue
    },
    text: {
      primary: '#F8FAFC', // Light gray
      secondary: '#94A3B8', // Medium gray
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
        contained: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  const [selectedDate, setSelectedDate] = useState(parseISO(CHALLENGE_START_DATE));
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const dayNumber = differenceInDays(selectedDate, parseISO(CHALLENGE_START_DATE)) + 1;

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleHabitUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  const progress = getDayProgress(selectedDate);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="lg" sx={{ px: 4 }}>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ 
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>
              Day {dayNumber}
            </Typography>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
              sx={{ 
                mb: 2, 
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              format="MMMM, d"
            />
            <ActivityChart 
              onDateSelect={handleDateChange} 
              selectedDate={selectedDate}
              updateTrigger={updateTrigger}
            />
            <HabitList 
              selectedDate={selectedDate} 
              onHabitUpdate={handleHabitUpdate}
            />
            <DailyMetrics selectedDate={selectedDate} />
            <FitnessTracker />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 2
            }}>
              <Box>
                <Button 
                  variant="outlined" 
                  onClick={() => setSummaryOpen(true)}
                >
                  View Summary
                </Button>
              </Box>
            </Box>
            <SummaryDialog 
              open={summaryOpen} 
              onClose={() => setSummaryOpen(false)} 
              selectedDate={selectedDate}
            />
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
