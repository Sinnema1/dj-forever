import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useRSVP } from '../hooks/useRSVP';

/**
 * Form data structure for RSVP
 */
interface RSVPFormData {
  fullName: string;
  email: string;
  attending: string;
  guests: number;
  notes: string;
}

const RSVPForm = () => {
  const { createRSVP, loading } = useRSVP();

  const [formData, setFormData] = useState<RSVPFormData>({
    fullName: '',
    email: '',
    attending: '',
    guests: 0,
    notes: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handles changes for text fields
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'guests' ? Number(value) : value,
    }));
  };

  /**
   * Handles changes for select dropdowns
   */
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name as keyof RSVPFormData]: value,
    }));
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.attending) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    try {
      await createRSVP(formData);

      setSuccessMessage('RSVP submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        attending: '',
        guests: 0,
        notes: '',
      });
    } catch (error: unknown) {
      // Safely handle unknown errors
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Something went wrong.');
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    }
  };

  /**
   * Handles closing of snackbars
   */
  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const isFormIncomplete = !formData.fullName || !formData.email || !formData.attending;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Submit RSVP
      </Typography>

      {/* Full Name */}
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

      {/* Email */}
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

      {/* Attending Select */}
      <FormControl fullWidth required margin="normal">
        <InputLabel>Attending</InputLabel>
        <Select
          name="attending"
          value={formData.attending}
          onChange={handleSelectChange}
          label="Attending"
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
          <MenuItem value="maybe">Maybe</MenuItem>
        </Select>
      </FormControl>

      {/* Number of Guests */}
      <TextField
        label="Guests"
        name="guests"
        type="number"
        value={formData.guests}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />

      {/* Notes */}
      <TextField
        label="Notes (optional)"
        name="notes"
        value={formData.notes}
        onChange={handleInputChange}
        fullWidth
        multiline
        rows={3}
        margin="normal"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading || isFormIncomplete}
      >
        {loading ? <CircularProgress size={24} /> : 'Submit RSVP'}
      </Button>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {successMessage ? (
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: '100%' }}
            role="alert"
          >
            {successMessage}
          </Alert>
        ) : (
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }} role="alert">
            {errorMessage}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default RSVPForm;
