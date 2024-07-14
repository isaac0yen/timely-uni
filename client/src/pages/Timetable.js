import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { DateTime } from 'luxon';
import { api } from '../apis/index';
import {
  Box, Grid, Typography, Modal, Paper, useTheme, useMediaQuery, Button,
  TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip,
  ListItemText,
  ListItemIcon,
  Link,
  Avatar,
  ListItem,
  List,
  Toolbar,
  Drawer,
  AppBar,
  styled,
  Container
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Event as EventIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Schedule as ScheduleIcon,
  MeetingRoom as RoomIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import isLoggedIn from "../helpers/IsLoggedIn"

const Calendar = ({ events, currentWeek, onWeekChange, onCurrentWeek, onEventAdded }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const startOfWeek = currentWeek.startOf('week');
  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.plus({ days: i }));

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleAddEventClick = (date) => {
    setSelectedDate(date);
    setIsAddEventModalOpen(true);
  };

  const handleAddEvent = async (eventData) => {
    try {
      await api.timetable.createTimetable(eventData);
      setIsAddEventModalOpen(false);
      const userResponse = await api.account.getAccount(isLoggedIn().id);
      const response = await api.timetable.getAllTimetables(isLoggedIn().id, userResponse.data.level);
      onEventAdded(response.data || []);
    } catch (error) {
      console.error('Error adding event:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Tooltip title="Previous Week">
          <IconButton onClick={() => onWeekChange(-1)} color="inherit">
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            {startOfWeek.toFormat('MMMM yyyy')}
          </Typography>
          <Tooltip title="Go to Current Week">
            <IconButton onClick={onCurrentWeek} color="inherit">
              <TodayIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title="Next Week">
          <IconButton onClick={() => onWeekChange(1)} color="inherit">
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Grid container>
        {weekDays.map((day) => (
          <Grid item xs={12} sm={6} md={3} lg={12 / 7} key={day.toISO()}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                minHeight: isMobile ? '150px' : '200px',
                borderRight: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderRight: 0 },
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider', bgcolor: day.hasSame(DateTime.local(), 'day') ? 'primary.light' : 'transparent' }}>
                <Typography variant="subtitle2" fontWeight="bold">{day.weekdayShort}</Typography>
                <Typography variant="h6">{day.toFormat('d')}</Typography>
              </Box>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                {events
                  .filter(event => DateTime.fromISO(event.date).hasSame(day, 'day'))
                  .map((event, index) => (
                    <Box
                      key={index}
                      onClick={() => handleEventClick(event)}
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        p: 1,
                        mb: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'primary.main',
                        },
                      }}
                    >
                      <Typography variant="body2" noWrap>{event.label || 'Untitled Event'}</Typography>
                      <Typography variant="caption" display="block" noWrap>
                        {DateTime.fromISO(event.time_start).toFormat('HH:mm')} -
                        {DateTime.fromISO(event.time_end).toFormat('HH:mm')}
                      </Typography>
                    </Box>
                  ))}
              </Box>
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddEventClick(day)}
                sx={{ m: 1 }}
                variant="outlined"
                size="small"
              >
                Add Event
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <EventModal
        event={selectedEvent}
        open={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />

      <AddEventModal
        open={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onSubmit={handleAddEvent}
        selectedDate={selectedDate}
      />
    </Box>
  );
};

const EventModal = ({ event, open, onClose }) => {
  if (!event) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {event.label || 'Untitled Event'}
        </Typography>
        <Typography variant="body1">
          Date: {DateTime.fromISO(event.date).toFormat('dd LLL yyyy')}
        </Typography>
        <Typography variant="body1">
          Time: {DateTime.fromISO(event.time_start).toFormat('HH:mm')} -
          {DateTime.fromISO(event.time_end).toFormat('HH:mm')}
        </Typography>
        <Typography variant="body1">
          Course: {event.course}
        </Typography>
        <Typography variant="body1">
          Level: {event.level}
        </Typography>
      </Box>
    </Modal>
  );
};

const AddEventModal = ({ open, onClose, onSubmit, selectedDate }) => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    label: '',
    course: '',
    time_start: '',
    time_end: '',
    level: '',
  });

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await api.course.getAllCourses(isLoggedIn().id);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    if (open) {
      getCourses();
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, date: selectedDate.toISODate() });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Add New Event for {selectedDate ? selectedDate.toFormat('dd LLL yyyy') : ''}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Event Label"
            name="label"
            value={formData.label}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Course</InputLabel>
            <Select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Start Time"
            name="time_start"
            type="time"
            value={formData.time_start}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Time"
            name="time_end"
            type="time"
            value={formData.time_end}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Add Event
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    width: 240,
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
}));

export default function App() {
  const [events, setEvents] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(DateTime.local());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userResponse = await api.account.getAccount(isLoggedIn().id);
        setUser(userResponse.data);
        const response = await api.timetable.getAllTimetables(isLoggedIn().id, userResponse.data.level);
        setEvents(response.data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleWeekChange = (direction) => {
    setCurrentWeek(currentWeek.plus({ weeks: direction }));
  };

  const handleCurrentWeek = () => {
    setCurrentWeek(DateTime.local());
  };

  const handleEventAdded = (newEvents) => {
    setEvents(newEvents);
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const drawerContent = (
    <Box sx={{ p: 2 }}>
  <Avatar
    sx={{ width: 64, height: 64, mb: 2, mx: 'auto' }}
    alt={user?.name}
    src="/path-to-user-image.jpg"
  />
  <Typography variant="h6" align="center" gutterBottom>
    {user?.name}
  </Typography>
  <Typography variant="body2" align="center" gutterBottom>
    {user?.email}
  </Typography>
  <List>
    {[
      { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
      { text: 'Courses', icon: <BookIcon />, path: '/course' },
      { text: 'Rooms', icon: <RoomIcon />, path: '/rooms' },
      { text: 'Timetable', icon: <ScheduleIcon />, path: '/timetable' },
    ].filter(item => user?.role !== 'student' || (item.text !== 'Courses' && item.text !== 'Rooms')).map((item) => (
      <ListItem button key={item.text} component={Link} to={item.path} onClick={() => navigate(item.path)}>
        <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    ))}
    <ListItem button onClick={() => navigate('/')}>
      <ListItemIcon sx={{ color: 'inherit' }}>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItem>
  </List>
</Box>
);

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Weekly Calendar
          </Typography>
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawerContent}
      </StyledDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { sm: '240px' },
          width: { sm: `calc(100% - 240px)` },
        }}
      >
        <Container maxWidth="lg">
          <Calendar
            events={events}
            currentWeek={currentWeek}
            onWeekChange={handleWeekChange}
            onCurrentWeek={handleCurrentWeek}
            onEventAdded={handleEventAdded}
          />
        </Container>
      </Box>
    </Box>
  );
}