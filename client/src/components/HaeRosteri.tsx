import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Table, TableCell, Paper, TableBody, TableHead, TableRow, Button, Grid, TableContainer, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import joukkueet from '../constants/joukkueet';
import JoukkueenLogo from './JoukkueenLogo';
import { getTeamTheme } from '../themes';

// Pelaaja-tyyppiä voidaan tarvittaessa laajentaa uusilla kentillä
interface Pelaaja {
  playerId: number;
  headshot: string;
  firstName: {
      default: string;
  };
  lastName: {
      default: string;
  };
  positionCode: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  penaltyMinutes: number;
  powerPlayGoals: number;
  shorthandedGoals: number;
  gameWinningGoals: number;
  overtimeGoals: number;
  shots: number;
  shootingPctg: number;
  avgTimeOnIcePerGame: number;
  avgShiftsPerGame: number;
  faceoffWinPctg: number;
}

interface Maalivahti {
  playerId: number;
  headshot: string;
  firstName: {
      default: string;
  };
  lastName: {
      default: string;
  };
  gamesPlayed: number;
  gamesStarted: number;
  wins: number;
  losses: number;
  ties: number;
  overtimeLosses: number;
  goalsAgainstAverage: number;
  savePercentage: number;
  shotsAgainst: number;
  saves: number;
  goalsAgainst: number;
  shutouts: number;
  goals: number;
  assists: number;
  points: number;
  penaltyMinutes: number;
  timeOnIce: number;
}


