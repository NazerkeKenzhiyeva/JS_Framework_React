export default function MovieCard({ movie, active, onSelect }) {
  return (
    <button className={`movie-card ${active ? "active" : ""}`} type="button" onClick={() => onSelect(movie.id)}>
      <span className="poster-wrap">{movie.poster ? <img src={movie.poster} alt={`${movie.title} poster`} /> : <span className="poster-fallback">{movie.title}</span>}<b>{movie.rating}</b></span>
      <strong>{movie.title}</strong><small>{movie.year} · {movie.type}</small>
    </button>
  );
}
