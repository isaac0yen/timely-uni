import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { DateTime } from 'luxon';
import { api } from '../apis/index';
import {
  Box, Grid, Typography, Modal, Paper, useTheme, useMediaQuery, Button,
  TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip,
  ListItemText, ListItemIcon, Link, Avatar, ListItem, List, Toolbar,
  Drawer, AppBar, styled, Container, CircularProgress, Switch, FormControlLabel
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
  Repeat as RepeatIcon,
  Edit as EditIcon,
  ThumbUp,
} from '@mui/icons-material';
import isLoggedIn from "../helpers/IsLoggedIn"
import Session from '../helpers/Session';

const Calendar = ({ events, currentWeek, onWeekChange, onCurrentWeek, onEventAdded, onEventUpdated, courses, user, rooms }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isUpdateEventModalOpen, setIsUpdateEventModalOpen] = useState(false);
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
      onEventAdded();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateEventClick = (event) => {
    setSelectedEvent(event);
    setIsUpdateEventModalOpen(true);
  };

  const handleUpdateEvent = async (updatedEventData) => {
    try {
      await api.timetable.updateTimetable({ id: selectedEvent.id, ...updatedEventData });
      setIsUpdateEventModalOpen(false);
      onEventUpdated();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    const eventDate = DateTime.fromISO(event.date);
    return event.reoccur ?
      eventDate.weekday === currentWeek.weekday :
      eventDate.hasSame(currentWeek, 'week');
  });


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
                {filteredEvents
                  .filter(event => {
                    const eventDate = DateTime.fromISO(event.date);
                    return eventDate.hasSame(day, 'day') ||
                      (event.reoccur && eventDate.weekday === day.weekday);
                  })
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
              {user.role !== 'student' && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => handleAddEventClick(day)}
                  sx={{ m: 1 }}
                  variant="outlined"
                  size="small"
                >
                  Add Event
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <EventModal
        event={selectedEvent}
        open={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        courses={courses}
        rooms={rooms}
        onUpdateClick={handleUpdateEventClick}
        user={user}
      />

      <AddEventModal
        open={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onSubmit={handleAddEvent}
        selectedDate={selectedDate}
        user={user}
        courses={courses}
        rooms={rooms}
      />

      <UpdateEventModal
        open={isUpdateEventModalOpen}
        onClose={() => setIsUpdateEventModalOpen(false)}
        onSubmit={handleUpdateEvent}
        event={selectedEvent}
        courses={courses}
        rooms={rooms}
      />
    </Box>
  );
};

const EventModal = ({ event, open, onClose, courses, rooms, onUpdateClick, user }) => {
  if (!event) return null;

  const canEditEvent = user.role === 'lecturer' || user.classRep === true || user.role === 'admin';
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
          Course: {courses.filter(course => course.id === event.course)[0]?.name}
        </Typography>
        <Typography variant="body1">
          Room: {rooms.filter(room => room.id === event.room)[0]?.name}
        </Typography>
        <Typography variant="body1">
          Level: {event.level}
        </Typography>
        <Typography variant="body1">
          Reoccurring: {event.reoccur ? 'Yes' : 'No'}
        </Typography>
        {canEditEvent && (
          <Button
            startIcon={<EditIcon />}
            onClick={() => onUpdateClick(event)}
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
          >
            Edit Event
          </Button>
        )}
      </Box>
    </Modal>
  );
};

const AddEventModal = ({ open, onClose, onSubmit, selectedDate, user, courses, rooms }) => {
  const [formData, setFormData] = useState({
    label: '',
    course: '',
    room: '',
    time_start: '',
    time_end: '',
    level: '',
    reoccur: false,
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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

          <FormControl fullWidth margin="normal">
            <InputLabel>Room</InputLabel>
            <Select
              name="room"
              value={formData.room}
              onChange={handleChange}
              required
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
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
          <FormControlLabel
            control={
              <Switch
                checked={formData.reoccur}
                onChange={handleChange}
                name="reoccur"
              />
            }
            label="Reoccurring Event"
          />
          <Typography variant="body2" color="textSecondary">
            If checked, this event will appear on every week's timetable.
          </Typography>
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

const UpdateEventModal = ({ open, onClose, onSubmit, event, courses, rooms }) => {
  const [formData, setFormData] = useState({
    label: '',
    course: '',
    room: '',
    date: '',
    time_start: '',
    time_end: '',
    level: '',
    reoccur: false,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        label: event.label || '',
        course: event.course || '',
        room: event.room || '',
        date: DateTime.fromISO(event.date).toFormat('yyyy-MM-dd') || '',
        time_start: DateTime.fromISO(event.time_start).toFormat('HH:mm') || '',
        time_end: DateTime.fromISO(event.time_end).toFormat('HH:mm') || '',
        level: event.level || '',
        reoccur: event.reoccur || false,
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
          Update Event
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Room</InputLabel>
            <Select
              name="room"
              value={formData.room}
              onChange={handleChange}
              required
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
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
          <FormControlLabel
            control={
              <Switch
                checked={formData.reoccur}
                onChange={handleChange}
                name="reoccur"
              />
            }
            label="Reoccurring Event"
          />
          <Typography variant="body2" color="textSecondary">
            If checked, this event will appear on every week's timetable.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Event
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
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userResponse = await api.account.getAccount(isLoggedIn().id);
        setUser(userResponse.data);

        const [timetableResponse, courseResponse, roomResponse] = await Promise.all([
          api.timetable.getAllTimetables(isLoggedIn().id, userResponse.data.level),
          api.course.getAllCourses(isLoggedIn().id, userResponse.data.level),
          api.room.getAllRooms()
        ]);

        setEvents(timetableResponse.data || []);
        setCourses(courseResponse.data);
        setRooms(roomResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWeekChange = (direction) => {
    setCurrentWeek(currentWeek.plus({ weeks: direction }));
  };

  const handleCurrentWeek = () => {
    setCurrentWeek(DateTime.local());
  };

  const handleEventAdded = async () => {
    setIsLoading(true);
    try {
      const response = await api.timetable.getAllTimetables(isLoggedIn().id, user.level);
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching updated events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventUpdated = async () => {
    setIsLoading(true);
    try {
      const response = await api.timetable.getAllTimetables(isLoggedIn().id, user.level);
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching updated events:', error);
    } finally {
      setIsLoading(false);
    }
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
          { text: 'Carry Over', icon: <RepeatIcon />, path: '/carry-over', role: 'student' },
          { text: 'Approval', icon: <ThumbUp />, path: '/approval', role: 'admin' },
        ].filter(item =>
          (user?.role === 'student' && item.text !== 'Courses' && item.text !== 'Rooms') ||
          (user?.role === 'admin' && item.role !== 'student') ||
          (user?.role !== 'student' && user?.role !== 'admin' && item.role !== 'student' && item.role !== 'admin')
        ).map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path} onClick={() => navigate(item.path)}>
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={() => Session.logout()}>
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
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
              <CircularProgress />
            </Box>
          ) : (
            <Calendar
              events={events}
              currentWeek={currentWeek}
              onWeekChange={handleWeekChange}
              onCurrentWeek={handleCurrentWeek}
              onEventAdded={handleEventAdded}
              onEventUpdated={handleEventUpdated}
              courses={courses}
              rooms={rooms}
              user={user}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
}