const HaeRosteri: React.FC = () => {
  const [pelaajat, setPelaajat] = useState<Pelaaja[]>([]);
  const [maalivahdit, setMaalivahdit] = useState<Maalivahti[]>([]);
  const [virhe, setVirhe] = useState<string>('');
  const { teamCode } = useParams<{ teamCode: any }>();
  const [theme, setTheme] = useState(() => getTeamTheme(teamCode || 'ANA')); // Oletusjoukkueen koodi, jos teamCode on undefined
  const navigate = useNavigate();

  const joukkueenNimi = joukkueet.find(j => j.code === teamCode)?.name || 'Joukkue';


  const handleBackClick = () => {
    navigate('/'); // Ohjaa käyttäjän takaisin etusivulle
  };

  const handlePlayerClick = (playerId: number) => {
    navigate(`/teams/${teamCode}/players/${playerId}`);
  };

  useEffect(() => {
    if (teamCode) {
      haeRoster(teamCode);
      setTheme(getTeamTheme(teamCode));
    }
  }, [teamCode]);

  const haeRoster = async (code: string) => {
    try {
      const vastaus = await axios.get(`http://localhost:3110/teams/club-stats/${code}/now`);

      const jarjestetytPelaajat = vastaus.data.skaters.sort((a: Pelaaja, b: Pelaaja) => b.points - a.points);
      const jarjestetytMaalivahdit = vastaus.data.goalies.sort((a: Maalivahti, b: Maalivahti) => b.wins - a.wins);

      setPelaajat(jarjestetytPelaajat);
      setMaalivahdit(jarjestetytMaalivahdit);

    } catch (error) {
      setVirhe('Virhe haettaessa joukkueen rosteria.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', border: '1px solid rgba(224, 224, 224, 1)', boxShadow: 3 }}>
        <Grid container spacing={2} sx={{ padding: 3 }}>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleBackClick}>
              Palaa Etusivulle
            </Button>
            <Typography 
              variant="h4" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 2, 
                color: (
                   teamCode === 'NSH' || 
                   teamCode === 'STL' || 
                   teamCode === 'TBL' || 
                   teamCode === 'TOR' ||
                   teamCode === 'BOS' ||
                   teamCode === 'SEA' || 
                   teamCode === 'PIT') 
                  ? '#000000' : '#FFFFFF', 
                fontFamily: "Times New Roman"
              }}
            >      
              <JoukkueenLogo teamCode={teamCode}/>
              <span>{joukkueenNimi}</span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {/* Kenttäpelaajien taulukko */}
            <TableContainer component={Paper} sx={{ border: '1px solid rgba(224, 224, 224, 1)', boxShadow: 3, mb: 4 }}>
              <Table sx={{ borderCollapse: 'collapse' }}>
                  <TableHead sx={{ bgcolor: '#D3D3D3',  border: '2px solid rgba(0, 0, 0, 1)', boxShadow: 3, mb: 4 }}>
                      <TableRow>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Kuva</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Nimi</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Pos</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>GP</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>G</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>A</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Pts</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>+/-</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Pen. min.</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>PPG</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>SHG</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>GWG</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>OTG</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Shots</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Sht%</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Avg. Time/Ice</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Avg. Shifts/G</TableCell>
                          <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>FO%</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {pelaajat.map((pelaaja) => (
                          <TableRow 
                            key={pelaaja.playerId}
                            onClick={() => handlePlayerClick(pelaaja.playerId)}
                            style={{ cursor: 'pointer' }} // Lisää kursorin muutos osoittamaan klikattavuutta
                            >
                              <TableCell component="th" scope="row">
                                <Box
                                  sx={{
                                    display: 'flex',
                                    width: '50px',
                                    backgroundColor: '#fff',
                                    borderRadius: '4px',
                                  }}
                                >
                                  <img src={pelaaja.headshot} alt={pelaaja.firstName.default + ' ' + pelaaja.lastName.default} style={{ width: '100%', height: 'auto' }} />
                                </Box>
                              </TableCell>
                              <TableCell 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                  }}>
                                  {pelaaja.firstName.default} {pelaaja.lastName.default}
                                </TableCell>
                              <TableCell>{pelaaja.positionCode}</TableCell>
                              <TableCell>{pelaaja.gamesPlayed}</TableCell>
                              <TableCell >{pelaaja.goals}</TableCell>
                              <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)'}}>{pelaaja.assists}</TableCell>
                              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{pelaaja.points}</TableCell>
                              <TableCell>{pelaaja.plusMinus}</TableCell>
                              <TableCell>{pelaaja.penaltyMinutes}</TableCell>
                              <TableCell>{pelaaja.powerPlayGoals}</TableCell>
                              <TableCell>{pelaaja.shorthandedGoals}</TableCell>
                              <TableCell>{pelaaja.gameWinningGoals}</TableCell>
                              <TableCell>{pelaaja.overtimeGoals}</TableCell>
                              <TableCell>{pelaaja.shots}</TableCell>
                              <TableCell>{(pelaaja.shootingPctg * 100).toFixed(1)}%</TableCell>
                              <TableCell>{(pelaaja.avgTimeOnIcePerGame / 60).toFixed(2)}</TableCell>
                              <TableCell>{pelaaja.avgShiftsPerGame.toFixed(2)}</TableCell>
                              <TableCell>{(pelaaja.faceoffWinPctg * 100).toFixed(1)}%</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </TableContainer>

            {/* Maalivahtien taulukko */}
            <TableContainer component={Paper} sx={{ border: '1px solid rgba(224, 224, 224, 1)', boxShadow: 3, mb: 4 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#D3D3D3', border: '2px solid rgba(0, 0, 0, 1)', boxShadow: 3, mb: 4 }}>
                        <TableRow>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Kuva</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Nimi</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Pelatut Pelit</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Aloitetut Pelit</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Voitot</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Häviöt</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>JA-häviöt</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>GAA</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Torjunta%</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Laukaukset Vastaan</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Torjunnat</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Päästetyt Maalit</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Nollapelit</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Maalit</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Syötöt</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Pisteet</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Jäähymin.</TableCell>
                            <TableCell sx={{ color: '#000', fontWeight: 'bold'}}>Aika Jäällä</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {maalivahdit.map((maalivahti) => (
                            <TableRow key={maalivahti.playerId}                            
                            onClick={() => handlePlayerClick(maalivahti.playerId)}
                            style={{ cursor: 'pointer' }} // Lisää kursorin muutos osoittamaan klikattavuutta
                            >
                                <TableCell component="th" scope="row">
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      width: '50px',
                                      backgroundColor: '#fff', // Valkoinen tausta kuvalle
                                      borderRadius: '4px' // Pyöristetyt kulmat
                                    }}
                                  >
                                    <img src={maalivahti.headshot} alt={maalivahti.firstName.default + ' ' + maalivahti.lastName.default} style={{ width: '100%', height: 'auto' }} />
                                  </Box>
                                </TableCell>
                                <TableCell 
                                sx={{  
                                  fontWeight: 'bold', 
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'}}>
                                    {maalivahti.firstName.default} {maalivahti.lastName.default}
                                </TableCell>
                                <TableCell>{maalivahti.gamesPlayed}</TableCell>
                                <TableCell>{maalivahti.gamesStarted}</TableCell>
                                <TableCell>{maalivahti.wins}</TableCell>
                                <TableCell>{maalivahti.losses}</TableCell>
                                <TableCell>{maalivahti.overtimeLosses}</TableCell>
                                <TableCell>{maalivahti.goalsAgainstAverage.toFixed(2)}</TableCell>
                                <TableCell>{(maalivahti.savePercentage * 100).toFixed(1)}%</TableCell>
                                <TableCell>{maalivahti.shotsAgainst}</TableCell>
                                <TableCell>{maalivahti.saves}</TableCell>
                                <TableCell>{maalivahti.goalsAgainst}</TableCell>
                                <TableCell>{maalivahti.shutouts}</TableCell>
                                <TableCell>{maalivahti.goals}</TableCell>
                                <TableCell>{maalivahti.assists}</TableCell>
                                <TableCell>{maalivahti.points}</TableCell>
                                <TableCell>{maalivahti.penaltyMinutes}</TableCell>
                                <TableCell>{(maalivahti.timeOnIce / 60).toFixed(2)}</TableCell>
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