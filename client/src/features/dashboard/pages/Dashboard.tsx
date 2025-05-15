// client/src/features/dashboard/pages/Dashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '../../../context/AuthContext';
import { useRSVP } from '../../rsvp/hooks/useRSVP';

import { useMe } from '../../users/hooks/useUsers';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const { user, loading: meLoading, error: meError } = useMe();
  const { rsvp: userRsvp, loading: rsvpLoading, error: rsvpError } = useRSVP();

  if (!authUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Loading auth state…</Typography>
      </Box>
    );
  }

  // wait on both me & RSVP

  if (rsvpLoading || meLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (rsvpError || meError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load dashboard data.</Alert>
      </Box>
    );
  }

  // now safe to read `user` from useMe()

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Unable to fetch your profile.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.fullName}!
      </Typography>

      {user.isInvited ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Your RSVP</Typography>

                {userRsvp ? (
                  <>
                    <Typography>
                      <strong>Attending:</strong> {userRsvp.attending === 'YES' ? 'Yes' : 'No'}
                    </Typography>
                    <Typography>
                      <strong>Meal:</strong> {userRsvp.mealPreference}
                    </Typography>
                    <Typography>
                      <strong>Allergies:</strong> {userRsvp.allergies || 'None'}
                    </Typography>
                    <Typography>
                      <strong>Notes:</strong> {userRsvp.additionalNotes || 'None'}
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/rsvp')}>
                      Edit RSVP
                    </Button>
                  </>
                ) : (
                  <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/rsvp')}>
                    Submit RSVP
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Your Profile</Typography>

                <Typography>Name: {user.fullName}</Typography>
                <Typography>Email: {user.email}</Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/profile')}>
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1">
          You are not on the invited list. Please contact the organizer if this is an error.
        </Typography>
      )}
    </Box>
  );
};

export default Dashboard;
