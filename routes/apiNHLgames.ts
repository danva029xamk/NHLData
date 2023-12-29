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

export default apiNHLGamesRouter;