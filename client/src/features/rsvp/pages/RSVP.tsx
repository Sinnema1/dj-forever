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
    attending: false,
    mealPreference: '',
    allergies: '',
    additionalNotes: '',
  });

  // ✅ Snackbar messages for success/error feedback
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handle changes in TextField inputs
   * Converts "guests" to number
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Handle changes in Select inputs (attending)
   */
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle form submission
   * Runs basic validation before calling the mutation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Basic form validation
    if (!formData.fullName || typeof formData.attending !== 'boolean' || !formData.mealPreference) {
      setErrorMessage('Please fill out all required fields, including meal preference.');
      return;
    }

    try {
      // ✅ Submit RSVP with cleaned data
      await createRSVP({
        ...formData,
      });

      // ✅ Show success message + reset form
      setSuccessMessage('RSVP submitted successfully!');
      setFormData({
        fullName: '',
        attending: false,
        mealPreference: '',
        allergies: '',
        additionalNotes: '',
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

        {/* Attending Select Field */}
        <FormControl fullWidth required margin="normal">
          <InputLabel id="attending-label">Attending?</InputLabel>
          <Select
            labelId="attending-label"
            name="attending"
            value={formData.attending ? 'yes' : 'no'}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, attending: e.target.value === 'yes' }))
            }
            label="Attending?"
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </Select>
        </FormControl>

        {/* Meal Preference Field */}
        <TextField
          label="Meal Preference"
          name="mealPreference"
          value={formData.mealPreference}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Allergies Field */}
        <TextField
          label="Allergies (optional)"
          name="allergies"
          value={formData.allergies}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        {/* Additional Notes Field */}
        <TextField
          label="Additional Notes (optional)"
          name="additionalNotes"
          multiline
          rows={4}
          value={formData.additionalNotes}
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
