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
import { CHALLENGE_START_DATE, CHALLENGE_END_DATE } from './constants/habits';
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
      default: '#1e1c1c',
      paper: '#1e1c1c',
    },
    text: {
      primary: '#F8FAFC', // Light gray
      secondary: '#94A3B8', // Medium gray
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: '#1e1c1c',
        },
      },
    },
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
  const [selectedDate, setSelectedDate] = useState(new Date());
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
        <Box sx={{ 
          minHeight: '100vh',
          backgroundColor: '#1e1c1c',
          color: 'white',
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }}>
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Habit Tracker
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Track your daily habits from {CHALLENGE_START_DATE} to {CHALLENGE_END_DATE}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                minDate={parseISO(CHALLENGE_START_DATE)}
                maxDate={parseISO(CHALLENGE_END_DATE)}
                sx={{ 
                  width: '100%',
                  '& .MuiInputBase-root': {
                    backgroundColor: 'white'
                  }
                }}
              />
            </Box>

            <ActivityChart />
            <HabitList selectedDate={selectedDate} />
            <DailyMetrics selectedDate={selectedDate} />
            <FitnessTracker />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSummaryOpen(true)}
              >
                View Summary
              </Button>
            </Box>

            <SummaryDialog
              open={summaryOpen}
              onClose={() => setSummaryOpen(false)}
              selectedDate={selectedDate}
            />
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
