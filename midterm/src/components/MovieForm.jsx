import { useState } from "react";

const emptyMovie = { title: "", type: "Movie", year: "2026", genre: "Drama", rating: "", status: "Watchlist", description: "", poster: "" };

export default function MovieForm({ movie, onCancel, onSave }) {
  const [form, setForm] = useState(movie ? { ...emptyMovie, ...movie, genre: movie.genres?.[0] || "Drama" } : emptyMovie);
  function change(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); }
  function submit(event) { event.preventDefault(); onSave({ ...form, genres: [form.genre], rating: Number(form.rating || 0).toFixed(1) }); }
  return (
    <div className="form-backdrop">
      <section className="entry-modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-heading"><div><p className="kicker">Diary entry</p><h2 id="form-title">{movie ? "Edit title" : "Add a title"}</h2></div><button type="button" onClick={onCancel}>×</button></div>
        <form onSubmit={submit}>
          <label className="wide">Title<input name="title" value={form.title} onChange={change} required /></label>
          <label>Type<select name="type" value={form.type} onChange={change}><option>Movie</option><option>Series</option></select></label>
          <label>Year<input type="number" name="year" min="1888" max="2035" value={form.year} onChange={change} required /></label>
          <label>Genre<input name="genre" value={form.genre} onChange={change} required /></label>
          <label>Your rating<input type="number" name="rating" min="0" max="10" step="0.1" value={form.rating} onChange={change} /></label>
          <label className="wide">Status<select name="status" value={form.status} onChange={change}><option>Watchlist</option><option>Watching</option><option>Watched</option></select></label>
          <label className="wide">Poster URL<input type="url" name="poster" value={form.poster} onChange={change} placeholder="https://..." /></label>
          <label className="wide">Notes<textarea name="description" rows="4" value={form.description} onChange={change} required /></label>
          <div className="form-actions wide"><button type="button" onClick={onCancel}>Cancel</button><button className="primary" type="submit">Save entry</button></div>
        </form>
      </section>
    </div>
  );
}
