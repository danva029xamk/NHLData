import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import defaultTheme, { getTeamTheme } from '../themes';
import teamColors from '../constants/colours';
import { Card, Typography, Table, TableBody, TableCell, TableHead, TableRow, ThemeProvider, Button, Box, Grid } from '@mui/material';

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
  // Nykyisen kauden tilastot
  seasonStats: {
    // Kenttäpelaajien tilastot
    gamesPlayed?: number;
    goals?: number;
    assists?: number;
    points?: number;
    plusMinus?: number;
    shots?: number;
    shootingPctg?: number | undefined;
    pim?: number; // Penalty minutes
    gameWinningGoals?: number;
    otGoals?: number;
    powerPlayGoals?: number;
    powerPlayPoints?: number;
    shortHandedGoals?: number;
    shortHandedPoints?: number;

    // Maalivahtien tilastot
    wins?: number;
    losses?: number;
    ties?: number;
    otLosses?: number;
    shutouts?: number;
    goalsAgainstAvg?: number;
    savePctg?: number;
  };
  seasonTotals: any[];
  draftDetails: {
    year: number;
    round: number;
    pickInRound: number;
    overallPick: number;
  };
  featuredStats: {
    season: number;
    regularSeason: {
      subSeason: {
        // ... (nykyisen kauden tilastot)
      };
      career: {
        gamesPlayed: number;
        goals: number;
        assists: number;
        points: number;
        plusMinus: number;
        pim: number;
        gameWinningGoals: number;
        otGoals: number;
        shots: number;
        shootingPctg: number;
        powerPlayGoals: number;
        powerPlayPoints: number;
        shorthandedGoals: number;
        shorthandedPoints: number;
      };
    };
  };
  currentTeamAbbrev: string;
}


const Pelaaja: React.FC = () => {
  const [pelaaja, setPelaaja] = useState<PelaajaData | null>(null);
  const [virhe, setVirhe] = useState<string>('');
  const [theme, setTheme] = useState<any | undefined>(undefined);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const formatSeason = (seasonYear: string) => {
    const startYear = seasonYear.substring(0, 4);
    const endYear = seasonYear.substring(6, 8);
    const formatted = `${startYear}-${endYear}`;
    return formatted;
  }

  useEffect(() => {
    const haePelaajanTiedot = async () => {
      try {
        const vastaus = await axios.get(`http://localhost:3110/players/player/${id}/landing`);
        const pelaajanData = vastaus.data;
        const joukkueKoodi = pelaajanData.currentTeamAbbrev as keyof typeof teamColors;

        console.log("Pelaajan tiedot:", pelaajanData);

        if (teamColors[joukkueKoodi]) {
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
      
          // Suodata pois playoff-tilastot
          pelaaja.seasonTotals = pelaaja.seasonTotals.filter((season: { gameTypeId: number }) => season.gameTypeId === 2);

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


  const themeToUse = theme || defaultTheme;

  const isGoalie = pelaaja?.position === "G";

  const handleBackClick = () => {
    navigate(`/teams/${pelaaja?.currentTeamAbbrev}`); // Ohjaa käyttäjän takaisin edelliselle sivulle
  };

  return  (
    <ThemeProvider theme={themeToUse}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Button variant="contained" onClick={handleBackClick} style={{ marginBottom: '20px' }}>
          Palaa Takaisin
        </Button>
        {pelaaja && (
          <Card>
            <Grid container spacing={2} alignItems="center">
              {/* Pelaajan kuva */}
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', justifyContent: 'center', background: "#fff"}}>
                  <img src={pelaaja.headshot} alt={`Kuva pelaajasta ${pelaaja.fullName}`} style={{ height: '200px' }} />
                </Box>
              </Grid>

              {/* Perustiedot */}
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{pelaaja.fullName}</Typography>
                  <Typography variant="body1">Pituus: {pelaaja.heightInCentimeters} cm</Typography>
                  <Typography variant="body1">Paino: {pelaaja.weightInKilograms} kg</Typography>
                  <Typography variant="body1">Syntymäaika: {pelaaja.birthDate}</Typography>
                  <Typography variant="body1">Syntymäkaupunki: {pelaaja.birthCity}</Typography>
                  <Typography variant="body1">Maa: {pelaaja.birthCountry}</Typography>
                  <Typography variant="body1">Kätisyys: {pelaaja.shootsCatches}</Typography>
                </Box>
              </Grid>

              {/* Draft-tiedot */}
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '16px' }}>
                  {pelaaja.draftDetails ? (
                    <>
                      <Typography variant="body1">Draft-vuosi: {pelaaja.draftDetails.year}</Typography>
                      <Typography variant="body1">Kierros: {pelaaja.draftDetails.round}</Typography>
                      <Typography variant="body1">Valinta kierroksella: {pelaaja.draftDetails.pickInRound}</Typography>
                      <Typography variant="body1">Kokonaisvalinta: {pelaaja.draftDetails.overallPick}</Typography>
                    </>
                  ) : (
                    <Typography variant="body1">Pelaajaa ei ole varattu</Typography>
                  )}
                </Box>
              </Grid>

              {/* Joukkueen logo */}
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                  <img src={pelaaja.teamLogo} alt={`Logo joukkueesta ${pelaaja.fullTeamName?.default}`} style={{ height: '150px', maxWidth: '100%' }} />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ bgcolor: themeToUse.palette.primary.main, color: themeToUse.palette.primary.contrastText, paddingTop:"10px" }}>
              <Typography variant="h6">
                Uran tilastot
              </Typography>
            </Box>

            <Box sx={{ overflowX: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
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
                  </TableRow>
                </TableHead>
                {pelaaja && pelaaja.featuredStats  && pelaaja.featuredStats.regularSeason && pelaaja.featuredStats.regularSeason.career && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.gamesPlayed}</TableCell>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.goals}</TableCell>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.assists}</TableCell>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.points}</TableCell>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.shots}</TableCell>
                      <TableCell align="right">{(pelaaja.featuredStats.regularSeason.career.shootingPctg * 100).toFixed(1)}%</TableCell>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.pim}</TableCell>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.gameWinningGoals}</TableCell>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.otGoals}</TableCell>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.powerPlayGoals}</TableCell>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.powerPlayPoints}</TableCell>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.shorthandedGoals}</TableCell>
                      <TableCell align="right">{pelaaja.featuredStats.regularSeason.career.shorthandedPoints}</TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </Box>

            <Box sx={{ bgcolor: themeToUse.palette.primary.main, color: themeToUse.palette.primary.contrastText, paddingTop:"10px" }}>
              <Typography variant="h6">
                Tilastot kausittain
              </Typography>
            </Box>

            <Box sx={{ overflowX: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
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
                <TableBody>
                  {pelaaja.seasonTotals.map((season, index) => (
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
                          <TableCell align="right">{season.assists}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>{season.points}</TableCell>
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
