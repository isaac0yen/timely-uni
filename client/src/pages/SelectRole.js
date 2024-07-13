import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AdminPanelSettings as AdminIcon,
  School as LecturerIcon,
  Person as StudentIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const RoleBox = ({ role, title, icon: Icon }) => (
  <Grid item xs={12} sm={6} md={4}>
    <StyledCard component={Link} to={`/register/${role}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
        <Icon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'black' }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ color: 'black' }}>
            Click to continue as {title}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  </Grid>
);

const SelectRole = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ color: 'white', textDecoration: 'none', flexGrow: 1 }}>
            Lecture Reminder System
          </Typography>
        </Toolbar>
      </StyledAppBar>

      <Container component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
            Lecture Reminder System
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ color: 'black' }}>
            Choose your role to get started
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
            <RoleBox role="admin" title="Admin" icon={AdminIcon} />
            <RoleBox role="lecturer" title="Lecturer" icon={LecturerIcon} />
            <RoleBox role="student" title="Student" icon={StudentIcon} />
          </Grid>
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
    </Box>
  );
};

export default SelectRole;