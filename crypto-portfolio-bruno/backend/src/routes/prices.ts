import { Router } from 'express';
import { getCmcQuotes } from '../services/coinmarketcap.js';

const router = Router();

router.get('/quotes', async (req, res, next) => {
  try {
    const symbolsParam = (req.query.symbols as string) || '';
    const convertParam = (req.query.convert as string) || 'USD,BRL';
    const symbols = symbolsParam.split(',').map(s => s.trim()).filter(Boolean);
    const convert = convertParam.split(',').map(s => s.trim()).filter(Boolean);
    if (symbols.length === 0) return res.status(400).json({ error: 'symbols query required' });
    const data = await getCmcQuotes(symbols, convert);
    res.json({ data });
  } catch (err) { next(err); }
});

export default router;
