import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateTime } from 'luxon';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Fab,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Book as BookIcon,
  Schedule as ScheduleIcon,
  MeetingRoom as RoomIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import isLoggedIn from '../helpers/IsLoggedIn'
import { api } from '../apis/index';

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

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  color: theme.palette.common.black,
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
          { text: 'Timetable', icon: <ScheduleIcon />, path: '/timetable' },
          { text: 'Rooms', icon: <RoomIcon />, path: '/rooms' },
        ].map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={() => navigate('/logout')}>
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
    <Box sx={{ flexGrow: 1 }}>
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
            Lecture Reminder
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
          backgroundColor: theme.palette.grey[200],
          minHeight: '100vh',
          color: theme.palette.common.black,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {currentTime.toLocaleString(DateTime.DATETIME_FULL)}
        </Typography>
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Today's Schedule
          </Typography>
          <AnimatePresence>
            {user?.timetables.length > 0 ? (
              user.timetables.map((item, index) => {
                const startTime = DateTime.fromISO(item.time_start);
                const endTime = DateTime.fromISO(item.time_end);
                const duration = endTime.diff(startTime, 'minutes').minutes;
                const elapsed = currentTime.diff(startTime, 'minutes').minutes;
                const progress = Math.min(Math.max((elapsed / duration) * 100, 0), 100);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <StyledCard>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {item.course}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Lecturer: {item.lecturer}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
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
                            backgroundColor: theme.palette.grey[300],
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getTimeColor(item.time_start),
                            },
                          }}
                        />
                      </CardContent>
                    </StyledCard>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
              key={0}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5}}
            >
                No timetables to show.
              </motion.div>
            )}          </AnimatePresence>
        </Box>
      </Box>
      <StyledFab color="primary" aria-label="add">
        <MenuIcon />
      </StyledFab>
    </Box>
  );
};

export default Dashboard;