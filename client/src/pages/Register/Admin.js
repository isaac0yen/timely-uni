import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  VerifiedUser as VerifiedUserIcon,
  Send as SendIcon,
  Home as HomeIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { api } from '../../apis/index';
import Session from '../../helpers/Session';
import { subscribeToPushNotifications } from '../../pushNotifications';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  [theme.breakpoints.up('md')]: {
    maxWidth: 800,
  },
}));

const SendConfirmMail = ({ updateState }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await api.account.sendCode(email);
      console.log(result);
      if (result.status === 200) {
        toast.success('Confirmation email sent successfully');

        setTimeout(() => {
          setIsSent(true);
          updateState(true);
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while sending the confirmation email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <StyledCard>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="textPrimary">
            <EmailIcon fontSize="large" /> Send Confirmation Email
          </Typography>
          <StyledForm onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
            />
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              type="submit"
              disabled={isLoading || isSent}
              startIcon={isSent ? <VerifiedUserIcon /> : <SendIcon />}
            >
              {isLoading ? <CircularProgress size={24} /> : isSent ? 'Sent' : 'Send Confirmation'}
            </Button>
          </StyledForm>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

const AdminRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
    phone: '',
    fcm_token: Session.getLocalStorage("wp")
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.code.trim()) newErrors.code = 'Verification code is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    requestNotificationPermission();
  }, [])
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      const { name, email, password, code, phone } = formData;

      try {
        const registered = await api.user.createAdmin({ name, email, password, code, phone });
        if (registered.status === 200) {
          toast.success('Admin created successfully');
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.error(registered.message || 'Something went wrong');
        }
      } catch (error) {
        toast.error(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="textPrimary">
          Admin Registration
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            InputProps={{
              startAdornment: <PersonIcon color="action" />,
            }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            InputProps={{
              startAdornment: <EmailIcon color="action" />,
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            required
            InputProps={{
              startAdornment: <LockIcon color="action" />,
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required
            InputProps={{
              startAdornment: <LockIcon color="action" />,
            }}
          />
          <TextField
            fullWidth
            label="Verification Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            error={!!errors.code}
            helperText={errors.code}
            required
            InputProps={{
              startAdornment: <VerifiedUserIcon color="action" />,
            }}
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            required
            InputProps={{
              startAdornment: <PhoneIcon color="action" />,
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="inherit"
            type="submit"
            size="large"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </StyledForm>
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please correct the errors in the form before submitting.
          </Alert>
        )}
      </CardContent>
    </StyledCard>
  );
};

const Admin = () => {
  const [hasSentMail, setHasSentMail] = useState(false);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ color: 'white', textDecoration: 'none', flexGrow: 1 }}>
            Lecture Reminder System
          </Typography>
        </Toolbar>
      </StyledAppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!hasSentMail ? (
            <SendConfirmMail updateState={setHasSentMail} />
          ) : (
            <AdminRegistrationForm />
          )}
        </motion.div>
      </Container>

      <StyledAppBar position="static" component="footer">
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            startIcon={<LoginIcon />}
          >
            Login
          </Button>
        </Toolbar>
      </StyledAppBar>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Box>
  );
};

export default Admin;