import { Router } from 'express';
import { getBinanceAccountBalances, getBinanceUserAssets } from '../services/binance.js';
import { mbAuthorize, mbListAccounts, mbGetBalances } from '../services/mercadobitcoin.js';

const router = Router();

router.get('/binance', async (_req, res, next) => {
  try {
    const [account, userAssets] = await Promise.all([
      getBinanceAccountBalances().catch(() => null),
      getBinanceUserAssets().catch(() => null)
    ]);
    res.json({ account, userAssets });
  } catch (err) { next(err); }
});

router.get('/mercadobitcoin', async (_req, res, next) => {
  try {
    const token = await mbAuthorize();
    const accounts = await mbListAccounts(token);
    const account = Array.isArray(accounts) ? (accounts.find((a: any) => a.default) || accounts[0]) : accounts;
    const accountId = account?.id ?? account?.accountId ?? account?.uuid;
    if (!accountId) return res.status(400).json({ error: 'No MB account id found' });
    const balances = await mbGetBalances(token, accountId);
    res.json({ account, balances });
  } catch (err) { next(err); }
});

export default router;
