import React, { useState } from 'react';

import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Paper, Slider, TextField, Typography } from '@mui/material';
import { Close, PhotoCamera } from '@mui/icons-material';
import { Map } from 'leaflet';
import { Marker, Popup, TileLayer } from 'react-leaflet';

const RoadvisionMap = () => {
  const [defectType, setDefectType] = useState('Cracks');
  const [defectState, setDefectState] = useState('High');
  const [feedback, setFeedback] = useState('');
  const [center, setCenter] = useState([26.936315, 75.803045]);
  const [zoom, setZoom] = useState(15);
  const [markers, setMarkers] = useState([
    {
      id: 1,
      type: 'Cracks',
      state: 'High',
      position: [26.935708, 75.803086],
      image: 'frame_61.png'
    },
    {
      id: 2,
      type: 'Cracks',
      state: 'Medium',
      position: [26.936654, 75.803153],
      image: 'frame_62.png'
    },
    {
      id: 3,
      type: 'Cracks',
      state: 'Low',
      position: [26.936924, 75.802801],
      image: 'frame_63.png'
    }
  ]);

  const handleDefectTypeChange = (event) => {
    setDefectType(event.target.value);
  };

  const handleDefectStateChange = (event, value) => {
    setDefectState(value);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  return (
    <Box display="flex" height="100vh">
      <Box flex="1" mr={2}>
    
      </Box>
      <Paper elevation={3} style={{ padding: '16px', width: '300px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Point Information</Typography>
          <IconButton>
            <Close />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <PhotoCamera />
          <Typography variant="body1" ml={1}>
            Original Photo
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <PhotoCamera />
          <Typography variant="body1" ml={1}>
            AI-Analyzed Photo
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight="bold">
          Defect Type
        </Typography>
        <Typography variant="body1">Traveling/Cracks</Typography>
        <Typography variant="body1" fontWeight="bold">
          Last Updated
        </Typography>
        <Typography variant="body1">September 4th, 2024 2:25pm</Typography>
        <Typography variant="body1" fontWeight="bold">
          Location
        </Typography>
        <Typography variant="body1">
          Office, 3rd Floor Owais Tower, Kabristan, Owais Steel wooden furniture Ke oper, Road, near Shastri Nagar, Nahari Ka Naka, Thana, Jaipur, Rajasthan 302016, India
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Latitude and Longitude
        </Typography>
        <Typography variant="body1">26.936315, 75.803045</Typography>
        <Typography variant="body1" fontWeight="bold">
          Feedback
        </Typography>
        <TextField
          value={feedback}
          onChange={handleFeedbackChange}
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={3}
        />
        <Box mt={2}>
          <Button variant="contained" color="primary" fullWidth>
            Submit Feedback
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RoadvisionMap;