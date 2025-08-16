import axios from 'axios';

const CMC_BASE = 'https://pro-api.coinmarketcap.com';

export type QuoteResponse = Record<string, {
  id: number;
  name: string;
  symbol: string;
  cmc_rank: number;
  quote: Record<string, { price: number; market_cap: number; percent_change_24h: number }>;
}>

export async function getCmcQuotes(symbols: string[], convert: string[] = ['USD', 'BRL']) {
  const apiKey = process.env.CMC_API_KEY;
  if (!apiKey) throw new Error('Missing CMC_API_KEY');

  const params = new URLSearchParams();
  params.set('symbol', symbols.join(','));
  params.set('convert', convert.join(','));

  const { data } = await axios.get(`${CMC_BASE}/v1/cryptocurrency/quotes/latest?${params.toString()}`, {
    headers: { 'X-CMC_PRO_API_KEY': apiKey }
  });
  return data.data as QuoteResponse;
}
