import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Table, TableCell, TableContainer, TableBody, TableHead, TableRow, Button, Paper, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';

interface PelaajaTilastot {
  id: number;
  headshot: string;
  firstName: { default: string; [key: string]: string };
  lastName: { default: string; [key: string]: string };
  teamLogo: string;
  position: string;
  value: number;
  sweaterNumber: number;
}

const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'goals': return 'Maalit';
      case 'goalsSh': return 'AV-maalit';
      case 'assists': return 'Syöttöpisteet';
      case 'plusMinus': return '+/-';
      case 'goalsPp': return 'YV-maalit';
      case 'faceoffLeaders': return 'Aloitus%';
      case 'penaltyMins': return 'Jäähyt (min)';
      case 'toi': return 'Peliaika (min)';
      // Maalivahtien tilastokategoriat
      case 'wins': return 'Voitot';
      case 'shutouts': return 'Nollapelit';
      case 'savePctg': return 'Torjuntaprosentti';
      case 'goalsAgainstAverage': return 'Päästettyjen maalien keskiarvo';
      default: return 'Pisteet';
    }
};

const formatValue = (category: string, value: number) => {
    if (category === 'faceoffLeaders') {
      return `${(value * 100).toFixed(1)}%`; // Muunnetaan prosenteiksi
    } else if (category === 'toi') {
      return Math.floor(value); // Kokonaisluku
    } else if (category === 'savePctg') {
        return `${(value * 100).toFixed(1)}%`;
    } else if (category === 'goalsAgainstAverage') {
        return `${value.toFixed(2)}`;
    } else if (category === 'toi') {
        return Math.floor(value); // Kokonaisluku
    } else {
      return value; // Muut arvot sellaisenaan
    }
  };

const extractTeamCodeFromLogoUrl = (url: string) => {
    const parts = url.split('/');
    const logoFileName = parts[parts.length - 1];
    const teamCode = logoFileName.split('_')[0];
    return teamCode;
};

