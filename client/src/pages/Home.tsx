import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

const Home: React.FC = () => {
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
        <Button variant="contained" color="secondary" sx={{ mt: 4 }}>
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default Home;