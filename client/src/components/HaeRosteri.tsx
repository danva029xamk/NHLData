import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Table, TableCell, Paper, TableBody, TableHead, TableRow, Button, Grid, TableContainer, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import joukkueet from '../constants/joukkueet';
import JoukkueenLogo from './JoukkueenLogo';
import { getTeamTheme } from '../themes';

interface Pelaaja {
  id: number;
  headshot: string;
  firstName: {
    default: string;
  };
  lastName: {
    default: string;
  };
  sweaterNumber: number;
  positionCode: string;
  shootsCatches: string;
  heightInInches: number;
  weightInPounds: number;
  heightInCentimeters: number;
  weightInKilograms: number;
  birthDate: string;
  birthCity: {
    default: string;
  };
  birthCountry: string;
  birthStateProvince?: {
    default: string;
  };
}


const HaeRosteri: React.FC = () => {
  const [roster, setRoster] = useState<Pelaaja[]>([]);
  const [virhe, setVirhe] = useState<string>('');
  const { teamCode } = useParams<{ teamCode: any }>();
  const [theme, setTheme] = useState(() => getTeamTheme(teamCode || 'ANA')); // Oletusjoukkueen koodi, jos teamCode on undefined
  const navigate = useNavigate();

  const joukkueenNimi = joukkueet.find(j => j.code === teamCode)?.name || 'Joukkue';


  const handleBackClick = () => {
    navigate('/'); // Ohjaa käyttäjän takaisin etusivulle
  };

  const handlePlayerClick = (playerId: number) => {
    navigate(`/players/${playerId}`);
  };

  useEffect(() => {
    if (teamCode) {
      haeRoster(teamCode);
      setTheme(getTeamTheme(teamCode));
    }
  }, [teamCode]);

  const haeRoster = async (code: string) => {
    try {
      const vastaus = await axios.get(`http://localhost:3110/teams/roster/${code}/current`);

      const kokonaisRosteri = [
        ...vastaus.data.forwards,
        ...vastaus.data.defensemen,
        ...vastaus.data.goalies
      ];

    setRoster(kokonaisRosteri);

    } catch (error) {
      setVirhe('Virhe haettaessa joukkueen rosteria.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Grid container spacing={2} sx={{ padding: 3 }}>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleBackClick}>
              Palaa Etusivulle
            </Button>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'text.primary', fontFamily: "Times New Roman"}}>        
              <JoukkueenLogo teamCode={teamCode}/>
              <span>{joukkueenNimi}</span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="joukkueen rosteri">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Etunimi</TableCell>
                    <TableCell>Sukunimi</TableCell>
                    <TableCell>Pelinumero</TableCell>
                    <TableCell>Pelipaikka</TableCell>
                    <TableCell>Kätisyys</TableCell>
                    <TableCell>Pituus</TableCell>
                    <TableCell>Paino</TableCell>
                    <TableCell>Syntymäaika</TableCell>
                    <TableCell>Syntymäkaupunki</TableCell>
                    <TableCell>Syntymämaa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roster.map((pelaaja: Pelaaja) => (
                    <TableRow key={pelaaja.id} onClick={() => handlePlayerClick(pelaaja.id)}>
                      <TableCell>
                        <Box sx={{ backgroundColor: '#fff', display: 'inline-block', padding: '4px' }}>
                          <img src={pelaaja.headshot} alt={`Ei kuvaa`} style={{ width: '50px', height: 'auto' }} />
                        </Box>
                      </TableCell>
                      <TableCell>{pelaaja.firstName.default}</TableCell>
                      <TableCell>{pelaaja.lastName.default}</TableCell>
                      <TableCell>{pelaaja.sweaterNumber}</TableCell>
                      <TableCell>{pelaaja.positionCode}</TableCell>
                      <TableCell>{pelaaja.shootsCatches}</TableCell>
                      <TableCell>{pelaaja.heightInCentimeters} cm</TableCell>
                      <TableCell>{pelaaja.weightInKilograms} kg</TableCell>
                      <TableCell>{pelaaja.birthDate}</TableCell>
                      <TableCell>{pelaaja.birthCity.default}</TableCell>
                      <TableCell>{pelaaja.birthCountry}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {virhe && <Typography color="error">{virhe}</Typography>}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default HaeRosteri;
