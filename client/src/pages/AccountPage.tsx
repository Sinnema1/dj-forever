import { useEffect, useState } from "react";
import { GET_ME } from "../graphql/queries";
import { UPDATE_USER } from "../graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function AccountPage() {
  const { loading, data, refetch } = useQuery(GET_ME);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setSuccessMessage("✅ Account updated successfully!");
      refetch(); // Refresh user data
    },
    onError: (error) => {
      setErrorMessage(`❌ Error: ${error.message}`);
    },
  });

  useEffect(() => {
    if (data) {
      setUsername(data.me.username);
      setEmail(data.me.email);
    }
  }, [data]);

  const handleUpdate = async () => {
    try {
      setSuccessMessage("");
      setErrorMessage("");
      await updateUser({
        variables: { username, email },
      });
    } catch (err) {
      console.error("Error updating account:", err);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: "50px" }}>
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        disabled={updating}
      >
        {updating ? <CircularProgress size={24} /> : "Update Account"}
      </Button>
    </Container>
  );
}