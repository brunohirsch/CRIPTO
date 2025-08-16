import axios from 'axios';
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787/api';
export const api = axios.create({ baseURL: API_BASE });

export async function getSettings() {
  const { data } = await api.get('/settings');
  return data as { cfopOverrides: Record<string,'C'|'F'|'O'|'P'>; rowOrder: string[] };
}
export async function saveCfop(overrides: Record<string,'C'|'F'|'O'|'P'>) {
  await api.put('/settings/cfop', { overrides });
}
export async function saveOrder(order: string[]) {
  await api.put('/settings/order', { order });
}
