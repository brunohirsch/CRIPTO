import LogoBH from './LogoBH';

export default function Toolbar({ onToggleEdit, editing }: { onToggleEdit: ()=>void; editing: boolean }) {
  return (
    <header className="toolbar">
      <a className="brand" href="/">
        <LogoBH size={28} />
        <span>BRUNO HIRSCH · CRIPTOMOEDAS</span>
      </a>
      <div className="spacer" />
      <button className="btn" onClick={onToggleEdit} aria-pressed={editing}>
        {editing ? 'Sair do modo edição' : 'Editar CFOP & Ordem'}
      </button>
    </header>
  );
}
