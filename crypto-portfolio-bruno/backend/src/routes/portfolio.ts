import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCmcQuotes } from '../services/coinmarketcap.js';
import { getBinanceAccountBalances, getBinanceUserAssets } from '../services/binance.js';
import { mbAuthorize, mbListAccounts, mbGetBalances } from '../services/mercadobitcoin.js';

const prisma = new PrismaClient();
const router = Router();

type Holding = { symbol: string; amount: number };

function normalizeBinance(spot: any, userAssets: any): Holding[] {
  const map: Record<string, number> = {};
  if (spot?.balances) {
    for (const b of spot.balances) {
      const total = parseFloat(b.free) + parseFloat(b.locked);
      if (total > 0) map[b.asset] = (map[b.asset] || 0) + total;
    }
  }
  if (Array.isArray(userAssets)) {
    for (const a of userAssets) {
      const fields = ['free','locked','freeze','withBorrow','withWithdraw','netAsset'];
      const total = fields.reduce((acc, k) => acc + (parseFloat((a as any)[k]) || 0), 0);
      if (total > 0) map[(a as any).asset] = Math.max(map[(a as any).asset] || 0, total);
    }
  }
  return Object.entries(map).map(([symbol, amount]) => ({ symbol, amount }));
}

function normalizeMB(balances: any): Holding[] {
  const out: Holding[] = [];
  const arr = Array.isArray(balances) ? balances : (balances?.items || []);
  for (const b of arr) {
    const sym = String((b.currency || b.asset || b.symbol || '')).toUpperCase();
    const available = Number((b as any).available ?? (b as any).free ?? 0);
    const locked = Number((b as any).locked ?? (b as any).hold ?? 0);
    const total = available + locked;
    if (sym && total > 0 && !['BRL','MBRL','R$'].includes(sym)) out.push({ symbol: sym, amount: total });
  }
  return out;
}

function mergeHoldings(...holdings: Holding[][]): Holding[] {
  const map: Record<string, number> = {};
  for (const list of holdings) {
    for (const h of list) {
      map[h.symbol] = (map[h.symbol] || 0) + h.amount;
    }
  }
  return Object.entries(map).map(([symbol, amount]) => ({ symbol, amount }));
}

function classifyCFOP(symbol: string, cmcRank: number | null | undefined, overrides: Record<string,string>) {
  const s = symbol.toUpperCase();
  const ov = overrides[s];
  if (ov && ['C','F','O','P'].includes(ov)) return ov as 'C'|'F'|'O'|'P';
  if (s === 'BTC' || s === 'ETH') return 'C';
  if (cmcRank && cmcRank <= 50) return 'F';
  if (cmcRank && cmcRank <= 200) return 'O';
  return 'P';
}

async function getSetting(key: string, fallback: any) {
  const s = await prisma.setting.findUnique({ where: { key } });
  return s ? s.value as any : fallback;
}

router.get('/', async (_req, res, next) => {
  try {
    const [spot, userAssets] = await Promise.all([
      getBinanceAccountBalances().catch(() => null),
      getBinanceUserAssets().catch(() => null)
    ]);

    let mbHoldings: Holding[] = [];
    try {
      const token = await mbAuthorize();
      const accounts = await mbListAccounts(token);
      const account = Array.isArray(accounts) ? (accounts.find((a: any) => a.default) || accounts[0]) : accounts;
      const accountId = account?.id ?? account?.accountId ?? account?.uuid;
      if (accountId) {
        const balances = await mbGetBalances(token, accountId);
        mbHoldings = normalizeMB(balances);
      }
    } catch {}

    const manual = await prisma.manualHolding.findMany();
    const manualHoldings: Holding[] = manual.map(m => ({ symbol: m.symbol.toUpperCase(), amount: Number(m.amount) }));

    const binanceHoldings = normalizeBinance(spot, userAssets);
    const merged = mergeHoldings(binanceHoldings, mbHoldings, manualHoldings);

    const symbols = merged.map(m => m.symbol).filter(s => /^[A-Z0-9]+$/.test(s));
    const quotes = symbols.length ? await getCmcQuotes(symbols, ['USD','BRL']) : {} as any;

    const cfopOverrides = await getSetting('cfopOverrides', {});
    const rowOrder: string[] = await getSetting('rowOrder', []);

    let breakdown = merged.map(h => {
      const q = quotes[h.symbol]?.quote;
      const usd = q?.USD?.price || 0;
      const brl = q?.BRL?.price || 0;
      const cmc_rank = quotes[h.symbol]?.cmc_rank ?? null;
      const cfop = classifyCFOP(h.symbol, cmc_rank, cfopOverrides);
      return {
        symbol: h.symbol,
        amount: h.amount,
        priceUSD: usd,
        priceBRL: brl,
        valueUSD: h.amount * usd,
        valueBRL: h.amount * brl,
        cmc_rank,
        cfop
      };
    });

    // Se houver ordem customizada, aplica; senão, ordena por valor USD
    if (Array.isArray(rowOrder) && rowOrder.length > 0) {
      const index: Record<string, number> = {};
      rowOrder.forEach((s, i) => index[s] = i);
      breakdown.sort((a, b) => {
        const ia = (index[a.symbol] ?? 1e9);
        const ib = (index[b.symbol] ?? 1e9);
        if (ia !== ib) return ia - ib;
        return b.valueUSD - a.valueUSD;
      });
    } else {
      breakdown.sort((a,b) => b.valueUSD - a.valueUSD);
    }

    const totalUSD = breakdown.reduce((acc, x) => acc + x.valueUSD, 0);
    const totalBRL = breakdown.reduce((acc, x) => acc + x.valueBRL, 0);

    res.json({ totalUSD, totalBRL, breakdown, settings: { cfopOverrides, rowOrder } });
  } catch (err) { next(err); }
});

export default router;
