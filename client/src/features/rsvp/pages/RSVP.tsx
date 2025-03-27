import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useRSVP } from '../hooks/useRSVP';
import { RSVPFormData } from '../types/rsvpTypes';

/**
 * RSVPForm component
 * Renders a form for users to submit an RSVP
 */
const RSVPForm = () => {
  // ✅ Custom hook to handle RSVP logic (query/mutations)
  const { createRSVP, loading } = useRSVP();

  // ✅ Local state for form inputs
  const [formData, setFormData] = useState<RSVPFormData>({
    fullName: '',
    email: '',
    attending: '',
    guests: 0,
    notes: '',
  });

  // ✅ Snackbar messages for success/error feedback
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handle changes in TextField inputs
   * Converts "guests" to number
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value,
    }));
  };

  /**
   * Handle changes in Select inputs (attending)
   */
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name as keyof RSVPFormData]: value,
    }));
  };

  /**
   * Handle form submission
   * Runs basic validation before calling the mutation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Basic form validation
    if (!formData.fullName || !formData.email || !formData.attending) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    try {
      // ✅ Submit RSVP with cleaned data
      await createRSVP({
        ...formData,
        guests: Number(formData.guests),
      });

      // ✅ Show success message + reset form
      setSuccessMessage('RSVP submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        attending: '',
        guests: 0,
        notes: '',
      });
    } catch (error: unknown) {
      // ✅ Catch block handling unknown error
      const errMsg = error instanceof Error ? error.message : 'Something went wrong.';
      setErrorMessage(errMsg);
    }
  };

  /**
   * Reset snackbars on close
   */
  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Container maxWidth="sm">
      {/* Page title */}
      <Typography variant="h4" gutterBottom align="center">
        RSVP Form
      </Typography>

      {/* Main form container */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          mt: 2,
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        {/* Full Name Field */}
        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Email Field */}
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Attending Select Field */}
        <FormControl fullWidth required margin="normal">
          <InputLabel id="attending-label">Attending?</InputLabel>
          <Select
            labelId="attending-label"
            name="attending"
            value={formData.attending}
            onChange={handleSelectChange}
            label="Attending?"
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="maybe">Maybe</MenuItem>
          </Select>
        </FormControl>

        {/* Guests Field */}
        <TextField
          label="Number of Guests"
          name="guests"
          type="number"
          value={formData.guests}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        {/* Notes Field */}
        <TextField
          label="Notes (optional)"
          name="notes"
          multiline
          rows={4}
          value={formData.notes}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Submit RSVP'}
        </Button>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RSVPForm;
