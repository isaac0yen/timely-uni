import React, { useEffect, useState } from 'react';
import {
  AppBar, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
  Drawer, Fab, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem,
  TextField, Toolbar, Typography, useTheme, styled, Select, InputLabel, FormControl,
  Avatar, CircularProgress, Grid, Breadcrumbs
} from '@mui/material';
import {
  Menu as MenuIcon, Home as HomeIcon, Book as BookIcon,
  Schedule as ScheduleIcon, MeetingRoom as RoomIcon, ExitToApp as LogoutIcon,
  Add as AddIcon, MoreVert as MoreVertIcon, ArrowBack as ArrowBackIcon,
  Repeat as RepeatIcon,
  ThumbUp,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import isLoggedIn from '../helpers/IsLoggedIn';
import { api } from '../apis';
import { motion, AnimatePresence } from 'framer-motion';
import Session from '../helpers/Session';

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

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

function Courses() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [levels] = useState([
    { id: 100, name: '100 Level' },
    { id: 200, name: '200 Level' },
    { id: 300, name: '300 Level' },
    { id: 400, name: '400 Level' },
    { id: 500, name: '500 Level' },
  ]);
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
  const [currentDepartmentId, setCurrentDepartmentId] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState([{ text: 'Faculties', onClick: () => setCurrentView('faculties') }]);

  useEffect(() => {
    const process = async () => {
      setIsLoading(true);
      try {
        const loggedInUser = isLoggedIn();
        if (loggedInUser === false) {
          navigate('/');
        } else {
          const userResponse = await api.account.getAccount(isLoggedIn().id);
          setUser(userResponse.data);
          await fetchFaculties();
        }

        const [lecturersResponse, adminsResponse] = await Promise.all([
          api.user.getAllLecturers(),
          api.user.getAllAdmins()
        ]);
        setLecturers(lecturersResponse.data);
        setAdmins(adminsResponse.data);
      } catch (error) {
        console.error('Error during initialization:', error);
        toast.error('Failed to load initial data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    process();
  }, [navigate]);

  const fetchFaculties = async () => {
    setIsLoading(true);
    try {
      const response = await api.faculty.getAllFaculties();
      setFaculties(response.data);
      setCurrentView('faculties');
      setBreadcrumbs([{ text: 'Faculties', onClick: () => setCurrentView('faculties') }]);
    } catch (error) {
      console.error('No faculties found:', error);
      toast.error('No faculties found. Please try again.');
      setFaculties([]);
      setCurrentView('faculties');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async (facultyId) => {
    setIsLoading(true);
    try {
      const response = await api.department.getAllDepartments(facultyId);
      setDepartments(response.data);
      setCurrentView('departments');
      setCurrentFacultyId(facultyId);
      updateBreadcrumbs('departments', facultyId);
    } catch (error) {
      console.error('No departments found:', error);
      setDepartments([]);
      setCurrentView('departments');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async (id, level) => {
    setIsLoading(true);
    try {
      const response = await api.course.getAllCourses(id, level);
      const filteredCourses = response.data.filter(course => 
        course.level === level && course.department === id
      );
      setCourses(filteredCourses);
      setCurrentView('courses');
      setCurrentLevel(level);
      updateBreadcrumbs('courses', level);
    } catch (error) {
      console.error('No courses found:', error);
      setCourses([]);
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
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
            faculty: currentFacultyId,
            created_by: user.id
          });
          await fetchDepartments(currentFacultyId);
          break;
        case 'course':
          response = await api.course.createCourse({
            ...formData,
            department: currentDepartmentId,
            faculty: currentFacultyId,
            level: currentLevel,
            created_by: user.id
          });
          await fetchCourses(currentDepartmentId, currentLevel);
          break;
        default:
          throw new Error('Invalid modal type');
      }
      if (response && response.data) {
        toast.success(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} created successfully: ${response.data.name || response.data.title}`);
        handleModalClose();
      } else {
        toast.success(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} created successfully`);
      }
    } catch (error) {
      console.error(`Error creating ${modalType}:`, error);
      toast.error(`Error creating ${modalType}: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
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
      toast.error('No lecturers found and admins');
    }
  };

  const handleHeadSelection = async (selectedHead) => {
    setIsLoading(true);
    try {
      if (currentView === 'faculties') {
        await api.faculty.updateFaculty(selectedItem.id, { head: selectedHead.id });
        await fetchFaculties();
      } else if (currentView === 'departments') {
        await api.department.updateDepartment(selectedItem.id, { head: selectedHead.id });
        await fetchDepartments(currentFacultyId);
      }
      toast.success('Head updated successfully');
      setIsHeadDialogOpen(false);
    } catch (error) {
      console.error('Error updating head:', error);
      toast.error('Error updating head');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentView === 'departments') {
      setCurrentView('faculties');
      fetchFaculties();
    } else if (currentView === 'levels') {
      setCurrentView('departments');
      fetchDepartments(currentFacultyId);
    } else if (currentView === 'courses') {
      setCurrentView('levels');
    }
    updateBreadcrumbs(currentView, null, true);
  };

  const updateBreadcrumbs = (view, id) => {
    let newBreadcrumbs = [{ text: 'Faculties', onClick: () => {
      setCurrentView('faculties');
      fetchFaculties();
    }}];
    
    if (view === 'departments') {
      const faculty = faculties.find(f => f.id === id);
      newBreadcrumbs.push({ 
        text: faculty ? faculty.name : 'Departments', 
        onClick: () => fetchDepartments(id) 
      });
    } else if (view === 'levels') {
      const faculty = faculties.find(f => f.id === currentFacultyId);
      const department = departments.find(d => d.id === id);
      newBreadcrumbs.push(
        { text: faculty ? faculty.name : 'Faculty', onClick: () => fetchDepartments(currentFacultyId) },
        { text: department ? department.name : 'Levels', onClick: () => {
          setCurrentView('levels');
          setCurrentDepartmentId(id);
        }}
      );
    } else if (view === 'courses') {
      const faculty = faculties.find(f => f.id === currentFacultyId);
      const department = departments.find(d => d.id === currentDepartmentId);
      newBreadcrumbs.push(
        { text: faculty ? faculty.name : 'Faculty', onClick: () => fetchDepartments(currentFacultyId) },
        { text: department ? department.name : 'Department', onClick: () => {
          setCurrentView('levels');
          setCurrentDepartmentId(currentDepartmentId);
        }},
        { text: `${id} Level Courses`, onClick: () => fetchCourses(currentDepartmentId, id) }
      );
    }
    
    setBreadcrumbs(newBreadcrumbs);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'faculties':
        return (
          <ContentWrapper>
            <Typography variant="h4" gutterBottom color="black">Faculties</Typography>
            {faculties.length === 0 ? (
              <Typography variant="body1" color="black">No faculties available. Use the button above to add a new faculty.</Typography>
            ) : (
              <Grid container spacing={3}>
                <AnimatePresence>
                  {faculties.map((faculty) => (
                    <Grid item xs={12} sm={6} md={4} key={faculty.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StyledCard>
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                              <Typography variant="h6">{faculty.name}</Typography>
                              <IconButton onClick={(e) => handleMenuOpen(e, faculty)}>
                                <MoreVertIcon />
                              </IconButton>
                            </Box>
                            <Button variant="outlined" fullWidth onClick={() => fetchDepartments(faculty.id)}>
                              View Departments
                            </Button>
                          </CardContent>
                        </StyledCard>
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            )}
          </ContentWrapper>
        );
      case 'departments':
        return (
          <ContentWrapper>
            <Typography variant="h4" gutterBottom color="black">Departments</Typography>
            {departments.length === 0 ? (
              <Typography variant="body1" color="black">No departments available. Use the button above to add a new department.</Typography>
            ) : (
              <Grid container spacing={3}>
                <AnimatePresence>
                  {departments.map((department) => (
                    <Grid item xs={12} sm={6} md={4} key={department.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StyledCard>
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                              <Typography variant="h6">{department.name}</Typography>
                              <IconButton onClick={(e) => handleMenuOpen(e, department)}>
                                <MoreVertIcon />
                              </IconButton>
                            </Box>
                            <Button
                              variant="outlined"
                              fullWidth
                              onClick={() => {
                                setCurrentView('levels');
                                setCurrentDepartmentId(department.id);
                                updateBreadcrumbs('levels', department.id);
                              }}
                            >
                              View Levels
                            </Button>
                          </CardContent>
                        </StyledCard>
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            )}
          </ContentWrapper>
        );
      case 'levels':
        return (
          <ContentWrapper>
            <Typography variant="h4" gutterBottom color="black">Levels</Typography>
            <Grid container spacing={3}>
              <AnimatePresence>
                {levels.map((level) => (
                  <Grid item xs={12} sm={6} md={4} key={level.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StyledCard>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>{level.name}</Typography>
                          <Button 
                            variant="outlined" 
                            fullWidth 
                            onClick={() => {
                              fetchCourses(currentDepartmentId, level.id);
                              setCurrentLevel(level.id);
                            }}
                          >
                            View Courses
                          </Button>
                        </CardContent>
                      </StyledCard>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </ContentWrapper>
        );
      case 'courses':
        return (
          <ContentWrapper>
            <Typography variant="h4" gutterBottom color="black">Courses</Typography>
            {courses.length === 0 ? (
              <Typography variant="body1" color="black">No courses available. Use the button above to add a new course.</Typography>
            ) : (
              <Grid container spacing={3}>
                <AnimatePresence>
                  {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StyledCard>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>{course.name}</Typography>
                            <Typography variant="body2" color="textSecondary">{course.code}</Typography>
                          </CardContent>
                        </StyledCard>
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            )}
          </ContentWrapper>
        );
      default:
        return null;
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'faculty':
        return (
          <>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Faculty Name"
              type="text"
              fullWidth
              variant="standard"
              value={formData.name || ''}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Head</InputLabel>
              <Select
                name="head"
                value={formData.head || ''}
                onChange={handleInputChange}
                label="Head"
              >
                {lecturers.map((lecturer) => (
                  <MenuItem key={lecturer.id} value={lecturer.id}>
                    {lecturer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case 'department':
        return (
          <>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Department Name"
              type="text"
              fullWidth
              variant="standard"
              value={formData.name || ''}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Faculty</InputLabel>
              <Select
                name="faculty"
                value={formData.faculty || currentFacultyId || ''}
                onChange={handleInputChange}
                label="Faculty"
              >
                {faculties.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Head</InputLabel>
              <Select
                name="head"
                value={formData.head || ''}
                onChange={handleInputChange}
                label="Head"
              >
                {lecturers.map((lecturer) => (
                  <MenuItem key={lecturer.id} value={lecturer.id}>
                    {lecturer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case 'course':
        return (
          <>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Course Name"
              type="text"
              fullWidth
              variant="standard"
              value={formData.name || ''}
              onChange={handleInputChange}
            />
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
            <FormControl fullWidth margin="dense">
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department || currentDepartmentId || ''}
                onChange={handleInputChange}
                label="Department"
              >
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="level"
              label="Level"
              type="number"
              fullWidth
              variant="standard"
              value={formData.level || currentLevel || ''}
              onChange={handleInputChange}
            />
          </>
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
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
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
          {(currentView === 'faculties' || currentView === 'departments' || currentView === 'courses') && (
            <Button 
              color="inherit" 
              onClick={() => handleModalOpen(currentView === 'faculties' ? 'faculty' : currentView.slice(0, -1))}
            >
              Create {currentView === 'faculties' ? 'Faculty' : currentView.slice(0, -1)}
            </Button>
          )}
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawerContent}
      </StyledDrawer>
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
        open
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
        }}
      >
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => (
            <Typography
              key={index}
              color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
              style={{ cursor: 'pointer' }}
              onClick={crumb.onClick}
            >
              {crumb.text}
            </Typography>
          ))}
        </Breadcrumbs>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress size={60} />
          </Box>
        ) : (
          renderContent()
        )}
      </Box>
      {(currentView === 'faculties' || currentView === 'departments' || currentView === 'courses') && (
        <StyledFab 
          color="primary" 
          aria-label="add" 
          onClick={() => handleModalOpen(currentView === 'faculties' ? 'faculty' : currentView.slice(0, -1))}
        >
          <AddIcon />
        </StyledFab>
      )}
      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle>Create {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</DialogTitle>
        <DialogContent>
          {renderModalContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
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

