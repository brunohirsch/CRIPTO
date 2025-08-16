export function classifyCFOP(symbol: string, cmcRank: number | null | undefined, overrides: Record<string,'C'|'F'|'O'|'P'> = {}): 'C'|'F'|'O'|'P' {
  const s = symbol?.toUpperCase?.() || symbol;
  const ov = overrides[s as string];
  if (ov) return ov;
  if (s === 'BTC' || s === 'ETH') return 'C';
  if (cmcRank && cmcRank <= 50) return 'F';
  if (cmcRank && cmcRank <= 200) return 'O';
  return 'P';
}
