import express from 'express';
import axios from 'axios';

const apiNHLTeamRouter = express.Router();

// Hae nykyiset sarjataulukot
apiNHLTeamRouter.get('/standings/now', async (req, res) => {
    try {
        const vastaus = await axios.get('https://api-web.nhle.com/v1/standings/now');
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa sarjataulukkoja.');
    }
});

// Hae sarjataulukot tietyltä päivämäärältä
apiNHLTeamRouter.get('/standings/:date', async (req, res) => {
    const date = req.params.date;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/standings/${date}`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa sarjataulukkoja.');
    }
});

// Hae joukkueen tilastot
apiNHLTeamRouter.get('/club-stats/:team/now', async (req, res) => {
    const teamCode = req.params.team;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/club-stats/${teamCode}/now`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa joukkueen tilastoja.');
    }
});

// Hae joukkueen pistetilastot kaudelta
apiNHLTeamRouter.get('/club-stats-season/:team', async (req, res) => {
    const teamCode = req.params.team;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/club-stats-season/${teamCode}`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa joukkueen pistetilastoja kaudelta.');
    }
});

// Hae joukkueen tulos-taulu
apiNHLTeamRouter.get('/scoreboard/:team/now', async (req, res) => {
    const teamCode = req.params.team;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/scoreboard/${teamCode}/now`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa joukkueen tulostaulua.');
    }
});

// Hae joukkueen kokoonpano
apiNHLTeamRouter.get('/roster/:team/current', async (req, res) => {
    const teamCode = req.params.team;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/roster/${teamCode}/current`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa joukkueen kokoonpanoa.');
    }
});

// Hae joukkueen kauden aikataulu
apiNHLTeamRouter.get('/club-schedule-season/:team/:season', async (req, res) => {
    const { team, season } = req.params;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/club-schedule-season/${team}/${season}`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa joukkueen kauden aikataulua.');
    }
});

// Hae joukkueen kokoonpano tietyltä kaudelta
apiNHLTeamRouter.get('/roster/:team/:season', async (req, res) => {
    const { team, season } = req.params;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/roster/${team}/${season}`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa joukkueen kokoonpanoa kaudelta.');
    }
});

// Hae joukkueen lupaukset
apiNHLTeamRouter.get('/prospects/:team', async (req, res) => {
    const teamCode = req.params.team;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/prospects/${teamCode}`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa joukkueen lupauksia.');
    }
});

export default apiNHLTeamRouter;