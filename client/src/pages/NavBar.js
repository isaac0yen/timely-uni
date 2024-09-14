import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu as MenuIcon, Notifications, Settings } from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2 30%, #2196F3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
}));

const NavBar = ({ handleDrawerToggle, user }) => {
  return (
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
          Lecture Reminder
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit">
            <Settings />
          </IconButton>
          <Avatar
            sx={{ ml: 2 }}
            alt={user?.name}
            src="/path-to-user-image.jpg"
          />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavBar;
