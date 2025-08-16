export default function CurrencyToggle({ value, onChange }: { value: 'USD'|'BRL', onChange: (v:any)=>void }) {
  return (
    <div role="group" aria-label="Selecione a moeda">
      <button className="btn" onClick={() => onChange('BRL')} aria-pressed={value==='BRL'}>BRL</button>{' '}
      <button className="btn" onClick={() => onChange('USD')} aria-pressed={value==='USD'}>USD</button>
    </div>
  );
}
