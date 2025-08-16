export default function CFOPBadge({ value }: { value: 'C'|'F'|'O'|'P' }) {
  const map: Record<string, string> = {
    C: 'Consolidada (BTC/ETH)',
    F: 'Forte',
    O: 'Otimista',
    P: 'Pump'
  };
  return <span className={['badge', value].join(' ')}>{value} · {map[value]}</span>
}
