import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, Select, MenuItem, Button, Typography, Box } from '@mui/material';
import joukkueet from '../constants/joukkueet';
import logot from '../constants/logot';
import JoukkueenLogo from './JoukkueenLogo';

const JoukkueenValinta: React.FC = () => {
  const [teamCode, setTeamCode] = useState<keyof typeof logot | ''>('');
  const navigate = useNavigate();

  const haeRosteri = () => {
    if (!teamCode) {
      alert('Valitse joukkue valikosta ennen jatkamista.');
      return;
    }
    navigate(`/teams/${teamCode}`);
  };

  const haeSarjataulukko = () => {
    navigate('/standings'); // Ohjaa käyttäjän /standings-reitille
  };

  return (
    <Box sx={{ width: '100%', padding: 3, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
        <img src={logot.NHL} alt="NHL Logo" style={{ height: '100px' }}/>
      </Box>
      <Button variant="contained" color="secondary" onClick={haeSarjataulukko} sx={{ width: '100%', mb: 3 }}>
        Katso Sarjataulukko
      </Button>
      <Typography variant='h5' sx={{ marginBottom: 2, textAlign: 'center' }}>Joukkueen kokoonpanot</Typography>
      <FormControl fullWidth sx={{ marginBottom: 2, bgcolor: '#F5F5F5'}}>
        <InputLabel id="teamCode-label">Joukkue</InputLabel>
        <Select
          labelId="teamCode-label"
          value={teamCode}
          label="Joukkue"
          onChange={(e) => setTeamCode(e.target.value as keyof typeof logot)}
        >
          {joukkueet.map((joukkue) => (
            <MenuItem key={joukkue.code} value={joukkue.code}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <JoukkueenLogo teamCode={joukkue.code} width='50px' />
              <Typography variant="body1" sx={{ marginLeft: 1 }}>{joukkue.name}</Typography>
            </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={haeRosteri} sx={{ width: '100%' , margin: 'auto' }}>
        Hae Rosteri
      </Button>
    </Box>
  );
};

export default JoukkueenValinta;