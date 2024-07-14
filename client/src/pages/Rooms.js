import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  MeetingRoom as RoomIcon,
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../apis'; 
const RoomPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
  });
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.room.getAllRooms();
      if (response.status === 200) {
        setRooms(response.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to fetch rooms. Please try again.');
    }
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.room.createRoom(formData);
      if (response && response.status === 200) {
        toast.success('Room created successfully!');
        setFormData({ name: '', capacity: '' });
        fetchRooms();
        setActiveStep(0);
      } else {
        toast.error('Failed to create room. Please try again.');
      }
    } catch (err) {
      console.error('Error creating room:', err);
      toast.error(err.response?.data?.message || 'An error occurred while creating the room');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = ['Room Details', 'Confirmation'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Room Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              required
              margin="normal"
            />
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h6">Review and Confirm</Typography>
            <Typography variant="body1">
              Please review the information you've entered.
            </Typography>
            <Typography variant="body1">Room Name: {formData.name}</Typography>
            <Typography variant="body1">Capacity: {formData.capacity}</Typography>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box>
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
            Room Management
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
          <ListItem button onClick={() => navigate('/rooms')}>
            <ListItemIcon>
              <RoomIcon />
            </ListItemIcon>
            <ListItemText primary="Rooms" />
          </ListItem>
        </List>
      </Drawer>

      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, mt: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create New Room
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                {getStepContent(activeStep)}
              </motion.div>
            </AnimatePresence>
            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<BackIcon />}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={isLoading ? <CircularProgress size={20} /> : <ForwardIcon />}
                >
                  {isLoading ? 'Creating...' : 'Create Room'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  endIcon={<ForwardIcon />}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </Paper>

        <Paper elevation={3} sx={{ padding: 3, mt: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Existing Rooms
          </Typography>
          <List>
            {rooms.map((room) => (
              <ListItem key={room.id}>
                <ListItemIcon>
                  <RoomIcon />
                </ListItemIcon>
                <ListItemText primary={room.name} secondary={`Capacity: ${room.capacity}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
      <ToastContainer />
    </Box>
  );
};

export default RoomPage;