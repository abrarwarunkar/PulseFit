import React from 'react';
import { useSignUp } from "@clerk/clerk-react";
import { Box, TextField, Button, Typography, CircularProgress, Link } from '@mui/material';

const CustomSignUp = () => {
  const { signUp, setActive } = useSignUp();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [error, setError] = React.useState('');

  // Add ref for CAPTCHA
  const captchaRef = React.useRef(null);

  React.useEffect(() => {
    // Initialize CAPTCHA
    const element = document.createElement('div');
    element.id = 'clerk-captcha';
    document.body.appendChild(element);
    captchaRef.current = element;

    return () => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Starting sign-up process...');
      
      // First create user
      const response = await signUp.create({
        emailAddress: email,
        password,
      });

      console.log('Sign-up response:', response);

      // Handle the sign-up response
      if (response.status === "complete") {
        console.log('Sign-up complete, setting active session...');
        await setActive({ session: response.createdSessionId });
        window.location.href = "/";
        return;
      }

      // Handle verification if needed
      if (response.status === "missing_requirements") {
        console.log('Missing requirements:', response.requirements);
        if (response.requirements.includes("email_verification")) {
          console.log('Preparing email verification...');
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          setPendingVerification(true);
        }
      }
    } catch (err) {
      console.error('Detailed sign-up error:', {
        name: err.name,
        message: err.message,
        errors: err.errors,
        stack: err.stack
      });
      
      // Handle specific error cases
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        if (firstError.code === "form_identifier_exists") {
          setError("This email is already registered. Please sign in instead.");
        } else if (firstError.code === "form_password_pwned") {
          setError("This password has been compromised. Please choose a different password.");
        } else {
          setError(firstError.message);
        }
      } else if (err.message.includes("captcha")) {
        setError("Please complete the CAPTCHA verification.");
      } else {
        setError(err.message || 'Something went wrong during sign up. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);

    try {
      const response = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (response.status === "complete") {
        await setActive({ session: response.createdSessionId });
        window.location.href = "/";
      }
    } catch (err) {
      console.error('Verification error:', {
        name: err.name,
        message: err.message,
        errors: err.errors
      });
      
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || 'Invalid verification code. Please try again.');
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, width: '100%', p: 3, bgcolor: 'white', borderRadius: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        Create Account
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!pendingVerification ? (
        <form onSubmit={handleSignUp}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              disabled={loading}
              error={!!error && error.toLowerCase().includes('email')}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              disabled={loading}
              error={!!error && error.toLowerCase().includes('password')}
              helperText="Password must be at least 8 characters"
            />
            <div id="clerk-captcha" ref={captchaRef} />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
          </Box>
        </form>
      ) : (
        <form onSubmit={handleVerification}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography>
              Please check your email for a verification code.
            </Typography>
            <TextField
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              fullWidth
              disabled={verifying}
              error={!!error}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={verifying}
              sx={{
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0',
                },
              }}
            >
              {verifying ? <CircularProgress size={24} /> : 'Verify Email'}
            </Button>
          </Box>
        </form>
      )}

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link href="/sign-in" underline="hover">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomSignUp;
