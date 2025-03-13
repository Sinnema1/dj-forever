import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar'; // or ResponsiveSidebar
import Footer from './Footer';
import { Box } from '@mui/material';

/**
 * AppLayout component wraps the app's layout with Navbar, Sidebar, and Footer.
 */
const AppLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: { md: '240px' }, // shifts content for the sidebar
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default AppLayout;
