import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useUser } from '@clerk/clerk-react';
import { getUserData, saveUserData, STORAGE_KEYS } from '../utils/storage';

const ProgressTracker = () => {
  const { user } = useUser();
  const [progressEntries, setProgressEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFatPercentage: '',
    muscleMass: '',
    notes: ''
  });

  // Load progress entries from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedProgressEntries = getUserData(user.id, STORAGE_KEYS.PROGRESS) || [];
      setProgressEntries(savedProgressEntries);
    }
  }, [user]);

  // Save progress entries to localStorage whenever they change
  useEffect(() => {
    if (user && progressEntries.length > 0) {
      saveUserData(user.id, STORAGE_KEYS.PROGRESS, progressEntries);
    }
  }, [user, progressEntries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addProgressEntry = () => {
    if (newEntry.weight || newEntry.bodyFatPercentage || newEntry.muscleMass) {
      const entryToAdd = { 
        ...newEntry, 
        id: Date.now() 
      };
      const updatedEntries = [...progressEntries, entryToAdd];
      setProgressEntries(updatedEntries);
      
      // Reset form
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        bodyFatPercentage: '',
        muscleMass: '',
        notes: ''
      });
    }
  };

  const deleteProgressEntry = (id) => {
    const updatedEntries = progressEntries.filter(entry => entry.id !== id);
    setProgressEntries(updatedEntries);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Progress Tracker
        </Typography>
        
        {/* Progress Entry Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={newEntry.date}
                onChange={handleInputChange}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={newEntry.weight}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Body Fat %"
                name="bodyFatPercentage"
                type="number"
                value={newEntry.bodyFatPercentage}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Muscle Mass (kg)"
                name="muscleMass"
                type="number"
                value={newEntry.muscleMass}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={3}
                value={newEntry.notes}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Additional notes about your progress..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={addProgressEntry}
                startIcon={<AddIcon />}
                fullWidth
              >
                Add Progress Entry
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Progress Entries Table */}
        {progressEntries.length > 0 && (
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Progress History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Weight (kg)</TableCell>
                    <TableCell>Body Fat %</TableCell>
                    <TableCell>Muscle Mass (kg)</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {progressEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.weight || '-'}</TableCell>
                      <TableCell>{entry.bodyFatPercentage || '-'}</TableCell>
                      <TableCell>{entry.muscleMass || '-'}</TableCell>
                      <TableCell>{entry.notes || '-'}</TableCell>
                      <TableCell>
                        <IconButton 
                          color="error" 
                          size="small" 
                          onClick={() => deleteProgressEntry(entry.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default ProgressTracker;
