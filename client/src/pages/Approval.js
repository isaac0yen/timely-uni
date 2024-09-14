import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  CircularProgress, useTheme, useMediaQuery, Drawer, List, ListItem,
  ListItemIcon, ListItemText, IconButton, AppBar, Toolbar, Avatar, styled,
  Badge
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon, Check as CheckIcon, Delete as DeleteIcon,
  Menu as MenuIcon, Home as HomeIcon, Book as BookIcon, Schedule as ScheduleIcon,
  MeetingRoom as RoomIcon, ExitToApp as LogoutIcon, Repeat as RepeatIcon, ThumbUp
} from '@mui/icons-material';
import { api } from '../apis';
import isLoggedIn from '../helpers/IsLoggedIn';
import Session from '../helpers/Session';

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

function Approval() {
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', content: '', onConfirm: null });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const loggedInUser = isLoggedIn();
        if (loggedInUser === false) {
          navigate('/');
        } else {
          const userResponse = await api.account.getAccount(loggedInUser.id);
          setUser(userResponse.data);
          const inactiveResponse = await api.account.getAllInactive();
          setInactiveUsers(inactiveResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleConfirm = (title, content, onConfirm) => {
    setConfirmDialog({ isOpen: true, title, content, onConfirm });
  };

  const handleCloseConfirm = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const handleUpdateStatus = async (id, status, email) => {
    try {
      await api.account.updateInactive({id, status, email});
      const updatedUsers = inactiveUsers.filter(user => user.id !== id);
      setInactiveUsers(updatedUsers);
      toast.success(`User ${status === 'ACTIVE' ? 'approved' : 'deleted'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(`Failed to ${status === 'ACTIVE' ? 'approve' : 'delete'} user. Please try again.`);
    }
  };

  const groupedUsers = inactiveUsers.reduce((acc, user) => {
    if (!acc[user.role]) acc[user.role] = [];
    acc[user.role].push(user);
    return acc;
  }, {});

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
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
            Approval
          </Typography>
          {inactiveUsers.length > 0 && (
            <Badge badgeContent={inactiveUsers.length} color="error">
              <ThumbUp />
            </Badge>
          )}
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
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
            <CircularProgress />
          </Box>
        ) : (
          <AnimatePresence>
            {Object.entries(groupedUsers).length > 0 ? (
              Object.entries(groupedUsers).map(([role, users]) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">{role.charAt(0).toUpperCase() + role.slice(1)}s</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {users.map((user) => (
                        <Box key={user.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                          <Typography variant="subtitle1">{user.name}</Typography>
                          <Typography variant="body2">Email: {user.email}</Typography>
                          <Box sx={{ mt: 1 }}>
                            <Button
                              startIcon={<CheckIcon />}
                              variant="contained"
                              color="primary"
                              sx={{ mr: 1 }}
                              onClick={() => handleConfirm(
                                'Approve User',
                                `Are you sure you want to approve ${user.name}?`,
                                () => handleUpdateStatus(user.id, 'ACTIVE', user.email)
                              )}
                            >
                              Approve
                            </Button>
                            <Button
                              startIcon={<DeleteIcon />}
                              variant="contained"
                              color="error"
                              onClick={() => handleConfirm(
                                'Delete User',
                                `Are you sure you want to delete ${user.name}?`,
                                () => handleUpdateStatus(user.id, 'DELETED', user.email)
                              )}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))
            ) : (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Pending Approvals</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>No one to approve yet.</Typography>
                </AccordionDetails>
              </Accordion>
            )}
          </AnimatePresence>
        )}
      </Box>

      <Dialog
        open={confirmDialog.isOpen}
        onClose={handleCloseConfirm}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button onClick={() => {
            confirmDialog.onConfirm();
            handleCloseConfirm();
          }} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Approval;