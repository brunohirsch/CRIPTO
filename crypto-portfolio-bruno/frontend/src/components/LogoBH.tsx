export default function LogoBH({ size = 28 }: { size?: number }) {
  // Hex + BH monospace, inspirado porém único (sem marca Binance)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Logo Bruno Hirsch">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0b90b" />
          <stop offset="100%" stopColor="#f8d12f" />
        </linearGradient>
      </defs>
      <polygon points="50,5 93,28 93,72 50,95 7,72 7,28" fill="url(#g)" />
      <text x="50" y="58" textAnchor="middle" fontFamily="Menlo, monospace" fontWeight="900" fontSize="38" fill="#111">BH</text>
    </svg>
  );
}
