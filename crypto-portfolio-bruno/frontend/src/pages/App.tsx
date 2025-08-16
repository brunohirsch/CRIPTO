import { useEffect, useMemo, useState } from 'react';
import { api, getSettings, saveCfop, saveOrder } from '../lib/api';
import { classifyCFOP } from '../lib/cfop';
import PortfolioTable from '../components/PortfolioTable';
import PieChart from '../components/PieChart';
import CurrencyToggle from '../components/CurrencyToggle';
import CmcWidgets from '../components/Widgets';
import Toolbar from '../components/Toolbar';

type Row = {
  symbol: string;
  amount: number;
  priceUSD: number;
  priceBRL: number;
  valueUSD: number;
  valueBRL: number;
  cmc_rank: number | null;
  cfop: 'C'|'F'|'O'|'P';
}

export default function App() {
  const [data, setData] = useState<{totalUSD:number; totalBRL:number; breakdown: Row[]; settings?: any}>({ totalUSD: 0, totalBRL: 0, breakdown: [] });
  const [currency, setCurrency] = useState<'USD'|'BRL'>('BRL');
  const [editing, setEditing] = useState(false);
  const [cfopOverrides, setCfopOverrides] = useState<Record<string,'C'|'F'|'O'|'P'>>({});
  const [rowOrder, setRowOrder] = useState<string[]>([]);

  async function load() {
    const [portfolio, settings] = await Promise.all([
      api.get('/portfolio').then(r => r.data),
      getSettings()
    ]);
    setData(portfolio);
    setCfopOverrides(settings.cfopOverrides || {});
    setRowOrder(settings.rowOrder || []);
  }

  useEffect(() => { load().catch(console.error); }, []);

  const total = currency === 'BRL' ? data.totalBRL : data.totalUSD;

  // Aplica ordem customizada enquanto edita (se houver)
  const rows = useMemo(() => {
    const items = [...data.breakdown];
    if (editing && rowOrder.length > 0) {
      const idx: Record<string, number> = {};
      rowOrder.forEach((s, i) => idx[s] = i);
      items.sort((a,b) => (idx[a.symbol] ?? 1e9) - (idx[b.symbol] ?? 1e9));
    }
    // aplica cfop overrides no front também p/ pré-visualização instantânea
    return items.map(r => ({
      ...r,
      cfop: classifyCFOP(r.symbol, r.cmc_rank, cfopOverrides)
    }));
  }, [data, editing, rowOrder, cfopOverrides]);

  const pie = useMemo(() => {
    const items = rows.slice(0, 12);
    return {
      labels: items.map(i => i.symbol),
      values: items.map(i => currency === 'BRL' ? i.valueBRL : i.valueUSD)
    }
  }, [rows, currency]);

  const handleReorder = (order: string[]) => setRowOrder(order);
  const handleCfopChange = (symbol: string, v: 'C'|'F'|'O'|'P') => {
    setCfopOverrides(prev => ({ ...prev, [symbol]: v }));
  };

  const persistChanges = async () => {
    await Promise.all([
      saveCfop(cfopOverrides),
      saveOrder(rowOrder)
    ]);
    // recarrega do backend para pegar ordem aplicada pela API
    await load();
    setEditing(false);
  };

  return (
    <>
      <Toolbar onToggleEdit={() => setEditing(e => !e)} editing={editing} />
      <div className="container">
        <div className="row">
          <div className="card grow">
            <div className="title">Valor total da carteira</div>
            <div style={{fontSize:32, fontWeight:900}}>
              {currency === 'BRL' ?
                total.toLocaleString('pt-BR', { style:'currency', currency:'BRL' }) :
                total.toLocaleString('en-US', { style:'currency', currency:'USD' })
              }
            </div>
            <div style={{marginTop:8, display:'flex', gap:8}}>
              <CurrencyToggle value={currency} onChange={setCurrency} />
              {editing && (
                <button className="btn-primary" onClick={persistChanges} style={{marginLeft:'auto'}}>Salvar mudanças</button>
              )}
            </div>
            <p className="muted" style={{marginTop:8}}>Arraste as linhas para reordenar. Altere CFOP nas listas suspensas. Clique em “Salvar mudanças”.</p>
          </div>
          <div className="card grow">
            <div className="title">Distribuição do portfólio</div>
            <PieChart labels={pie.labels} values={pie.values} />
          </div>
        </div>

        <div className="card" style={{marginTop:16}}>
          <div className="title">Holdings</div>
          <PortfolioTable
            rows={rows}
            currency={currency}
            editable={editing}
            cfopOverrides={cfopOverrides}
            onCfopChange={handleCfopChange}
            onReorder={handleReorder}
          />
        </div>

        <div className="card" style={{marginTop:16}}>
          <div className="title">Widgets CoinMarketCap</div>
          <CmcWidgets />
        </div>
      </div>
    </>
  )
}
