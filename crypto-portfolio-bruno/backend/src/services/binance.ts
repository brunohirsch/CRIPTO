import crypto from 'crypto';
import axios from 'axios';
import qs from 'qs';

const BINANCE_BASE = 'https://api.binance.com';

function sign(query: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(query).digest('hex');
}

export async function getBinanceAccountBalances() {
  const apiKey = process.env.BINANCE_API_KEY;
  const secret = process.env.BINANCE_API_SECRET;
  if (!apiKey || !secret) throw new Error('Missing BINANCE_API_KEY/SECRET');

  const timestamp = Date.now();
  const queryObj: any = { timestamp, recvWindow: 60000, omitZeroBalances: true };
  const query = qs.stringify(queryObj);
  const signature = sign(query, secret);

  const url = `${BINANCE_BASE}/api/v3/account?${query}&signature=${signature}`;
  const { data } = await axios.get(url, { headers: { 'X-MBX-APIKEY': apiKey } });
  return data;
}

export async function getBinanceUserAssets() {
  const apiKey = process.env.BINANCE_API_KEY;
  const secret = process.env.BINANCE_API_SECRET;
  if (!apiKey || !secret) throw new Error('Missing BINANCE_API_KEY/SECRET');

  const timestamp = Date.now();
  const queryObj: any = { timestamp, recvWindow: 60000, needBtcValuation: true };
  const query = qs.stringify(queryObj);
  const signature = sign(query, secret);
  const url = `${BINANCE_BASE}/sapi/v3/asset/getUserAsset?${query}&signature=${signature}`;

  const { data } = await axios.post(url, null, { headers: { 'X-MBX-APIKEY': apiKey } });
  return data;
}
