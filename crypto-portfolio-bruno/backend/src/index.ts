import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import balancesRouter from './routes/balances.js';
import pricesRouter from './routes/prices.js';
import portfolioRouter from './routes/portfolio.js';
import manualRouter from './routes/manual.js';
import settingsRouter from './routes/settings.js';

const app = express();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8787;
const TRUSTED_ORIGINS = (process.env.TRUSTED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

app.use(helmet());
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (TRUSTED_ORIGINS.length === 0 || TRUSTED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  }
}));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/balances', balancesRouter);
app.use('/api/prices', pricesRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/manual', manualRouter);
app.use('/api/settings', settingsRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[backend] http://localhost:${PORT}`);
});
