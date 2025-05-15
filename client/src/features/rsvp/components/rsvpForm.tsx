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
import { RSVPFormData, CreateRSVPInput } from '../types/rsvpTypes';

const RSVPForm: React.FC = () => {
  const { submitRSVP, loading } = useRSVP();

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as keyof RSVPFormData]: value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.attending || !formData.mealPreference) {
      setErrorMessage('Please select your attendance and meal.');
      return;
    }

    const input: CreateRSVPInput = {
      attending: formData.attending,
      mealPreference: formData.mealPreference,
      allergies: formData.allergies || undefined,
      additionalNotes: formData.additionalNotes || undefined,
    };

    try {
      await submitRSVP(input);
      setSuccessMessage('RSVP submitted!');
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

  const handleClose = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, border: 1, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Submit RSVP
      </Typography>

      <FormControl fullWidth required margin="normal">
        <InputLabel htmlFor="attending">Attending</InputLabel>
        <Select
          id="attending"
          name="attending"
          value={formData.attending}
          onChange={handleSelectChange}
          label="Attending"
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
        {loading ? <CircularProgress size={24} /> : 'Submit'}
      </Button>

      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {successMessage ? (
          <Alert severity="success" onClose={handleClose}>
            {successMessage}
          </Alert>
        ) : (
          <Alert severity="error" onClose={handleClose}>
            {errorMessage}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default RSVPForm;