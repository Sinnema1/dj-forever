import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';

import { useRSVP } from '../hooks/useRSVP';
import { RSVP } from '../types/rsvpTypes';

const RSVPList = () => {
  const { rsvps, loading, error } = useRSVP();

  if (error) {
    return <Alert severity="error">Failed to load RSVPs.</Alert>;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <TableContainer component={Paper} sx={{ mt: 4, overflowX: 'auto' }}>
        <Typography variant="h5" sx={{ m: 2 }}>
          RSVP List
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Attending</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rsvps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No RSVPs found.
                </TableCell>
              </TableRow>
            ) : (
              rsvps.map((rsvp: RSVP) => (
                <TableRow key={rsvp._id}>
                  <TableCell>{rsvp.fullName}</TableCell>
                  <TableCell>{rsvp.email}</TableCell>
                  <TableCell>
                    {rsvp.attending === 'yes'
                      ? 'Yes'
                      : rsvp.attending === 'no'
                        ? 'No'
                        : rsvp.attending === 'maybe'
                          ? 'Maybe'
                          : '-'}
                  </TableCell>
                  <TableCell>{rsvp.guests}</TableCell>
                  <TableCell>{rsvp.notes || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RSVPList;
