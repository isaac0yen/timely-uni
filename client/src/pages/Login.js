import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import Session from '../helpers/Session';
import { api } from '../apis';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: 400,
  margin: '0 auto',
}));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.account.login(email, password);
      console.log(response);

      if (response.status === 200) {
        Session.setCookie('token', response.token);
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ color: 'white', textDecoration: 'none' }}>
            Lecture Reminder System
          </Typography>
        </Toolbar>
      </StyledAppBar>

      <Container component="main" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
            Kindly Login
          </Typography>
          <StyledForm onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="email"
              label="Email address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
            <TextField
              fullWidth
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <MuiLink component={Link} to="/forgot-password" variant="body2">
                Forgot password?
              </MuiLink>
            </Box>
          </StyledForm>
        </motion.div>
      </Container>

      <StyledAppBar position="static" component="footer">
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/select-role"
            color="inherit"
            startIcon={<RegisterIcon />}
          >
            Register
          </Button>
        </Toolbar>
      </StyledAppBar>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};

export default LoginPage;