const Pistetilastot: React.FC = () => {
  const [pelaajat, setPelaajat] = useState<PelaajaTilastot[]>([]);
  const [kategoria, setKategoria] = useState<string>('points');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [filteredPlayers, setFilteredPlayers] = useState<PelaajaTilastot[]>([]);
  const [playerType, setPlayerType] = useState<string>('F');
  const [virhe, setVirhe] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Kun playerType vaihtuu, päivitä kategoria oletusarvoihin
    if (playerType === 'F') {
        setKategoria('points'); // Kenttäpelaajien oletuskategoria
        setPositionFilter('all'); // Varmistetaan, että suodatin on neutraalissa asennossa
      } else {
        setKategoria('wins'); // Maalivahtien oletuskategoria
        setPositionFilter('all'); // Varmistetaan, että suodatin on neutraalissa asennossa
      }
  }, [playerType]);

  useEffect(() => {
    const haePelaajat = async () => {
      try {

        if (positionFilter === 'D' && kategoria === 'faceoffLeaders') {
            setVirhe('Aloitusprosenttitilastot eivät ole saatavilla puolustajille.');
            setPelaajat([]);
            return; 
        }

        const endpoint = playerType === 'F' ? 
          `http://localhost:3110/players/skater-stats-leaders/current?categories=${kategoria}&limit=-1` : 
          `http://localhost:3110/players/goalie-stats-leaders/current?categories=${kategoria}&limit=-1`;
        const vastaus = await axios.get(endpoint);
        if (vastaus.data && vastaus.data[kategoria]) {
            setPelaajat(vastaus.data[kategoria]);
        } else {
            setPelaajat([]);
        }
      } catch (error) {
        setVirhe('Virhe haettaessa pelaajatilastoja.');
      }
    };
  
    haePelaajat();
  }, [kategoria, playerType, positionFilter]);

  useEffect(() => {
    const suodatetutPelaajat = pelaajat.filter(pelaaja => {
      if (positionFilter === 'all') return true;
      if (positionFilter === 'D') return pelaaja.position === 'D';
      if (positionFilter === 'F') return ['L', 'C', 'R'].includes(pelaaja.position);
      return false; // Lisätty oletusarvoinen palautusarvo
    }).slice(0, 50);
    setFilteredPlayers(suodatetutPelaajat);
  }, [pelaajat, positionFilter]);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setKategoria(event.target.value as string);
  };

  const kenttapelaajaKategoriat = [
    "points", "goals", "assists", "plusMinus", "goalsPp", "goalsSh", "faceoffLeaders", "penaltyMins", "toi"
  ];

  const maalivahtiKategoriat = [
    "wins", "shutouts", "savePctg", "goalsAgainstAverage"
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#001628' }}>
      <Button variant="contained" onClick={handleBackClick} sx={{ mb: 2 }}>
        Palaa Etusivulle
      </Button>
      <Typography variant="h3" sx={{ mb: 2, color: "#FFFFFF", fontFamily: 'Impact', textAlign: 'center' }}>
        Pistepörssi
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', backgroundColor: '#003366', padding: '10px', borderRadius: '10px' }}>
        <Select
          value={playerType}
          onChange={(e: SelectChangeEvent) => setPlayerType(e.target.value)}
          sx={{ 
            width: '200px', 
            bgcolor: 'white',
            height: '40px',
            borderRadius: '5px' 
        }}>
          <MenuItem value="F">Kenttäpelaajat</MenuItem>
          <MenuItem value="G">Maalivahdit</MenuItem>
        </Select>
        <Select
          value={kategoria}
          onChange={handleCategoryChange}
          sx={{ 
            width: '200px', 
            bgcolor: 'white',
            height: '40px',
            borderRadius: '5px',
        }}>
          {(playerType === 'F' ? kenttapelaajaKategoriat : maalivahtiKategoriat).map((value) => (
            <MenuItem key={value} value={value}>
              {getCategoryLabel(value)}
            </MenuItem>
          ))}
        </Select>
        {playerType === 'F' && (
          <Select
            value={positionFilter}
            onChange={(e: SelectChangeEvent) => setPositionFilter(e.target.value)}
            sx={{ 
                width: '200px', 
                bgcolor: 'white',
                height: '40px',
                borderRadius: 2,  
            }}>
            <MenuItem value="all">Kaikki kenttäpelaajat</MenuItem>
            <MenuItem value="F">Hyökkääjät</MenuItem>
            <MenuItem value="D">Puolustajat</MenuItem>
          </Select>
        )}
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#a6a6a6' }}>
            <TableRow>
              <TableCell>#</TableCell> 
              <TableCell>Kuva</TableCell>
              <TableCell>Peli#</TableCell>
              <TableCell>Nimi</TableCell>
              <TableCell>Joukkue</TableCell>
              <TableCell>{getCategoryLabel(kategoria)}</TableCell>
              <TableCell>Pelipaikka</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers.map((pelaaja, index) => {
              const teamCode = extractTeamCodeFromLogoUrl(pelaaja.teamLogo);
              return (
                <TableRow key={pelaaja.id} sx={{ backgroundColor: index % 2 ? '#e6e6e6' : 'white' }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    <a href={`/teams/${teamCode}/players/${pelaaja.id}`} target="_blank" rel="noopener noreferrer">
                      <img
                        src={pelaaja.headshot}
                        alt={`${pelaaja.firstName.default} ${pelaaja.lastName.default}`}
                        style={{ width: '100px', borderRadius: '10%' }}
                      />
                    </a>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{pelaaja.sweaterNumber}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{`${pelaaja.firstName.default} ${pelaaja.lastName.default}`}</TableCell>
                  <TableCell>
                    <img
                      src={pelaaja.teamLogo}
                      alt="Joukkueen logo"
                      style={{ width: '60px', height: '60px' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {formatValue(kategoria, pelaaja.value)}
                  </TableCell>
                  <TableCell>{pelaaja.position}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {virhe && (
      <Typography 
        variant="subtitle1" 
        sx={{ textAlign: 'center', color: 'black', mt: 2 }}
      >
        {virhe}
      </Typography>
    )}
    </div>
  );  
};

export default Pistetilastot;
