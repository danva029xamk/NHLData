import express from 'express';
import axios from 'axios';

const apiNHLPlayerRouter = express.Router();

// Hae pelaajan pelilogi tietyltä kaudelta ja pelityypiltä
apiNHLPlayerRouter.get('/player/:player/game-log/:season/:gameType', async (req, res) => {
    const { player, season, gameType } = req.params;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/player/${player}/game-log/${season}/${gameType}`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa pelaajan pelilogia.');
    }
});

// Hae tietyn pelaajan tiedot
apiNHLPlayerRouter.get('/player/:playerId/landing', async (req, res) => {
    const playerId = req.params.playerId;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/player/${playerId}/landing`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa pelaajan tietoja.');
    }
});

// Hae pelaajan pelilogi nykyhetkestä
apiNHLPlayerRouter.get('/player/:player/game-log/now', async (req, res) => {
    const player = req.params.player;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/player/${player}/game-log/now`);
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa pelaajan pelilogia.');
    }
});

// Hae nykyiset kenttäpelaajien tilastojen johtajat
apiNHLPlayerRouter.get('/skater-stats-leaders/current', async (req, res) => {
    try {
        const vastaus = await axios.get('https://api-web.nhle.com/v1/skater-stats-leaders/current');
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa kenttäpelaajien tilastojen johtajia.');
    }
});

// Hae nykyiset maalivahtien tilastojen johtajat
apiNHLPlayerRouter.get('/goalie-stats-leaders/current', async (req, res) => {
    const { categories, limit } = req.query;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/goalie-stats-leaders/current`, {
            params: {
                categories,
                limit
            }
        });
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa maalivahtien nykyisiä tilastoja.');
    }
});

// Hae maalivahtien tilastojen johtajat tietyltä kaudelta ja pelityypiltä
apiNHLPlayerRouter.get('/goalie-stats-leaders/:season/:gameType', async (req, res) => {
    const { season, gameType } = req.params;
    const { categories, limit } = req.query;
    try {
        const vastaus = await axios.get(`https://api-web.nhle.com/v1/goalie-stats-leaders/${season}/${gameType}`, {
            params: {
                categories,
                limit
            }
        });
        res.json(vastaus.data);
    } catch (error) {
        res.status(500).send('Virhe haettaessa maalivahtien tilastoja kaudelta.');
    }
});


export default apiNHLPlayerRouter;