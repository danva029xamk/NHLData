import express from 'express';
import axios from 'axios';

const apiNHLGamesRouter = express.Router();

// Hae päivän tulokset
apiNHLGamesRouter.get('/score/now', async (req, res) => {
    try {
        const vastaus = await axios.get('https://api-web.nhle.com/v1/score/now');
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa päivän tuloksia.');
    }
});

// Hae tulokset tietyltä päivämäärältä
apiNHLGamesRouter.get('/score/:date', async (req, res) => {
    const date = req.params.date;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/score/${date}`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa tuloksia päivämäärällä.');
    }
});

// Hae kokonaistulostaulu
apiNHLGamesRouter.get('/scoreboard/now', async (req, res) => {
    try {
        const vastaus = await axios.get('https://api-web.nhle.com/v1/scoreboard/now');
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa kokonaistulostaulua.');
    }
});

// Hae pelikalenteri
apiNHLGamesRouter.get('/schedule-calendar/now', async (req, res) => {
    try {
        const vastaus = await axios.get('https://api-web.nhle.com/v1/schedule-calendar/now');
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa kalenteria.');
    }
});

// Hae pelikalenteri tietylle joukkueelle
apiNHLGamesRouter.get('/schedule-calendar/:teamAbbrev/now', async (req, res) => {
    const { teamAbbrev } = req.params;
    const url = `https://api-web.nhle.com/v1/club-schedule-season/${teamAbbrev}/now`;

    try {
        const vastaus = await axios.get(url);
        res.json(vastaus.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Virhe haettaessa kalenteria.');
    }
});

export default apiNHLGamesRouter;