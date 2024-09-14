import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Button, AppBar, Toolbar, Box } from '@mui/material';
import { Home as HomeIcon, Login as LoginIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  textAlign: 'center',
}));

const AnimatedTypography = styled(Typography)(({ theme }) => ({
  animation: '$fadeIn 1s ease-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(-20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  animation: '$slideUp 0.5s ease-out 0.5s both',
  '@keyframes slideUp': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}));

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ color: 'white', textDecoration: 'none' }}>
            Lecture Reminder System
          </Typography>
        </Toolbar>
      </AppBar>

      <StyledContainer maxWidth="sm">
        <AnimatedTypography variant="h1" color="primary" gutterBottom>
          404
        </AnimatedTypography>
        <AnimatedTypography variant="h4" gutterBottom>
          Page Not Found
        </AnimatedTypography>
        <AnimatedTypography variant="body1" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </AnimatedTypography>
        <AnimatedButton
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGoHome}
          startIcon={<HomeIcon />}
        >
          Go to Home Page
        </AnimatedButton>
      </StyledContainer>

      <AppBar position="static" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/login" startIcon={<LoginIcon />}>
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register" startIcon={<PersonAddIcon />}>
            Register
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ErrorPage;