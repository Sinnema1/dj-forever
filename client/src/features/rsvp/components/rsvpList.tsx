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

const RSVPList = () => {
  const { rsvp, loading, error } = useRSVP();

  if (loading) return <CircularProgress />;
  if (error)   return <Alert severity="error">Failed to load RSVP.</Alert>;

  // Treat the single object as a one-element list
  const rows = rsvp ? [rsvp] : [];

  return (
    <Box>
      <Typography variant="h5" sx={{ m: 2 }}>
        Your RSVP
      </Typography>

      {rows.length === 0 ? (
        <Alert severity="info">No RSVP submitted yet.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Attending</TableCell>
                <TableCell>Meal</TableCell>
                <TableCell>Allergies</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Submitted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.attending ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{r.mealPreference}</TableCell>
                  <TableCell>{r.allergies || '-'}</TableCell>
                  <TableCell>{r.additionalNotes || '-'}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RSVPList;