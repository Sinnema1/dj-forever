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

const RSVPFormPage: React.FC = () => {
  // use the updated hook method name
  const { submitRSVP, loading } = useRSVP();

  // Initialize with valid defaults
  const [formData, setFormData] = useState<RSVPFormData>({
    attending: 'YES',
    mealPreference: '',
    allergies: '',
    additionalNotes: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as keyof RSVPFormData]: value as any,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.attending || !formData.mealPreference) {
      setErrorMessage('Please select your attendance and meal.');
      return;
    }
    try {
      // Pass exactly the fields your mutation expects
      await submitRSVP({
        attending: formData.attending,
        mealPreference: formData.mealPreference,
        allergies: formData.allergies || undefined,
        additionalNotes: formData.additionalNotes || undefined,
      });
      setSuccessMessage('RSVP submitted successfully!');
      setFormData({
        attending: 'YES',
        mealPreference: '',
        allergies: '',
        additionalNotes: '',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submission failed.';
      setErrorMessage(msg);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        RSVP
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, p: 3, border: 1, borderRadius: 2 }}
      >
        <FormControl fullWidth required margin="normal">
          <InputLabel id="attending-label">Attending?</InputLabel>
          <Select
            labelId="attending-label"
            id="attending"
            name="attending"
            value={formData.attending}
            onChange={handleSelectChange}
            label="Attending?"
          >
            <MenuItem value="YES">Yes</MenuItem>
            <MenuItem value="NO">No</MenuItem>
            <MenuItem value="MAYBE">Maybe</MenuItem>
          </Select>
        </FormControl>

        <TextField
          id="mealPreference"
          label="Meal Preference"
          name="mealPreference"
          value={formData.mealPreference}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          id="allergies"
          label="Allergies (optional)"
          name="allergies"
          value={formData.allergies}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          id="additionalNotes"
          label="Additional Notes (optional)"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit RSVP'}
        </Button>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={handleCloseSnackbar}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RSVPFormPage;