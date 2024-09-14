import React, { useEffect, useState } from 'react';
import { api } from '../apis';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import isLoggedIn from '../helpers/IsLoggedIn';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Avatar,
  CircularProgress,
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
  Repeat as RepeatIcon,
  ExpandMore as ExpandMoreIcon,
  ThumbUp,
} from '@mui/icons-material';
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

function CarryOver() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFaculty, setExpandedFaculty] = useState(false);
  const [expandedDepartment, setExpandedDepartment] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      await fetchUser();
      await fetchFaculties();
      await fetchDepartments();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchUser = async () => {
    const loggedInUser = isLoggedIn();
    if (loggedInUser === false) {
      navigate('/');
    } else {
      try {
        const userResponse = await api.user.getStudent(loggedInUser.id);
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Error fetching user data. Please try again.');
      }
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await api.faculty.getAllFaculties();
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
      toast.error('Error fetching faculties. Please try again.');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.department.getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Error fetching departments. Please try again.');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.course.getAllCourses(user.id, user.level);
      setCourses(response.data);
    } catch (error) {
      console.error('No courses found:', error);
      toast.error('No courses found. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleAddCarryOver = async () => {
    try {
      await api.account.addCarryOver({ user_id: user.id, course_id: selectedCourse.id, course_name: selectedCourse.name });
      setIsModalOpen(false);
      toast.success('Course added as carry over successfully');
    } catch (error) {
      console.error('Error adding carry over course:', error);
      toast.error(error?.response?.data?.message || 'Error adding carry over course. Please try again.');
    }
  };

  const handleFacultyChange = (panel) => (event, isExpanded) => {
    setExpandedFaculty(isExpanded ? panel : false);
  };

  const handleDepartmentChange = (panel) => (event, isExpanded) => {
    setExpandedDepartment(isExpanded ? panel : false);
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
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
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
      <ToastContainer />
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Carry Over Courses
          </Typography>
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerContent}
      </StyledDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
          mt: ['64px', '64px', '64px'],
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Faculties and Departments
            </Typography>
            {faculties.length > 0 ? (
              faculties.map((faculty) => (
                <Accordion key={faculty.id} expanded={expandedFaculty === faculty.id} onChange={handleFacultyChange(faculty.id)}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{faculty.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {departments.filter((dept) => dept.faculty === faculty.id).length > 0 ? (
                      departments
                        .filter((dept) => dept.faculty === faculty.id)
                        .map((department) => (
                          <Accordion key={department.id} expanded={expandedDepartment === department.id} onChange={handleDepartmentChange(department.id)}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography>{department.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {courses.filter((course) => course.department === department.id).length > 0 ? (
                                courses
                                  .filter((course) => course.department === department.id)
                                  .map((course) => (
                                    <Card key={course.id} sx={{ mb: 2 }}>
                                      <CardContent>
                                        <Typography variant="h6">{course.name}</Typography>
                                        <Typography color="textSecondary">
                                          {course.code}
                                        </Typography>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={() => handleCourseClick(course)}
                                          sx={{ mt: 2 }}
                                        >
                                          Add as Carry Over
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  ))
                              ) : (
                                <Typography>No courses found for this department.</Typography>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        ))
                    ) : (
                      <Typography>No departments found for this faculty.</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography>No faculties found.</Typography>
            )}
          </>
        )}
      </Box>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Add Carry Over Course</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to add {selectedCourse?.name} as a carry over course?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCarryOver} sx={{ backgroundColor: 'grey.500' }}>
            Add Carry Over
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CarryOver;