import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, Typography, Button } from '@mui/material';
import JoukkueenLogo from './JoukkueenLogo';
import { useNavigate } from 'react-router-dom';

interface Joukkue {
  teamName: { default: string };
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  points: number;
  pointPctg: number;
  teamCode: string;
  conferenceName: string;
  divisionName: string;
  goalFor: number;
  goalAgainst: number;
  goalDifferential: number;
  homeWins: number;
  homeLosses: number;
  homeOtLosses: number;
  roadWins: number;
  roadLosses: number;
  roadOtLosses: number;
}

interface KonferenssitJaDivisioonat {
  [key: string]: Joukkue[];
}

const Sarjataulukko: React.FC = () => {
  const [joukkueet, setJoukkueet] = useState<Joukkue[]>([]);
  const [lataa, setLataa] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/'); // Ohjaa käyttäjän takaisin aloitusnäkymään
  };

  useEffect(() => {
    if (lataa) {
      haeJoukkueet();
      setLataa(false);
    }
  }, [lataa]);

  const haeJoukkueet = async () => {
    try {
      const vastaus = await axios.get('http://localhost:3110/teams/standings/now');
      if (vastaus.data && Array.isArray(vastaus.data.standings)) {
        const joukkueetData = vastaus.data.standings.map((joukkue: any) => ({
          ...joukkue,
          teamCode: joukkue.teamAbbrev.default,
          conferenceAbbrev: joukkue.conferenceAbbrev,
          divisionAbbrev: joukkue.divisionAbbrev
        }));
        setJoukkueet(joukkueetData);
      } else {
        setJoukkueet([]);
      }
    } catch (error) {
      console.error('Virhe haettaessa joukkueita:', error);
      setJoukkueet([]);
    }
  };

  const konferenssit: KonferenssitJaDivisioonat = {};
  const divisioonat: KonferenssitJaDivisioonat = {};


  const tableHeadCells = (
    <>
      <TableCell></TableCell>
      <TableCell style={{ minWidth: '178px' }}>Joukkueen nimi</TableCell>
      <TableCell style={{ minWidth: '100px' }} align="right">Pelatut Ottelut</TableCell>
      <TableCell style={{}} align="right">Voitot</TableCell>
      <TableCell style={{}} align="right">Häviöt</TableCell>
      <TableCell style={{}} align="right">JA-häviöt</TableCell>
      <TableCell style={{}} align="right">Pisteet</TableCell>
      <TableCell style={{}} align="right">Piste-prosentti</TableCell>
      <TableCell style={{}} align="right">Tehdyt Maalit</TableCell>
      <TableCell style={{}} align="right">Päästetyt Maalit</TableCell>
      <TableCell style={{}} align="right">Maaliero</TableCell>
      <TableCell style={{}} align="right">Koti-voitot</TableCell>
      <TableCell style={{}} align="right">Koti-tappiot</TableCell>
      <TableCell style={{}} align="right">Koti JA-tappiot</TableCell>
      <TableCell style={{}} align="right">Vieras-voitot</TableCell>
      <TableCell style={{}} align="right">Vieras-tappiot</TableCell>
      <TableCell style={{}} align="right">Vieras JA-tappiot</TableCell>
    </>
  );

  const renderTableRow = (joukkue: Joukkue, index: number) => (
    <TableRow key={joukkue.teamName.default} sx={{ bgcolor: index % 2 ? 'grey.100' : 'white' }}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(`/teams/${joukkue.teamCode}`)}>
          <JoukkueenLogo teamCode={joukkue.teamCode} width='30px' />
          <Typography sx={{ marginLeft: '8px', fontWeight: 'bold' }}>
            {joukkue.teamName.default}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="right">{joukkue.gamesPlayed}</TableCell>
      <TableCell align="right">{joukkue.wins}</TableCell>
      <TableCell align="right">{joukkue.losses}</TableCell>
      <TableCell align="right">{joukkue.otLosses}</TableCell>
      <TableCell align="right">{joukkue.points}</TableCell>
      <TableCell align="right">{(joukkue.pointPctg * 100).toFixed(1)}%</TableCell>
      <TableCell align="right">{joukkue.goalFor}</TableCell>
      <TableCell align="right">{joukkue.goalAgainst}</TableCell>
      <TableCell align="right">{joukkue.goalDifferential}</TableCell>
      <TableCell align="right">{joukkue.homeWins}</TableCell>
      <TableCell align="right">{joukkue.homeLosses}</TableCell>
      <TableCell align="right">{joukkue.homeOtLosses}</TableCell>
      <TableCell align="right">{joukkue.roadWins}</TableCell>
      <TableCell align="right">{joukkue.roadLosses}</TableCell>
      <TableCell align="right">{joukkue.roadOtLosses}</TableCell>
    </TableRow>
  );

  joukkueet.forEach((joukkue: Joukkue) => {
    const conference = joukkue.conferenceName;
    const division = joukkue.divisionName;

    if (!konferenssit[conference]) {
      konferenssit[conference] = [];
    }
    konferenssit[conference].push(joukkue);

    if (!divisioonat[division]) {
      divisioonat[division] = [];
    }
    divisioonat[division].push(joukkue);
  });

  return (
    <>
      <Paper sx={{ mb: 2, overflowX: 'auto' }}>
        <Button variant="contained" color="primary" fullWidth onClick={handleBackClick}>
              Palaa Etusivulle
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pl: 5, pt: 1 }}>
          <Typography variant="h4" sx={{ fontFamily: 'Impact, sans-serif', fontWeight: 'bold' }}>NHL</Typography>
        </Box>
          <Table>
            <TableHead>
              <TableRow>{tableHeadCells}</TableRow>
            </TableHead>
            <TableBody>
              {joukkueet.map((joukkue, index) => renderTableRow(joukkue, index))}
            </TableBody>
          </Table>
        </Paper>
        {Object.keys(konferenssit).map(conference => (
          <Paper key={conference} sx={{ mb: 2, overflowX: 'auto' }}>
            <Typography variant="h6" sx={{ p: 2 }}>{conference} Conference</Typography>
            <Table>
              <TableHead>
                <TableRow>{tableHeadCells}</TableRow>
              </TableHead>
              <TableBody>
                {konferenssit[conference].map((joukkue, index) => renderTableRow(joukkue, index))}
              </TableBody>
            </Table>
          </Paper>
        ))}
        {Object.keys(divisioonat).map(division => (
          <Paper key={division} sx={{ mb: 2, overflowX: 'auto'  }}>
            <Typography variant="h6" sx={{ p: 2 }}>{division} Division</Typography>
            <Table>
              <TableHead>
                <TableRow>{tableHeadCells}</TableRow>
              </TableHead>
              <TableBody>
                {divisioonat[division].map((joukkue, index) => renderTableRow(joukkue, index))}
              </TableBody>
            </Table>
          </Paper>
        ))}
    </>
  );
};

export default Sarjataulukko;
