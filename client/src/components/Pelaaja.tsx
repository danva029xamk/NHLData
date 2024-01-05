import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import responsiveDefaultTheme, { getTeamTheme } from '../themes';
import teamColors from '../constants/colours';
import { Card, Typography, Table, TableBody, TableCell, TableHead, TableRow, ThemeProvider, Button, Box, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface SeasonTotal {
  gameTypeId: number;
  season: number;
  formattedSeason?: string;
  teamName: {
    default: string;
  };
  leagueAbbrev: string;
  gamesPlayed: number;
  wins?: number;
  losses?: number;
  otLosses?: number;
  shutouts?: number;
  goalsAgainstAvg?: number;
  savePctg?: number;
  goals?: number;
  assists?: number;
  points?: number;
  plusMinus?: number;
  pim?: number;
  gameWinningGoals?: number;
  otGoals?: number;
  shots?: number;
  shootingPctg?: number;
  powerPlayGoals?: number;
  powerPlayPoints?: number;
  shortHandedGoals?: number;
  shortHandedPoints?: number;
}

interface PelaajaData {
  id: number;
  fullName: string;
  fullTeamName?: {
    default: string;
  };
  teamLogo: string;
  position: string;
  headshot: string;
  heightInCentimeters: number;
  weightInKilograms: number;
  birthDate: string;
  birthCity: string;
  birthCountry: string;
  shootsCatches: string;
  seasonTotals: SeasonTotal[];
  draftDetails: {
    year: number;
    round: number;
    pickInRound: number;
    overallPick: number;
  };
  featuredStats: {
    regularSeason: {
      career: {
        gamesPlayed: number;
        goals?: number;
        assists?: number;
        points?: number;
        plusMinus?: number;
        pim?: number;
        gameWinningGoals?: number;
        wins?: number;
        losses?: number;
        otLosses?: number;
        shutouts?: number;
        goalsAgainstAvg?: number;
        savePctg?: number;
        otGoals?: number;
        shots?: number;
        shootingPctg?: number;
        powerPlayGoals?: number;
        powerPlayPoints?: number;
        shorthandedGoals?: number;
        shorthandedPoints?: number;
      };
    };
  };
  currentTeamAbbrev: string;
}


const Pelaaja: React.FC = () => {
  const [pelaaja, setPelaaja] = useState<PelaajaData | null>(null);
  const [virhe, setVirhe] = useState<string>('');
  const [theme, setTheme] = useState<any>(responsiveDefaultTheme);
  const [näytettävätTilastot, setNäytettävätTilastot] = useState<SeasonTotal[]>([]);
  const [selectedGameTypeId, setSelectedGameTypeId] = useState<number>(2); // 2 runkosarjalle, 3 playoffeille
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const formatSeason = (seasonYear: string) => {
    const startYear = seasonYear.substring(0, 4);
    const endYear = seasonYear.substring(6, 8);
    const formatted = `${startYear}-${endYear}`;
    return formatted;
  }


  const handleBackClick = () => {
    navigate(`/teams/${pelaaja?.currentTeamAbbrev}`); // Ohjaa käyttäjän takaisin edelliselle sivulle
  };

  const handleGameTypeChange = (event: SelectChangeEvent<number>) => {
    const valittuGameTypeId = event.target.value as number;
    setSelectedGameTypeId(valittuGameTypeId);
  
    if (pelaaja) {
      const suodatetutTilastot = pelaaja.seasonTotals.filter(season => season.gameTypeId === valittuGameTypeId);
      setNäytettävätTilastot(suodatetutTilastot);
    }
  };

  useEffect(() => {
    const haePelaajanTiedot = async () => {
      try {
        const vastaus = await axios.get(`http://localhost:3110/players/player/${id}/landing`);
        const pelaajanData = vastaus.data;
        const joukkueKoodi = pelaajanData.currentTeamAbbrev as keyof typeof teamColors;

        if (joukkueKoodi) {
          setTheme(getTeamTheme(joukkueKoodi));
        }

        const pelaaja = {
          id: pelaajanData.playerId,
          fullName: `${pelaajanData.firstName.default} ${pelaajanData.lastName.default}`,
          fullTeamName: pelaajanData.fullTeamName,
          teamLogo: pelaajanData.teamLogo,
          position: pelaajanData.position,
          headshot: pelaajanData.headshot,
          heightInCentimeters: pelaajanData.heightInCentimeters,
          weightInKilograms: pelaajanData.weightInKilograms,
          birthDate: pelaajanData.birthDate,
          birthCity: pelaajanData.birthCity.default,
          birthCountry: pelaajanData.birthCountry,
          shootsCatches: pelaajanData.shootsCatches,
          seasonStats: pelaajanData.featuredStats.regularSeason.subSeason,
          seasonTotals: pelaajanData.seasonTotals,
          draftDetails: pelaajanData.draftDetails,
          currentTeamAbbrev: pelaajanData.currentTeamAbbrev,
          featuredStats: pelaajanData.featuredStats,
        };
        
        if (pelaaja) {
          // Järjestä tilastot uusimmasta vanhimpaan
          pelaaja.seasonTotals.sort((a: { season: number }, b: { season: number }) => b.season - a.season);

          pelaaja.seasonTotals.forEach((season: { season: number; formattedSeason?: string }) => {
            season.formattedSeason = formatSeason(season.season.toString());
          });

          setPelaaja(pelaaja);
        }

        setPelaaja(pelaaja);
        setVirhe('');
      } catch (error) {
        setVirhe('Pelaajaa ei löytynyt.');
        setPelaaja(null);
      }
    };

    if (id) {
      haePelaajanTiedot();
    }
  }, [id]);

  useEffect(() => {
    if (pelaaja) {
      const suodatetutTilastot = pelaaja.seasonTotals.filter(season => season.gameTypeId === selectedGameTypeId);
      setNäytettävätTilastot(suodatetutTilastot);
    }
  }, [pelaaja, selectedGameTypeId]);
  

  const isGoalie = pelaaja?.position === "G";

  return  (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Button variant="contained" onClick={handleBackClick} style={{ marginBottom: '20px' }}>
          Palaa Takaisin
        </Button>
        {pelaaja && (
          <Card sx={{ border: '3px solid rgba(224, 224, 224, 1)', boxShadow: 10 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottom: '5px solid rgba(224, 224, 224, 1)',
              alignItems: 'center',
              padding: 2,
              '& > *': {
                margin: '10px',
                flex: '1 1 0',
              },
            }}
          >
            {/* Pelaajan kuva */}
            <Box
              sx={{
                flex: '1 1 auto',
                maxWidth: '225px',
                minWidth: '125px',
                margin: '10px',
                boxShadow: 5,
                bgcolor: "#fff",
                borderRadius: 5
              }}
            >
              <img src={pelaaja.headshot} alt={`Kuva pelaajasta ${pelaaja.fullName}`} style={{ width: '100%', borderRadius: 50 }} />
            </Box>

              {/* Perustiedot */}
              <Box
                sx={{
                  flex: '1 1 auto',
                  minWidth: '200px',
                  ml: 3
                }}
              >
                <Typography   variant="h5" fontWeight={'bold'} mb={1} >
                  {pelaaja.fullName}
                </Typography>
                  <Typography variant="body1">Pituus: {pelaaja.heightInCentimeters} cm</Typography>
                  <Typography variant="body1">Paino: {pelaaja.weightInKilograms} kg</Typography>
                  <Typography variant="body1">Syntymäaika: {pelaaja.birthDate}</Typography>
                  <Typography variant="body1">Syntymäkaupunki: {pelaaja.birthCity}</Typography>
                  <Typography variant="body1">Maa: {pelaaja.birthCountry}</Typography>
                  <Typography variant="body1">Kätisyys: {pelaaja.shootsCatches}</Typography>
              </Box>

              {/* Draft-tiedot */}
              <Box
                sx={{
                  flex: '1 1 auto',
                  minWidth: '155px',
                }}
              >
                  {pelaaja.draftDetails ? (
                    <>
                      <Typography variant='h6'>Draft-tilastot:</Typography>
                      <Typography variant="body1">Draft-vuosi: {pelaaja.draftDetails.year}</Typography>
                      <Typography variant="body1">Kierros: {pelaaja.draftDetails.round}</Typography>
                      <Typography variant="body1">Valinta kierroksella: {pelaaja.draftDetails.pickInRound}</Typography>
                      <Typography variant="body1">Kokonaisvalinta: {pelaaja.draftDetails.overallPick}</Typography>
                    </>
                  ) : (
                    <Typography>Pelaajaa ei ole varattu</Typography>
                  )}
              </Box>

              {/* Joukkueen logo */}
              <Box
                sx={{
                  flex: '1 1 auto',
                  minWidth: '150px',
                  flexBasis: '225px',
                  margin: '10px'
                }}
              >
                  <img src={pelaaja.teamLogo} alt={`Logo joukkueesta ${pelaaja.fullTeamName?.default}`} style={{ height: '150px', maxWidth: '100%' }} />
              </Box>
            </Box>

            <Box sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, pt:1, pb:1 }}>
              <Typography variant="h6" marginLeft={'25px'}>
                Uran tilastot
              </Typography>
            </Box>

            <Box sx={{ overflowX: 'auto', borderTop: '3px solid rgba(224, 224, 224, 1)'}}>
              <Table stickyHeader>
                <TableHead sx={{
                  '.MuiTableCell-head': { // Tyyli jokaiselle otsikkosolulle erikseen
                    bgcolor: '#D3D3D3 !important', // Harmaa taustaväri, pakotettu
                    color: '#000000 !important', // Musta tekstinväri, pakotettu
                  }
                }}>
                  <TableRow>
                  {isGoalie ? (
                      // Maalivahdin tilastojen otsikot
                      <>
                        <TableCell align='right'>Pelatut Pelit</TableCell>
                        <TableCell align='right'>Voitot</TableCell>
                        <TableCell align='right'>Häviöt</TableCell>
                        <TableCell align='right'>JA-häviöt</TableCell>
                        <TableCell align='right'>GAA</TableCell>
                        <TableCell align='right'>Torjunta%</TableCell>
                        <TableCell align='right'>Nollapelit</TableCell>
                      </>
                    ) : (
                      // Kenttäpelaajan tilastojen otsikot
                      <>
                        <TableCell align='right'>Pelatut Pelit</TableCell>
                        <TableCell align='right'>Maalit</TableCell>
                        <TableCell align='right'>Syötöt</TableCell>
                        <TableCell align='right'>Pisteet</TableCell>
                        <TableCell align='right'>Laukaukset</TableCell>
                        <TableCell align='right'>Laukaisu%</TableCell>
                        <TableCell align='right'>Jäähy-minuutit</TableCell>
                        <TableCell align='right'>Voitto-maalit</TableCell>
                        <TableCell align='right'>JA-maalit</TableCell>
                        <TableCell align='right'>YV-maalit</TableCell>
                        <TableCell align='right'>YV-pisteet</TableCell>
                        <TableCell align='right'>AV-maalit</TableCell>
                        <TableCell align='right'>AV-pisteet</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                {pelaaja && pelaaja.featuredStats  && pelaaja.featuredStats.regularSeason && pelaaja.featuredStats.regularSeason.career && (
                  <TableBody sx={{
                    '& .MuiTableRow-root:nth-child(odd)': {
                      backgroundColor: 'rgba(0, 0, 0, 0.05)', // Tämä on esimerkki, korvaa väri ja opaciteetti toivotulla
                    },
                    '& .MuiTableRow-root:nth-child(even)': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', // Tämä on esimerkki, korvaa väri ja opaciteetti toivotulla
                    }
                  }}>
                    <TableRow>
                    {isGoalie ? (
                        // Maalivahdin tilastojen arvot
                        <>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.gamesPlayed}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.wins}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.losses}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.otLosses}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.goalsAgainstAvg}</TableCell>
                          <TableCell align="center">{pelaaja.featuredStats.regularSeason.career.savePctg 
                            ? (pelaaja.featuredStats.regularSeason.career.savePctg * 100).toFixed(1) + '%'
                            : 'N/A'
                          }</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.shutouts}</TableCell>
                        </>
                      ) : (
                        // Kenttäpelaajan tilastojen arvot
                        <>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.gamesPlayed}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.goals}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.assists}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold'}}>{pelaaja.featuredStats.regularSeason.career.points}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.shots}</TableCell>
                          <TableCell align="center">{pelaaja.featuredStats.regularSeason.career.shootingPctg 
                            ? (pelaaja.featuredStats.regularSeason.career.shootingPctg * 100).toFixed(1) + '%'
                            : 'N/A'
                          }</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.pim}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.gameWinningGoals}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.otGoals}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.powerPlayGoals}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.powerPlayPoints}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.shorthandedGoals}</TableCell>
                          <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.shorthandedPoints}</TableCell>
                      </>
                        )}
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </Box>

            <Box sx={{ borderTop:'5px solid rgba(224, 224, 224, 1)', bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, paddingTop:"10px" }}>
              
              <Typography variant="h6" ml={'25px'}>
                Tilastot kausittain
              </Typography>

              <Box ml={'25px'}>
                <FormControl variant='outlined' sx={{ backgroundColor: 'white', borderRadius: 1, mb: '10px' }}>
                  <Select
                    labelId="gametype-label"
                    id="gametype-select"
                    value={selectedGameTypeId}
                    onChange={handleGameTypeChange}
                    sx={{ color: 'black', '.MuiOutlinedInput-notchedOutline': { borderColor: 'black' } }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: 'white', 
                          color: 'black' 
                        }
                      }
                    }}
                  >
                      <MenuItem value={2} sx={{ color: 'black' }}>Runkosarja</MenuItem>
                      <MenuItem value={3} sx={{ color: 'black' }}>Playoffit</MenuItem>
                    </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead sx={{
                  '.MuiTableCell-head': { 
                    bgcolor: '#D3D3D3 !important',
                    color: '#000000 !important',
                  }
                }}>
                  <TableRow>
                    {/* Otsikot riippuen pelaajan pelipaikasta */}
                    {isGoalie ? (
                      // Maalivahdin tilastojen otsikot
                      <>
                        <TableCell align='right'>Kausi</TableCell>
                        <TableCell align='right'>Joukkue</TableCell>
                        <TableCell align='right'>Liiga</TableCell>
                        <TableCell align='right'>Pelatut Pelit</TableCell>
                        <TableCell align='right'>Voitot</TableCell>
                        <TableCell align='right'>Häviöt</TableCell>
                        <TableCell align='right'>JA-häviöt</TableCell>
                        <TableCell align='right'>Nolla-pelit</TableCell>
                        <TableCell align='right'>GAA</TableCell>
                        <TableCell align='right'>Torjunta%</TableCell>
                      </>
                    ) : (
                      // Kenttäpelaajan tilastojen otsikot
                      <>
                        <TableCell align='right'>Kausi</TableCell>
                        <TableCell align='right'>Joukkue</TableCell>
                        <TableCell align='right'>Liiga</TableCell>
                        <TableCell align='right'>Pelatut Pelit</TableCell>
                        <TableCell align='right'>Maalit</TableCell>
                        <TableCell align='right'>Syötöt</TableCell>
                        <TableCell align='right'>Pisteet</TableCell>
                        <TableCell align='right'>+/-</TableCell>
                        <TableCell align='right'>Laukaukset</TableCell>
                        <TableCell align='right'>Laukaisu%</TableCell>
                        <TableCell align='right'>Jäähy-minuutit</TableCell>
                        <TableCell align='right'>Voitto-maalit</TableCell>
                        <TableCell align='right'>JA-maalit</TableCell>
                        <TableCell align='right'>YV-maalit</TableCell>
                        <TableCell align='right'>YV-pisteet</TableCell>
                        <TableCell align='right'>AV-maalit</TableCell>
                        <TableCell align='right'>AV-pisteet</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody sx={{
                    '& .MuiTableRow-root:nth-child(odd)': {
                      backgroundColor: 'rgba(0, 0, 0, 0.05)', // Tämä on esimerkki, korvaa väri ja opaciteetti toivotulla
                    },
                    '& .MuiTableRow-root:nth-child(even)': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', // Tämä on esimerkki, korvaa väri ja opaciteetti toivotulla
                    }
                  }}>
                  {näytettävätTilastot.map((season, index) => (
                    <TableRow key={index}>
                      {isGoalie ? (
                        // Maalivahdin tilastojen arvot
                        <>
                          <TableCell align="right">{season.formattedSeason}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>{season.teamName.default}</TableCell>
                          <TableCell align="right">{season.leagueAbbrev}</TableCell>
                          <TableCell align="right">{season.gamesPlayed}</TableCell>
                          <TableCell align="right">{season.wins}</TableCell>
                          <TableCell align="right">{season.losses}</TableCell>
                          <TableCell align="right">{season.otLosses}</TableCell>
                          <TableCell align="right">{season.shutouts}</TableCell>
                          <TableCell align="right">{season.goalsAgainstAvg ? season.goalsAgainstAvg.toFixed(2) : 'N/A'}</TableCell>
                          <TableCell align="right">{season.savePctg ? (season.savePctg * 100).toFixed(1) + '%' : 'N/A'}</TableCell>
                        </>
                      ) : (
                        // Kenttäpelaajan tilastojen arvot
                        <>
                          <TableCell align="right">{season.formattedSeason}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>{season.teamName.default}</TableCell>
                          <TableCell align="right">{season.leagueAbbrev}</TableCell>
                          <TableCell align="right">{season.gamesPlayed}</TableCell>
                          <TableCell align="right">{season.goals}</TableCell>
                          <TableCell align="right" sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)'}}>{season.assists}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)'}}>{season.points}</TableCell>
                          <TableCell align="right">{season.plusMinus}</TableCell>
                          <TableCell align="right">{season.shots}</TableCell>
                          <TableCell align="right">{season.shootingPctg ? (season.shootingPctg * 100).toFixed(1) + '%' : 'N/A'}</TableCell>
                          <TableCell align="right">{season.pim}</TableCell>
                          <TableCell align="right">{season.gameWinningGoals}</TableCell>
                          <TableCell align="right">{season.otGoals}</TableCell>
                          <TableCell align="right">{season.powerPlayGoals}</TableCell>
                          <TableCell align="right">{season.powerPlayPoints}</TableCell>
                          <TableCell align="right">{season.shortHandedGoals}</TableCell>
                          <TableCell align="right">{season.shortHandedPoints}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Card>
        )}
        {virhe && <Typography color="error">{virhe}</Typography>}
      </Box>
    </ThemeProvider>
  );
};

export default Pelaaja;