export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return <nav className="pagination" aria-label="Pagination"><button type="button" onClick={() => onPage(page - 1)} disabled={page === 1}>← Previous</button><span>Page {page} / {totalPages}</span><button type="button" onClick={() => onPage(page + 1)} disabled={page === totalPages}>Next →</button></nav>;
}
