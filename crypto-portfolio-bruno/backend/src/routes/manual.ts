import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const items = await prisma.manualHolding.findMany({ orderBy: { id: 'desc' } });
    res.json({ items });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { symbol, amount, wallet } = req.body || {};
    if (!symbol || !amount) return res.status(400).json({ error: 'symbol and amount are required' });
    const created = await prisma.manualHolding.create({ data: { symbol: String(symbol).toUpperCase(), amount, wallet } });
    res.json({ created });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.manualHolding.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
