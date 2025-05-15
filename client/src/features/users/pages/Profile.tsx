import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { GET_ME } from '../../auth/graphql/queries';
import { UPDATE_USER } from '../graphql/mutations';

interface MeResponse {
  me: {
    _id: string;
    fullName: string;
    email: string;
    isAdmin: boolean;
    isInvited: boolean;
    hasRSVPed: boolean;
    rsvpId?: string | null;
  };
}

const Profile: React.FC = () => {
  const { loading, data, refetch } = useQuery<MeResponse>(GET_ME);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [updateUser, { loading: updating }] =
    useMutation(UPDATE_USER, {
      onCompleted: () => {
        setSuccessMessage('✅ Account updated successfully!');
        refetch();
      },
      onError: ({ message }) => {
        setErrorMessage(`❌ Error: ${message}`);
      },
    });

  useEffect(() => {
    if (data?.me) {
      setFullName(data.me.fullName);
      setEmail(data.me.email);
    }
  }, [data]);

  const handleUpdate = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    await updateUser({
      variables: {
        id: data!.me._id,
        input: {
          fullName,
          email,
        },
      },
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  const isFormIncomplete = !fullName || !email;

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        My Account
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Manage your account settings here.
      </Typography>

      <TextField
        fullWidth
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
      />

      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

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