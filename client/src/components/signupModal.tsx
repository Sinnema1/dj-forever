import * as React from "react";

// Material UI imports
import { Box, Button, Typography, Modal, TextField, Tabs, Tab } from "@mui/material";
import { useMutation } from "@apollo/client";
import { ADD_USER, LOGIN_USER } from "../graphql/mutations";
import Auth from '../utils/auth';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  // onLogin: () => void; // Receive mock login function
}

export default function SignupModal({ open, onClose }: SignupModalProps) {
  const [tab, setTab] = React.useState(0); // 0 = Login, 1 = Signup

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // const handleMockLogin = () => {
  //   // onLogin(); // Call mock login function
  //   onClose(); // Close modal after login
  // };

  // set initial login form state
  const [loginFormData, setLoginFormData] = React.useState({ loginEmail: '', loginPassword: '' });

  // set initial signup form state
  const [signupFormData, setSignupFormData] = React.useState({ signupUsername: '', signupEmail: '', signupPassword: '', confirmPassword: '' });

  const [passwordMatch, setPasswordMatch] = React.useState(true);

  React.useEffect(() => {
    if (signupFormData.signupPassword === signupFormData.confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }, [signupFormData.confirmPassword])

  // show a message if login fails
  const [loginFail, setLoginFail] = React.useState(false);

  // reflect changes in form input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignupFormData({ ...signupFormData, [name]: value });
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  // graphql mutation to add user; defines addUser function for use below
  const [login] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
    // try to execute the LOGIN_USER mutation
    try {
      const { data } = await login({
        variables: { email: loginFormData.loginEmail, password: loginFormData.loginPassword },
      });
      Auth.login(data.login.token);
      setLoginFail(false);
    } catch (err) {
      setLoginFail(true);
      console.error(err);
    }
  }

  // graphql mutation to add user; defines addUser function for use below
  const [addUser] = useMutation(ADD_USER);

  // attempt to execute the ADD_USER mutation when "Sign Up" button is clicked
  const handleSignup = async () => {
    if (signupFormData.signupPassword === signupFormData.confirmPassword) {
      try {
        const { data } = await addUser({
          variables: { username: signupFormData.signupUsername, email: signupFormData.signupEmail, password: signupFormData.signupPassword },
        });
        Auth.login(data.addUser.token);
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="auth-modal-title">
      <Box sx={style}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        <Typography id="auth-modal-title" variant="h6" textAlign="center">
          {tab === 0 ? "Login to Your Account" : "Create an Account"}
        </Typography>

        {tab === 0 && (
          <>
            <TextField 
              fullWidth 
              label="Email" 
              name="loginEmail" 
              type="email" 
              variant="outlined" 
              onChange={handleInputChange} 
              value={loginFormData.loginEmail || ''} 
              required 
            />
            <TextField 
              fullWidth 
              label="Password" 
              name="loginPassword" 
              type="password" 
              variant="outlined" 
              onChange={handleInputChange} 
              value={loginFormData.loginPassword || ''} 
              required 
            />

            {loginFail && <p>Unable to log in.</p>}

            <Button 
              variant="contained" 
              color="primary" 
              fullWidth sx={{ mt: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>

            {/* Mock Login Button */}
            {/* <Button 
              variant="outlined" 
              color="secondary" 
              fullWidth 
              sx={{ mt: 2, backgroundColor: "primary.main" }} 
              onClick={handleMockLogin} // Call mock login function
            >
              Mock Login
            </Button> */}
          </>
        )}

        {tab === 1 && (
          <>
            <TextField 
              fullWidth 
              label="Username" 
              name="signupUsername" 
              variant="outlined" 
              onChange={handleInputChange} 
              value={signupFormData.signupUsername || ''} 
              required 
            />
            <TextField 
              fullWidth 
              label="Email" 
              name="signupEmail" 
              type="email" 
              variant="outlined" 
              onChange={handleInputChange} 
              value={signupFormData.signupEmail || ''} 
              required 
            />
            <TextField 
              fullWidth 
              label="Password" 
              name="signupPassword" 
              type="password" 
              variant="outlined" 
              onChange={handleInputChange} 
              value={signupFormData.signupPassword || ''} 
              required 
            />
            <TextField 
              fullWidth 
              label="Confirm Password" 
              name="confirmPassword" 
              type="password" 
              variant="outlined" 
              onChange={handleInputChange} 
              value={signupFormData.confirmPassword || ''} 
              error={passwordMatch}
              required 
            />
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth sx={{ mt: 2 }}
              onClick={handleSignup}
            >
              Sign Up
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}
