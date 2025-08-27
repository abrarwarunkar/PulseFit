import * as React from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Dialog,
} from '@mui/material';
// Removed Clerk import
import { saveUserData, getUserData, STORAGE_KEYS } from '../utils/storage';

const Profile = ({ isInitialSetup = false, onComplete }) => {
  // Mock user for demo
  const user = { id: 'demo-user', firstName: 'Demo', lastName: 'User', primaryEmailAddress: { emailAddress: 'demo@pulsefit.com' } };
  const [profile, setProfile] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    activityLevel: ''
  });

  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;

    // Load saved profile data if it exists for this specific user
    const savedProfile = getUserData(user.id, STORAGE_KEYS.PROFILE);
    if (savedProfile) {
      setProfile(prev => ({
        ...prev,
        ...savedProfile
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;

    // Save profile data using consistent storage system
    saveUserData(user.id, STORAGE_KEYS.PROFILE, profile);
    
    if (isInitialSetup) {
      // Set a flag to indicate this user has completed profile setup
      saveUserData(user.id, STORAGE_KEYS.HAS_PROFILE, true);
      onComplete?.();
    } else {
      setSuccessDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setSuccessDialogOpen(false);
  };

  // Always show profile in demo mode

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {!isInitialSetup && (
        <Typography variant="h4" gutterBottom align="center">
          My Profile
        </Typography>
      )}
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={profile.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Height (cm)"
                name="height"
                type="number"
                value={profile.height}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={profile.weight}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Fitness Goal</InputLabel>
                <Select
                  name="fitnessGoal"
                  value={profile.fitnessGoal}
                  onChange={handleChange}
                  label="Fitness Goal"
                >
                  <MenuItem value="weight_loss">Weight Loss</MenuItem>
                  <MenuItem value="muscle_gain">Muscle Gain</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="general_fitness">General Fitness</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Activity Level</InputLabel>
                <Select
                  name="activityLevel"
                  value={profile.activityLevel}
                  onChange={handleChange}
                  label="Activity Level"
                >
                  <MenuItem value="sedentary">Sedentary</MenuItem>
                  <MenuItem value="lightly_active">Lightly Active</MenuItem>
                  <MenuItem value="moderately_active">Moderately Active</MenuItem>
                  <MenuItem value="very_active">Very Active</MenuItem>
                  <MenuItem value="extra_active">Extra Active</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                {isInitialSetup ? 'Complete Profile Setup' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog open={successDialogOpen} onClose={handleCloseDialog}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Success!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your profile has been updated successfully.
          </Typography>
          <Button onClick={handleCloseDialog} variant="contained" fullWidth>
            Close
          </Button>
        </Box>
      </Dialog>
    </Container>
  );
};

export default Profile;
