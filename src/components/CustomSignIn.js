import React from 'react';
import { useSignIn } from "@clerk/clerk-react";
import { Box, Button, TextField, Typography, Divider, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const CustomSignIn = () => {
  const { signIn, setActive } = useSignIn();
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handlePasswordSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin,
        redirectUrlComplete: window.location.origin,
      });
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err.message || 'Google sign-in failed');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        p: 3,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        maxWidth: 400,
        width: '100%',
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Sign In
      </Typography>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
        onClick={handleGoogleSignIn}
        sx={{
          borderColor: '#1976d2',
          color: '#1976d2',
          '&:hover': {
            borderColor: '#1565c0',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        }}
      >
        Continue with Google
      </Button>

      <Divider sx={{ width: '100%', my: 2 }}>
        <Typography color="textSecondary" variant="body2">
          OR
        </Typography>
      </Divider>

      <form onSubmit={handlePasswordSignIn} style={{ width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            disabled={loading}
          />
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
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </Box>
      </form>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Don't have an account?{' '}
          <Button
            variant="text"
            onClick={() => window.location.href = '/sign-up'}
            sx={{ textTransform: 'none' }}
          >
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomSignIn;
