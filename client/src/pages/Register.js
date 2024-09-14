import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from '@mui/material';
import {
  Home as HomeIcon,
  LockOpen as LoginIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../apis';
import Admin from './Register/Admin';
import Session from '../helpers/Session';
import { subscribeToPushNotifications } from '../pushNotifications';

const RegisterPage = () => {
  const { role } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const code = searchParams.get('code');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: email || '',
    password: '',
    confirmPassword: '',
    code: code || '',
    matric_no: '',
    phone: '',
    classRep: false,
    level: '',
    faculty: '',
    department: '',
    fcm_token: Session.getLocalStorage("wp")
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    requestNotificationPermission();
    const fetchFaculties = async () => {
      try {
        const response = await api.faculty.getAllFaculties();
        if (response.status === 200) {
          setFaculties(response.data);
        }
      } catch (error) {
        console.error('Error fetching faculties:', error);
        toast.error('Failed to fetch faculties. Please try again.');
      }
    };

    fetchFaculties();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (formData.faculty) {
        try {
          const response = await api.department.getAllDepartments(formData.faculty);
          if (response.status === 200) {
            setDepartments(response.data);
          }
        } catch (error) {
          console.error('Error fetching departments:', error);
          toast.error('Failed to fetch departments. Please try again.');
        }
      } else {
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [formData.faculty]);

  useEffect(() => {
    if (formData.faculty && formData.department) {
      const fetchLevels = async () => {
        try {
          setLevels([100, 200, 300, 400, 500]);
        } catch (error) {
          console.error('Error fetching levels:', error);
          toast.error('Failed to fetch levels. Please try again.');
        }
      };

      fetchLevels();
    } else {
      setLevels([]);
    }
  }, [formData.faculty, formData.department]);

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const subscription = await subscribeToPushNotifications();
      if (subscription) {
        console.log('Push notification subscription:', subscription);
        console.log(subscription);
        Session.setLocalStorage("wp", JSON.stringify(subscription));
      }
    } else if (permission === "denied") {
      alert("You denied notification permissions. Some features may not work.");
    }
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'faculty') {
      setFormData(prevData => ({
        ...prevData,
        department: '',
        level: ''
      }));
    } else if (name === 'department') {
      setFormData(prevData => ({
        ...prevData,
        level: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }



    try {
      let response;
      switch (role) {
        case 'lecturer':
          response = await api.user.createLecturer(formData);
          break;
        case 'student':
          response = await api.user.createStudent(formData);
          break;
        default:
          throw new Error('Invalid role');
      }

      if (response && response.status === 200) {
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      toast.error(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = ['Personal Info', 'Account Details', 'Confirmation'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                readOnly: !!email,
              }}
            />
            {role === 'student' && (
              <>
                <TextField
                  fullWidth
                  label="Matric Number"
                  name="matric_no"
                  value={formData.matric_no}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
              </>
            )}
          </>
        );
      case 1:
        return (
          <>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              margin="normal"
            />
            {(role === 'student' || role === 'lecturer') && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Faculty</InputLabel>
                  <Select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="">Select Faculty</MenuItem>
                    {faculties.map((fac) => (
                      <MenuItem key={fac.id} value={fac.id}>
                        {fac.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formData.faculty && (
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="">Select Department</MenuItem>
                      {departments.map((dep) => (
                        <MenuItem key={dep.id} value={dep.id}>
                          {dep.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {role === 'student' && formData.faculty && formData.department && (
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Level</InputLabel>
                    <Select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="">Select Level</MenuItem>
                      {levels.map((lvl) => (
                        <MenuItem key={lvl} value={lvl}>
                          {lvl}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                {role === 'student' && <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.classRep}
                      onChange={handleChange}
                      name="classRep"
                      color="primary"
                    />
                  }
                  label="Class Representative"
                />}
              </>
            )}
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h6">Review and Confirm</Typography>
            <Typography variant="body1">
              Please review the information you've entered.
            </Typography>
            <Typography variant="body1">Name: {formData.name}</Typography>
            <Typography variant="body1">Email: {formData.email}</Typography>
            {role === 'student' && (
              <>
                <Typography variant="body1">Matric Number: {formData.matric_no}</Typography>
                <Typography variant="body1">Phone Number: {formData.phone}</Typography>
                <Typography variant="body1">Faculty: {faculties.find(faculty => faculty.id === formData.faculty)?.name || 'N/A'}</Typography>
                <Typography variant="body1">Department: {departments.find(department => department.id === formData.department)?.name || 'N/A'}</Typography>
                <Typography variant="body1">Level: {formData.level}</Typography>
                <Typography variant="body1">
                  Class Representative: {formData.classRep ? 'Yes' : 'No'}
                </Typography>
              </>
            )}
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

  if (role === "admin") {
    return <Admin />
  }

  return (
    <Box>
      <AppBar position="static" color="default">
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
            Registration
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
          <ListItem button onClick={() => navigate('/')}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button onClick={() => navigate('/register/student')}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Register as Student" />
          </ListItem>
          <ListItem button onClick={() => navigate('/register/lecturer')}>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="Register as Lecturer" />
          </ListItem>
        </List>
      </Drawer>

      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, mt: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Register as {role.charAt(0).toUpperCase() + role.slice(1)}
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
                variant="contained"
                color="primary"
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
                  {isLoading ? 'Submitting...' : 'Submit'}
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
      </Container>
      <ToastContainer />
    </Box>
  );
};

export default RegisterPage;
