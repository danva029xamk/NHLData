import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Table, TableCell, TableContainer, TableBody, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface Game {
  gameState?: string;
  gameDate: string;
  homeTeam: {
    abbrev: string;
  };
  awayTeam: {
    abbrev: string;
  };
}

const Kalenteri: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string>('');
  const { teamCode } = useParams<{ teamCode: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameSchedule = async () => {
        try {
          const response = await axios.get<{ games: Game[] }>(`http://localhost:3110/games/schedule-calendar/${teamCode}/now`);
          const futureGames = response.data.games.filter(game => game.gameState === "FUT").map(game => ({
            gameDate: game.gameDate,
            homeTeam: { abbrev: game.homeTeam.abbrev },
            awayTeam: { abbrev: game.awayTeam.abbrev },
          }));
          setGames(futureGames);
        } catch (err) {
          setError('Virhe haettaessa otteluita.');
          console.error(err);
        }
      };

    if (teamCode) {
      fetchGameSchedule();
    }
  }, [teamCode]);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#001628' }}>
      <Button onClick={handleBackClick} variant="contained" style={{ marginBottom: '20px' }}>Palaa</Button>
      <Typography variant="h4" sx={{ mb: 2, color: "#FFFFFF", textAlign: 'center' }}>
        Tulevat ottelut
      </Typography>
      <Typography variant="h4" sx={{ color: '#FFF'}}>HUOM! Tämä komponentti on vielä kehitysvaiheessa</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#003366' }}>
            <TableRow>
              <TableCell>Päivämäärä</TableCell>
              <TableCell>Koti</TableCell>
              <TableCell>Vieras</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game, index) => (
              <TableRow key={index}>
                <TableCell>{game.gameDate}</TableCell>
                <TableCell>{game.homeTeam.abbrev}</TableCell>
                <TableCell>{game.awayTeam.abbrev}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {error && (
        <Typography 
          variant="subtitle1" 
          sx={{ textAlign: 'center', color: 'red', mt: 2 }}
        >
          {error}
        </Typography>
      )}
    </div>
  );
};

export default Kalenteri;