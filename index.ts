import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import virhekasittelija from './errors/virhekasittelija';
import dotenv from 'dotenv';
import cors from 'cors'; 
import apiNHLTeamRouter from './routes/apiNHLteams';
import apiNHLPlayerRouter from './routes/apiNHLplayers';
import apiNHLGamesRouter from './routes/apiNHLgames';

dotenv.config();

const app: express.Application = express();
const portti: number = Number(process.env.PORT)

app.use(cors());

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json()); // JSON-pyyntöjen käsittelyyn

app.use("/teams", apiNHLTeamRouter);
app.use("/players", apiNHLPlayerRouter);
app.use("/games", apiNHLGamesRouter);

// Yleinen virheenkäsittelijä
app.use(virhekasittelija);

// 404-virheenkäsittelijä
app.use((req: express.Request, res: express.Response) => {
    if (!res.headersSent) {
        res.status(404).json({ viesti: "Virheellinen reitti" });
    }
});

// Välityspalvelimen määrittely
const apiProxy = createProxyMiddleware('/api', {
    target: 'https://api-web.nhle.com', // Korvaa tämä kohde-API:llasi
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // Poistaa /api-reitin osan ennen välitystä
    },
    onProxyRes: function (proxyRes, req, res) {
        // Lisää CORS-otsikot
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
});

// Käytä välityspalvelinta tietyille reiteille
app.use('/api', apiProxy);


// Palvelimen käynnistys
app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin: ${portti}`);    
});
