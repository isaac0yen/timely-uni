import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
} from '@mui/material';
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../apis';

const Timetable = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    department: '',
    time_start: '',
    time_end: '',
    date: '',
    level: '',
  });
  const [departments, setDepartments] = useState([]);
  const [levels] = useState([100, 200, 300, 400, 500]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const fetchTimetables = useCallback(async () => {
    try {
      if (!selectedDepartment || !selectedLevel) {
        // Don't fetch if department or level is not selected
        return;
      }
      const response = await api.timetable.getAllTimetables(selectedDepartment, selectedLevel);
      if (response.status === 200) {
        const formattedEvents = response.data.map(timetable => ({
          id: timetable.id,
          title: timetable.label,
          start: `${timetable.date}T${timetable.time_start}`,
          end: `${timetable.date}T${timetable.time_end}`,
          extendedProps: {
            department: timetable.department,
            level: timetable.level,
          },
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error fetching timetables:', error);
      toast.error('Failed to fetch timetables. Please try again.');
    }
  }, [selectedDepartment, selectedLevel]);

  useEffect(() => {
    fetchTimetables();
    // Fetch departments
    const fetchDepartments = async () => {
      try {
        const response = await api.department.getAllDepartments();
        if (response.status === 200) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Failed to fetch departments. Please try again.');
      }
    };
    fetchDepartments();
  }, [fetchTimetables]);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleDateClick = (arg) => {
    setSelectedEvent(null);
    setFormData({
      label: '',
      department: selectedDepartment,
      time_start: arg.date.toTimeString().slice(0, 5),
      time_end: new Date(arg.date.getTime() + 60*60000).toTimeString().slice(0, 5),
      date: arg.dateStr,
      level: selectedLevel,
    });
    setIsDialogOpen(true);
  };

  const handleEventClick = (arg) => {
    setSelectedEvent(arg.event);
    setFormData({
      label: arg.event.title,
      department: arg.event.extendedProps.department,
      time_start: arg.event.start.toTimeString().slice(0, 5),
      time_end: arg.event.end.toTimeString().slice(0, 5),
      date: arg.event.startStr.slice(0, 10),
      level: arg.event.extendedProps.level,
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedEvent) {
        await api.timetable.updateTimetable({ ...formData, id: selectedEvent.id });
        toast.success('Timetable updated successfully');
      } else {
        await api.timetable.createTimetable(formData);
        toast.success('Timetable created successfully');
      }
      setIsDialogOpen(false);
      fetchTimetables();
    } catch (error) {
      console.error('Error saving timetable:', error);
      toast.error(error.response?.data?.message || 'An error occurred while saving the timetable');
    }
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
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
            Timetable Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
        <List>
          <ListItem button onClick={() => navigate('/')}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => navigate('/timetable')}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Timetable" />
          </ListItem>
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
              >
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>{department.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                value={selectedLevel}
                onChange={handleLevelChange}
              >
                {levels.map((level) => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          contentHeight="auto"
          aspectRatio={1.8}
          expandRows={true}
          stickyHeaderDates={true}
          nowIndicator={true}
          slotEventOverlap={false}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          slotDuration="00:30:00"
          slotLabelInterval="01:00"
        />
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{selectedEvent ? 'Edit Timetable Entry' : 'Add Timetable Entry'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="label"
            label="Label"
            type="text"
            fullWidth
            value={formData.label}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id}>{department.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="time_start"
            label="Start Time"
            type="time"
            fullWidth
            value={formData.time_start}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="time_end"
            label="End Time"
            type="time"
            fullWidth
            value={formData.time_end}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            value={formData.date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Level</InputLabel>
            <Select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
            >
              {levels.map((level) => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default Timetable;