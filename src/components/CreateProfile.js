import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import Profile from './Profile';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [activeStep] = React.useState(0);
  const steps = ['Create Your Profile'];

  const handleProfileComplete = () => {
    // Navigate to dashboard after profile creation
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ width: '100%', mb: 4 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Welcome to Health Pulse!
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
        Let's set up your profile to personalize your experience.
      </Typography>
      
      <Profile isInitialSetup={true} onComplete={handleProfileComplete} />
    </Container>
  );
};

export default CreateProfile;
