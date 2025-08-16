import axios from 'axios';
const MB_BASE = process.env.MB_BASE_URL || 'https://api.mercadobitcoin.net/api/v4';

export async function mbAuthorize() {
  const id = process.env.MB_API_ID;
  const secret = process.env.MB_API_SECRET;
  if (!id || !secret) throw new Error('Missing MB_API_ID/MB_API_SECRET');
  const { data } = await axios.post(`${MB_BASE}/authorize`, { username: id, password: secret });
  const token = data?.access_token ?? data?.accessToken ?? data?.token;
  if (!token) throw new Error('MB authorize: token not found');
  return token as string;
}

export async function mbListAccounts(token: string) {
  const { data } = await axios.get(`${MB_BASE}/accounts`, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}

export async function mbGetBalances(token: string, accountId: string | number) {
  const { data } = await axios.get(`${MB_BASE}/accounts/${accountId}/balances`, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}
