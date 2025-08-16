import CFOPBadge from './CFOPBadge';

type Row = any;
type Props = {
  rows: Row[];
  currency: 'USD'|'BRL';
  editable?: boolean;
  cfopOverrides?: Record<string,'C'|'F'|'O'|'P'>;
  onCfopChange?: (symbol: string, value: 'C'|'F'|'O'|'P') => void;
  onReorder?: (order: string[]) => void;
};

export default function PortfolioTable({ rows, currency, editable = false, cfopOverrides = {}, onCfopChange, onReorder }: Props) {
  const money = (v:number) => currency === 'BRL'
    ? v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })
    : v.toLocaleString('en-US', { style:'currency', currency:'USD' });

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, symbol: string) => {
    if (!editable) return;
    e.dataTransfer.setData('text/plain', symbol);
  };
  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetSymbol: string) => {
    if (!editable || !onReorder) return;
    e.preventDefault();
    const sourceSymbol = e.dataTransfer.getData('text/plain');
    if (!sourceSymbol || sourceSymbol === targetSymbol) return;
    const symbols = rows.map(r => r.symbol);
    const src = symbols.indexOf(sourceSymbol);
    const dst = symbols.indexOf(targetSymbol);
    if (src === -1 || dst === -1) return;
    const newOrder = symbols.slice();
    const [moved] = newOrder.splice(src, 1);
    newOrder.splice(dst, 0, moved);
    onReorder(newOrder);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Ativo</th>
          <th>CFOP</th>
          <th>Qtd</th>
          <th>Preço</th>
          <th>Valor</th>
          <th>Rank CMC</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => (
          <tr key={r.symbol}
              className={editable ? 'draggable' : ''}
              draggable={editable}
              onDragStart={(e) => handleDragStart(e, r.symbol)}
              onDragOver={(e) => editable ? e.preventDefault() : undefined}
              onDrop={(e) => handleDrop(e, r.symbol)}>
            <td style={{opacity:.7}}>{idx+1}</td>
            <td style={{fontWeight:700}}>{r.symbol}</td>
            <td>
              {editable ? (
                <select className="cfop" value={cfopOverrides[r.symbol] ?? r.cfop}
                        onChange={(e) => onCfopChange && onCfopChange(r.symbol, e.target.value as any)}>
                  <option value="C">C · Consolidada</option>
                  <option value="F">F · Forte</option>
                  <option value="O">O · Otimista</option>
                  <option value="P">P · Pump</option>
                </select>
              ) : (
                <CFOPBadge value={r.cfop} />
              )}
            </td>
            <td>{r.amount.toLocaleString('pt-BR')}</td>
            <td>{money(currency === 'BRL' ? r.priceBRL : r.priceUSD)}</td>
            <td>{money(currency === 'BRL' ? r.valueBRL : r.valueUSD)}</td>
            <td>{r.cmc_rank ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
