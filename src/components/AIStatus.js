import React from 'react';
import { Chip, Box } from '@mui/material';
import { Psychology, SmartToy } from '@mui/icons-material';

const AIStatus = ({ isGenerating, isAIGenerated }) => {
  if (isGenerating) {
    return (
      <Chip
        icon={<SmartToy />}
        label="🤖 AI Generating..."
        size="small"
        sx={{
          background: 'linear-gradient(45deg, #00E5FF, #FF6B35)',
          color: 'white',
          animation: 'pulse 1.5s infinite'
        }}
      />
    );
  }

  if (isAIGenerated) {
    return (
      <Chip
        icon={<Psychology />}
        label="✨ AI Generated"
        size="small"
        color="primary"
        variant="outlined"
        sx={{
          borderColor: '#00E5FF',
          color: '#00E5FF'
        }}
      />
    );
  }

  return (
    <Chip
      label="📋 Smart Fallback"
      size="small"
      sx={{
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        color: '#FF6B35',
        border: '1px solid rgba(255, 107, 53, 0.3)'
      }}
    />
  );
};

export default AIStatus;