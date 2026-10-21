export default function MovieDetails({ movie, onClose, onStatus, onEdit, onDelete }) {
  if (!movie) return null;
  return (
    <div className="detail-backdrop" role="presentation" onMouseDown={onClose}>
      <article className="movie-detail" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="close-button" type="button" onClick={onClose} aria-label="Close details">×</button>
        <div className="detail-art" style={movie.backdrop ? { backgroundImage: `url(${movie.backdrop})` } : undefined}>{movie.poster && <img src={movie.poster} alt={`${movie.title} poster`} />}</div>
        <div className="detail-content">
          <p className="kicker">{movie.type} / {movie.year}</p><h2 id="detail-title">{movie.title}</h2>
          <div className="detail-meta"><span className="score">★ {movie.rating}</span><span>{movie.genres.join(" · ") || "Uncategorized"}</span></div>
          <p className="synopsis">{movie.description}</p>
          <div className="status-row">{["Watchlist", "Watching", "Watched"].map((status) => <button className={movie.status === status ? "selected" : ""} type="button" key={status} onClick={() => onStatus(movie.id, status)}>{status}</button>)}</div>
          <div className="detail-buttons"><button type="button" onClick={() => onEdit(movie)}>Edit entry</button><button className="delete" type="button" onClick={() => onDelete(movie.id)}>Remove</button></div>
        </div>
      </article>
    </div>
  );
}
