import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  // Initialize the navigate function from React Router
  const navigate = useNavigate();

  // Handler for the Get Started button click
  const handleGetStarted = () => {
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <Box
      sx={{
        py: 8,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
        color: '#fff',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to DJ Forever
        </Typography>
        <Typography variant="h5" gutterBottom>
          Your Ultimate Event RSVP Management Platform
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 4 }}
          onClick={handleGetStarted} // Navigate to /login on click
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default Home;
