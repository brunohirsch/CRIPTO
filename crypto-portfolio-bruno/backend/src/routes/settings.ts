import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

async function getSetting(key: string, fallback: any) {
  const s = await prisma.setting.findUnique({ where: { key } });
  return s ? s.value : fallback;
}

async function setSetting(key: string, value: any) {
  await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
}

router.get('/', async (_req, res, next) => {
  try {
    const [cfopOverrides, rowOrder] = await Promise.all([
      getSetting('cfopOverrides', {}),
      getSetting('rowOrder', [])
    ]);
    res.json({ cfopOverrides, rowOrder });
  } catch (err) { next(err); }
});

router.put('/cfop', async (req, res, next) => {
  try {
    const overrides = req.body?.overrides || {};
    // validate values: only C,F,O,P
    for (const k of Object.keys(overrides)) {
      const v = String(overrides[k]).toUpperCase();
      if (!['C','F','O','P'].includes(v)) return res.status(400).json({ error: `invalid CFOP for ${k}` });
      overrides[k] = v;
    }
    await setSetting('cfopOverrides', overrides);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.put('/order', async (req, res, next) => {
  try {
    const order = Array.isArray(req.body?.order) ? req.body.order.map((s: any) => String(s).toUpperCase()) : [];
    await setSetting('rowOrder', order);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
