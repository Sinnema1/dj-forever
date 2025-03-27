import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const ResponsiveSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn } = useAuth(); // Retrieve authentication status

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Drawer content with conditional rendering for RSVP
  const drawerContent = (
    <Box onClick={isMobile ? handleDrawerToggle : undefined} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        DJ Forever
      </Typography>
      <Divider />

      <List>
        {/* Home Link (Always Visible) */}
        <ListItem disablePadding>
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            {({ isActive }) => (
              <ListItemButton selected={isActive}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            )}
          </NavLink>
        </ListItem>

        {/* Dashboard Link (Always Visible) */}
        <ListItem disablePadding>
          <NavLink
            to="/dashboard"
            style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
          >
            {({ isActive }) => (
              <ListItemButton selected={isActive}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            )}
          </NavLink>
        </ListItem>

        {/* RSVP Link (Visible only when logged in) */}
        {isLoggedIn && (
          <ListItem disablePadding>
            <NavLink
              to="/rsvp"
              style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
            >
              {({ isActive }) => (
                <ListItemButton selected={isActive}>
                  <ListItemIcon>
                    <EventAvailableIcon />
                  </ListItemIcon>
                  <ListItemText primary="RSVP" />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      {/* AppBar displayed on mobile */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              DJ Forever
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box component="nav">
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>
    </>
  );
};

export default ResponsiveSidebar;
