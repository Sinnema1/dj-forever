import React from 'react';
import { useNavigate } from 'react-router-dom';

// MUI Components
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';

// Hooks & Context
import { useAuth } from '../../../context/AuthContext';
import { useRSVP } from '../../rsvp/hooks/useRSVP';
import { useUsers } from '../../users/hooks/useUsers';

const Dashboard = () => {
  const navigate = useNavigate();

  // ✅ Grab logged-in user from AuthContext (always call hooks at the top level)
  const { user } = useAuth();

  // ✅ Ensure a user ID exists (fallback to an empty string to satisfy TS)
  const userId = user?._id || '';

  // ✅ Always call hooks outside conditionals
  const { rsvps: rsvpData, loading: rsvpLoading, error: rsvpError } = useRSVP();

  const { user: userData, loading: userLoading, error: userError } = useUsers(userId);

  // ✅ Conditional UI logic (after hooks are called)

  // Handle case: User not loaded yet
  if (!user) {
    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6">Loading user...</Typography>
      </Box>
    );
  }

  // Handle loading state for either RSVP or user data
  if (rsvpLoading || userLoading) {
    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state for either RSVP or user data
  if (rsvpError || userError) {
    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Alert severity="error">Failed to load dashboard data.</Alert>
      </Box>
    );
  }

  // ✅ If all data is available, render the dashboard
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Welcome message */}
      <Typography variant="h4" gutterBottom>
        Welcome, {user.fullName || 'Guest'}!
      </Typography>

      <Grid container spacing={3}>
        {/* RSVP Summary Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">RSVP Summary</Typography>
              <Typography variant="h4">
                {rsvpData.length} RSVP{rsvpData.length === 1 ? '' : 's'}
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/rsvp')}>
                Manage RSVPs
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* User Profile Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Your Profile</Typography>
              <Typography>Name: {userData?.fullName || 'N/A'}</Typography>
              <Typography>Email: {userData?.email || 'N/A'}</Typography>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/profile')}>
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
