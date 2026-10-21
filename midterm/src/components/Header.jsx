export default function Header({ count, onAdd }) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="aftercredits home">AC<span>—001</span></a>
      <nav aria-label="Main navigation"><a href="#diary">Diary</a><a href="#collection">Index</a><a href="#top">Top</a></nav>
      <div className="header-actions"><span>{String(count).padStart(3, "0")} entries</span><button type="button" onClick={onAdd}>Add +</button></div>
    </header>
  );
}
