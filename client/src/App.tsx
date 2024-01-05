import React, { useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Box, Container, ThemeProvider } from "@mui/material";
import Pelaaja from "./components/Pelaaja";
import HaeRosteri from "./components/HaeRosteri";
import JoukkueenValinta from "./components/JoukkueenValinta";
import Sarjataulukko from "./components/Sarjataulukko";
import defaultTheme, { getTeamTheme } from './themes'; // Oletetaan että tämä on polku themes.ts tiedostoon
import teamColors from './constants/colours'; // Oletetaan että tämä on polku teamColors.ts tiedostoon
import Pistetilastot from "./components/Pistetilastot";

const App: React.FC = (): React.ReactElement => {
  const location = useLocation();

  const teamCode = location.pathname.split('/')[2] || 'default'; // Jos ei joukkuetta, käytetään oletusteemaa
  
  // Luodaan muistissa pidettävä joukkueen teema, jotta se ei luo uutta joka renderöinnillä
  const theme = useMemo(() => {
    if (teamCode in teamColors) {
      return getTeamTheme(teamCode as keyof typeof teamColors);
    }
    return defaultTheme; // Jos joukkueen koodia ei löydy, käytetään oletusteemaa
  }, [teamCode]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', height: 'auto' }}>
        <Container>
            <Routes>
              <Route path="/" element={<JoukkueenValinta />} />
              <Route path="/standings" element={<Sarjataulukko />} />
              <Route path="/points" element={<Pistetilastot />} />
              <Route path="/teams/:teamCode" element={<HaeRosteri />} />
              <Route path="/teams/:teamCode/players/:id" element={<Pelaaja />} />
            </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;