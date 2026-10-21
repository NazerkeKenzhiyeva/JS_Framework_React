export default function FilterBar({ filters, genres, onChange, onReset }) {
  function change(event) { onChange({ ...filters, [event.target.name]: event.target.value, page: 1 }); }
  return (
    <div className="filter-bar" aria-label="Movie filters">
      <label className="search-field"><span>Search</span><input name="search" value={filters.search} onChange={change} placeholder="Title or keyword..." /></label>
      <label><span>Type</span><select name="type" value={filters.type} onChange={change}><option value="all">All types</option><option>Movie</option><option>Series</option></select></label>
      <label><span>Genre</span><select name="genre" value={filters.genre} onChange={change}><option value="all">All genres</option>{genres.map((genre) => <option key={genre}>{genre}</option>)}</select></label>
      <label><span>Status</span><select name="status" value={filters.status} onChange={change}><option value="all">All statuses</option><option>Watchlist</option><option>Watching</option><option>Watched</option></select></label>
      <label><span>Sort by</span><select name="sort" value={filters.sort} onChange={change}><option value="popular">Popularity</option><option value="rating">Rating</option><option value="year">Newest year</option><option value="title">Title A–Z</option></select></label>
      <button className="reset-button" type="button" onClick={onReset}>Reset</button>
    </div>
  );
}
