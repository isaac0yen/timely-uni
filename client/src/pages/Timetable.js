import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import {
  Box,
  Grid,
  Typography,
  Modal,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../apis';
import { useNavigate } from 'react-router-dom';
import isLoggedIn from '../helpers/IsLoggedIn';

const Table = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = DateTime.local();
  const startOfWeek = today.startOf('week');

  const weekDays = [];
  for (let i = 0; i <= 6; i++) {
    weekDays.push(startOfWeek.plus({ days: i }));
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const showToast = (message) => {
    toast(message);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Timetable
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {weekDays.map((day) => (
          <Grid item xs={12} sm={6} md={3} lg={1.7} key={day.toISO()}>
            <Box
              sx={{
                border: '1px solid #ccc',
                p: 2,
                height: '100%',
                minHeight: '200px'
              }}
            >
              <Typography variant="subtitle1">{day.weekdayLong}</Typography>
              <Typography variant="h6">{day.toFormat('d')}</Typography>
              {events
                .filter(event => DateTime.fromISO(event.date).hasSame(day, 'day'))
                .map((event, index) => (
                  <Box
                    key={index}
                    onClick={() => handleEventClick(event)}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      p: 1,
                      mt: 1,
                      cursor: 'pointer'
                    }}
                  >
                    <Typography variant="body2">{event.label || 'Untitled Event'}</Typography>
                    <Typography variant="caption">
                      {event.time_start ? DateTime.fromISO(event.time_start).toFormat('HH:mm') : 'N/A'} -
                      {event.time_end ? DateTime.fromISO(event.time_end).toFormat('HH:mm') : 'N/A'}
                    </Typography>
                  </Box>
                ))}
              {events.filter(event => DateTime.fromISO(event.date).hasSame(day, 'day')).length === 0 && (
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  No events
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          {selectedEvent && (
            <>
              <Typography id="event-modal-title" variant="h6" component="h2">
                {selectedEvent.label || 'Untitled Event'}
              </Typography>
              <Typography id="event-modal-description" sx={{ mt: 2 }}>
                Date: {selectedEvent.date ? DateTime.fromISO(selectedEvent.date).toFormat('dd LLL yyyy') : 'N/A'}
                <br />
                Time: {selectedEvent.time_start ? DateTime.fromISO(selectedEvent.time_start).toFormat('HH:mm') : 'N/A'} -
                {selectedEvent.time_end ? DateTime.fromISO(selectedEvent.time_end).toFormat('HH:mm') : 'N/A'}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
      <ToastContainer />
    </Box>
  );
};

const Timetable = () => {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = isLoggedIn();
    if (loggedInUser === false) {
      navigate('/');
    }

    const getUser = async () => {
      try {
        const response = await api.account.getAccount(loggedInUser.id);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUser();

  }, [navigate]);

};

export default Timetable;