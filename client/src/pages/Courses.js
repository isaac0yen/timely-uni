import React, { useEffect, useState } from 'react';
import {
  AppBar, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
  Drawer, Fab, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem,
  TextField, Toolbar, Typography, useTheme, styled, Select, InputLabel, FormControl,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon, Home as HomeIcon, Book as BookIcon,
  Schedule as ScheduleIcon, MeetingRoom as RoomIcon, ExitToApp as LogoutIcon,
  Add as AddIcon, MoreVert as MoreVertIcon, ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import isLoggedIn from '../helpers/IsLoggedIn';
import { api } from '../apis';
import { motion, AnimatePresence } from 'framer-motion';

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

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    width: 240,
  },
}));

function Courses() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lecturers, setLecturers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isHeadDialogOpen, setIsHeadDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState('faculties');
  const [currentFacultyId, setCurrentFacultyId] = useState(null);


  useEffect(() => {
    const process = async () => {
      const loggedInUser = isLoggedIn();
      if (loggedInUser === false) {
        navigate('/');
      } else {
        const userResponse = await api.account.getAccount(isLoggedIn().id);
        setUser(userResponse.data);
        fetchFaculties();
      }
    }
    process();
  }, [navigate]);


  const fetchFaculties = async () => {
    try {
      const response = await api.faculty.getAllFaculties();
      setFaculties(response.data);
    } catch (error) {
      toast.error('Error fetching faculties');
    }
  };

  const fetchDepartments = async (facultyId) => {
    try {
      const response = await api.department.getAllDepartments(facultyId);
      setDepartments(response.data);
      setCurrentView('departments');
      setCurrentFacultyId(facultyId);
    } catch (error) {
      toast.error('Error fetching departments');
    }
  };

  const fetchCourses = async (departmentId) => {
    try {
      const response = await api.course.getAllCourses(departmentId);
      setCourses(response.data);
      setCurrentView('courses');
    } catch (error) {
      toast.error('Error fetching courses');
    }
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleModalOpen = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      let response;
      switch (modalType) {
        case 'faculty':
          response = await api.faculty.createFaculty(formData);
          await fetchFaculties();
          break;
        case 'department':
          response = await api.department.createDepartment({
            ...formData,
            faculty: selectedItem.id,
            created_by: user.id
          });
          await fetchDepartments(selectedItem.id);
          break;
        case 'course':
          response = await api.course.createCourse({
            ...formData,
            department: selectedItem.id,
            faculty: selectedItem.faculty,
            created_by: user.id
          });
          await fetchCourses(selectedItem.id);
          break;
        default:
          throw new Error('Invalid modal type');
      }
      toast.success(`${modalType} created successfully`);
      handleModalClose();
    } catch (error) {
      toast.error(`Error creating ${modalType}`);
    }
  };


  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSetHead = async () => {
    handleMenuClose();
    try {
      const [lecturersResponse, adminsResponse] = await Promise.all([
        api.user.getAllLecturers(),
        api.user.getAllAdmins()
      ]);
      setLecturers(lecturersResponse.data);
      setAdmins(adminsResponse.data);
      setIsHeadDialogOpen(true);
    } catch (error) {
      console.error(error)
      toast.error('Error fetching lecturers and admins');
    }
  };

  const handleHeadSelection = async (selectedHead) => {
    try {
      if (currentView === 'faculties') {
        await api.faculty.updateFaculty(selectedItem.id, { head: selectedHead.id });
        await fetchFaculties();
      } else if (currentView === 'departments') {
        await api.department.updateDepartment(selectedItem.id, { head: selectedHead.id });
        await fetchDepartments(selectedItem.faculty);
      }
      toast.success('Head updated successfully');
      setIsHeadDialogOpen(false);
    } catch (error) {
      toast.error('Error updating head');
    }
  };

  const handleBack = () => {
    if (currentView === 'departments') {
      setCurrentView('faculties');
      fetchFaculties();
    } else if (currentView === 'courses') {
      setCurrentView('departments');
      fetchDepartments(currentFacultyId);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'faculties':
        return (
          <AnimatePresence>
            {faculties.map((faculty) => (
              <motion.div
                key={faculty.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StyledCard>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{faculty.name}</Typography>
                      <IconButton onClick={(e) => handleMenuOpen(e, faculty)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Button onClick={() => fetchDepartments(faculty.id)}>View Departments</Button>
                  </CardContent>
                </StyledCard>
              </motion.div>
            ))}
          </AnimatePresence>
        );
      case 'departments':
        return (
          <AnimatePresence>
            {departments.map((department) => (
              <motion.div
                key={department.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StyledCard>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{department.name}</Typography>
                      <IconButton onClick={(e) => handleMenuOpen(e, department)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Button onClick={() => fetchCourses(department.id)}>View Courses</Button>
                  </CardContent>
                </StyledCard>
              </motion.div>
            ))}
          </AnimatePresence>
        );
      case 'courses':
        return (
          <AnimatePresence>
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6">{course.name}</Typography>
                    <Typography variant="body2">{course.code}</Typography>
                  </CardContent>
                </StyledCard>
              </motion.div>
            ))}
          </AnimatePresence>
        );
      default:
        return null;
    }
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
          <ListItem button key={item.text} component={Link} to={item.path} onClick={() => navigate(item.path)}>
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
            {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
          </Typography>
          {currentView !== 'faculties' && (
            <IconButton color="inherit" onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Button color="inherit" onClick={() => handleModalOpen(currentView.slice(0, -1))}>
            Create {currentView.slice(0, -1)}
          </Button>
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer
        variant="temporary"
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
          backgroundColor: theme.palette.grey[200],
          minHeight: '100vh',
        }}
      >
        {renderContent()}
      </Box>
      <StyledFab color="primary" aria-label="add" onClick={() => handleModalOpen(currentView.slice(0, -1))}>
        <AddIcon />
      </StyledFab>
      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle>Create {modalType}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.name || ''}
            onChange={handleInputChange}
          />
          {modalType === 'course' && (
            <>
              <TextField
                margin="dense"
                name="code"
                label="Course Code"
                type="text"
                fullWidth
                variant="standard"
                value={formData.code || ''}
                onChange={handleInputChange}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Lecturer</InputLabel>
                <Select
                  name="lecturer"
                  value={formData.lecturer || ''}
                  onChange={handleInputChange}
                  label="Lecturer"
                >
                  {lecturers.map((lecturer) => (
                    <MenuItem key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleSetHead}>Set Head</MenuItem>
      </Menu>
      <Dialog open={isHeadDialogOpen} onClose={() => setIsHeadDialogOpen(false)}>
        <DialogTitle>Select Head</DialogTitle>
        <DialogContent>
          <List>
            {[...lecturers, ...admins].map((person) => (
              <ListItem button key={person.id} onClick={() => handleHeadSelection(person)}>
                <ListItemText primary={person.name} secondary={person.email} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </Box>
  );
}

export default Courses;
