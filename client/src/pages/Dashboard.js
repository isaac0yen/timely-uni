import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateTime } from 'luxon';
import { Link, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Fab,
  Typography,
  Grid,
} from '@mui/material';
import { createTheme, styled } from '@mui/material/styles';
import {
  Home as HomeIcon,
  Book as BookIcon,
  Schedule as ScheduleIcon,
  MeetingRoom as RoomIcon,
  ExitToApp as LogoutIcon,
  Repeat as RepeatIcon,
  ThumbUp,
  AccessTime,
  School,
  Person,
} from '@mui/icons-material';
import isLoggedIn from '../helpers/IsLoggedIn';
import { api } from '../apis/index';
import Session from '../helpers/Session';
import NavBar from './NavBar';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});


const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    width: 240,
  },
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));


const Dashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(DateTime.now());
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        if (error.response.status === 401) {
          window.location.reload();
        }
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const timer = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const getTimeColor = (startTime) => {
    const start = DateTime.fromISO(startTime);
    const diff = start.diff(currentTime, 'minutes').minutes;
    if (diff <= 15) return theme.palette.error.main;
    if (diff <= 30) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const drawerContent = (
    <Box sx={{ p: 2 }}>
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

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f0f4f8' }}>
      <NavBar handleDrawerToggle={handleDrawerToggle} user={user} />
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
          minHeight: '100vh',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2196F3' }}>
            Welcome, {user?.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ color: '#757575' }}>
            <AccessTime sx={{ verticalAlign: 'middle', mr: 1 }} />
            {currentTime.toLocaleString(DateTime.DATETIME_FULL)}
          </Typography>
        </motion.div>
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2196F3' }}>
            <School sx={{ verticalAlign: 'middle', mr: 1 }} />
            Today's Schedule
          </Typography>
          <Grid container spacing={3}>
            <AnimatePresence>
              {user?.timetables.length > 0 ? (
                user.timetables.map((item, index) => {
                  const startTime = DateTime.fromISO(item.time_start);
                  const endTime = DateTime.fromISO(item.time_end);
                  const duration = endTime.diff(startTime, 'minutes').minutes;
                  const elapsed = currentTime.diff(startTime, 'minutes').minutes;
                  const progress = Math.min(Math.max((elapsed / duration) * 100, 0), 100);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <StyledCard>
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                              <BookIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                              {item.course}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                              {item.label}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <Person sx={{ verticalAlign: 'middle', mr: 1 }} />
                              Lecturer: {item.lecturer}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <AccessTime sx={{ verticalAlign: 'middle', mr: 1 }} />
                              Time: {startTime.toLocaleString(DateTime.TIME_SIMPLE)} -{' '}
                              {endTime.toLocaleString(DateTime.TIME_SIMPLE)}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              sx={{
                                mt: 2,
                                height: 8,
                                borderRadius: 5,
                                backgroundColor: 'rgba(255,255,255,0.3)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getTimeColor(item.time_start),
                                },
                              }}
                            />
                          </CardContent>
                        </StyledCard>
                      </motion.div>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography variant="h6" sx={{ color: '#757575' }}>
                      No timetables to show.
                    </Typography>
                  </motion.div>
                </Grid>
              )}
            </AnimatePresence>
          </Grid>
        </Box>
      </Box>
      <StyledFab color="primary" aria-label="add">
        <ScheduleIcon />
      </StyledFab>
    </Box>
  );
};

export default Dashboard;