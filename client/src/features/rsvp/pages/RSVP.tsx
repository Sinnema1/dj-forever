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
 * RSVPForm component renders the RSVP submission form.
 */
const RSVPForm: React.FC = () => {
  // Get the createRSVP function and loading state from the custom useRSVP hook.
  const { createRSVP, loading } = useRSVP();

  // Local state for the RSVP form data, typed with RSVPFormData.
  const [formData, setFormData] = useState<RSVPFormData>({
    fullName: '',
    email: '',
    attending: '',
    guests: 0,
    notes: '',
  });

  // Local state for feedback messages.
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Updates formData when a text field changes.
   * Converts "guests" input to a number.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // If the field is 'guests', convert the value to a number
      [name]: name === 'guests' ? Number(value) : value,
    }));
  };

  /**
   * Updates formData when the Select field changes.
   */
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof RSVPFormData]: value,
    }));
  };

  /**
   * Handles the form submission.
   * Validates the required fields and calls createRSVP mutation.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.fullName || !formData.email || !formData.attending) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    try {
      // Submit the RSVP data.
      await createRSVP({
        ...formData,
        guests: Number(formData.guests), // ensure guests is a number
      });
      // On success, show a success message and reset the form.
      setSuccessMessage('RSVP submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        attending: '',
        guests: 0,
        notes: '',
      });
    } catch (error: unknown) {
      // Safely narrow the error type.
      const errMsg =
        error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setErrorMessage(errMsg);
    }
  };

  /**
   * Closes any open snackbar messages.
   */
  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Container maxWidth="sm">
      {/* Page Title */}
      <Typography variant="h4" gutterBottom align="center">
        RSVP Form
      </Typography>

      {/* Form Container */}
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
          autoFocus
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

        {/* Number of Guests Field */}
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
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }} role="alert">
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
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }} role="alert">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RSVPForm;
