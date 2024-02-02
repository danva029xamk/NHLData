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
const portti: number = Number(process.env.PORT) || 3110;

app.use(cors());

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json());

app.use("/teams", apiNHLTeamRouter);
app.use("/players", apiNHLPlayerRouter);
app.use("/games", apiNHLGamesRouter);

app.use(virhekasittelija);

app.use((req: express.Request, res: express.Response) => {
    if (!res.headersSent) {
        res.status(404).json({ viesti: "Virheellinen reitti" });
    }
});

const apiProxy = createProxyMiddleware('/api', {
    target: 'https://api-web.nhle.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '',
    },
    onProxyRes: function (proxyRes, req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
});

app.use('/api', apiProxy);

app.listen(portti, () => {
    console.log(`Palvelin käynnistyi porttiin: ${portti}`);    
});