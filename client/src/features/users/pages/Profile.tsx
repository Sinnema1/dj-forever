import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { GET_ME } from '../../auth/graphql/queries';
import { UPDATE_USER } from '../graphql/mutations';

// Optional TypeScript interface for response
interface MeResponse {
  me: {
    _id: string;
    username: string;
    email: string;
  };
}

const Profile = () => {
  const { loading, data, refetch } = useQuery<MeResponse>(GET_ME);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setSuccessMessage('✅ Account updated successfully!');
      refetch();
    },
    onError: (error) => {
      setErrorMessage(`❌ Error: ${error.message}`);
    },
  });

  // Sync data to form inputs
  useEffect(() => {
    if (data?.me) {
      setUsername(data.me.username);
      setEmail(data.me.email);
    }
  }, [data]);

  const handleUpdate = async () => {
    try {
      setSuccessMessage('');
      setErrorMessage('');

      await updateUser({
        variables: {
          // Confirm your mutation input here!
          username,
          email,
        },
      });
    } catch (err) {
      console.error('Error updating account:', err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  const isFormIncomplete = !username || !email;

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        My Account
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Manage your account settings here.
      </Typography>

      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ marginBottom: 3 }}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        disabled={updating || isFormIncomplete}
      >
        {updating ? <CircularProgress size={24} /> : 'Update Account'}
      </Button>
    </Container>
  );
};

export default Profile;
