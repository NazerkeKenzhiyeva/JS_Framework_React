import { useEffect, useMemo, useState } from "react";
import { fetchTrending } from "./api/movieApi.js";
import FilterBar from "./components/FilterBar.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import MovieCard from "./components/MovieCard.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import MovieForm from "./components/MovieForm.jsx";
import Pagination from "./components/Pagination.jsx";
import StatePanel from "./components/StatePanel.jsx";

const CUSTOM_KEY = "aftercredits-custom-v1";
const OVERRIDES_KEY = "aftercredits-overrides-v1";
const HIDDEN_KEY = "aftercredits-hidden-v1";
const pageSize = 10;
const initialFilters = { search: "", type: "all", genre: "all", status: "all", sort: "popular", page: 1 };

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loadState, setLoadState] = useState("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [formMovie, setFormMovie] = useState(undefined);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    async function loadMovies() {
      setLoadState("loading");
      try {
        const remote = await fetchTrending({ signal: controller.signal });
        if (!current) return;
        const overrides = readStorage(OVERRIDES_KEY, {});
        const hidden = readStorage(HIDDEN_KEY, []);
        const custom = readStorage(CUSTOM_KEY, []);
        setMovies([...custom, ...remote.filter((movie) => !hidden.includes(movie.id)).map((movie) => ({ ...movie, ...overrides[movie.id] }))]);
        setLoadState("success");
      } catch (error) {
        if (!current || error.name === "AbortError") return;
        setLoadState(error.message === "TMDB_KEY_MISSING" ? "config" : "error");
      }
    }
    loadMovies();
    return () => { current = false; controller.abort(); };
  }, [reloadKey]);

  const genres = useMemo(() => [...new Set(movies.flatMap((movie) => movie.genres))].sort(), [movies]);
  const filteredMovies = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return movies.filter((movie) => !search || `${movie.title} ${movie.description}`.toLowerCase().includes(search))
      .filter((movie) => filters.type === "all" || movie.type === filters.type)
      .filter((movie) => filters.genre === "all" || movie.genres.includes(filters.genre))
      .filter((movie) => filters.status === "all" || movie.status === filters.status)
      .sort((a, b) => {
        if (filters.sort === "rating") return Number(b.rating) - Number(a.rating);
        if (filters.sort === "year") return Number(b.year) - Number(a.year);
        if (filters.sort === "title") return a.title.localeCompare(b.title);
        return b.popularity - a.popularity;
      });
  }, [movies, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / pageSize));
  const page = Math.min(filters.page, totalPages);
  const visibleMovies = filteredMovies.slice((page - 1) * pageSize, page * pageSize);
  const selectedMovie = movies.find((movie) => movie.id === selectedId) || null;
  const watched = movies.filter((movie) => movie.status === "Watched").length;
  const average = movies.length ? (movies.reduce((sum, movie) => sum + Number(movie.rating || 0), 0) / movies.length).toFixed(1) : "0.0";

  function updateMovie(id, changes) {
    setMovies((current) => current.map((movie) => movie.id === id ? { ...movie, ...changes } : movie));
    const movie = movies.find((item) => item.id === id);
    if (movie?.custom) {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(readStorage(CUSTOM_KEY, []).map((item) => item.id === id ? { ...item, ...changes } : item)));
    } else {
      const overrides = readStorage(OVERRIDES_KEY, {});
      overrides[id] = { ...(overrides[id] || {}), ...changes };
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
    }
  }

  function saveMovie(values) {
    if (formMovie) {
      updateMovie(formMovie.id, values);
      setNotice(`“${values.title}” was updated.`);
    } else {
      const movie = { ...values, id: `custom-${Date.now()}`, custom: true, backdrop: "", popularity: Date.now() };
      localStorage.setItem(CUSTOM_KEY, JSON.stringify([movie, ...readStorage(CUSTOM_KEY, [])]));
      setMovies((current) => [movie, ...current]);
      setNotice(`“${movie.title}” was added to your diary.`);
    }
    setFormMovie(undefined);
  }

  function removeMovie(id) {
    const movie = movies.find((item) => item.id === id);
    if (!movie) return;
    if (movie.custom) localStorage.setItem(CUSTOM_KEY, JSON.stringify(readStorage(CUSTOM_KEY, []).filter((item) => item.id !== id)));
    else localStorage.setItem(HIDDEN_KEY, JSON.stringify([...new Set([...readStorage(HIDDEN_KEY, []), id])]));
    setMovies((current) => current.filter((item) => item.id !== id));
    setSelectedId(null);
    setNotice(`“${movie.title}” was removed from the diary.`);
  }

  return (
    <main>
      <Header count={movies.length} onAdd={() => setFormMovie(null)} />
      <Hero />
      <section className="diary-intro" id="diary">
        <div className="diary-heading">
          <p className="section-number">01 / YOUR VIEWING ROOM</p>
          <h2>Watch.<br />Rate. Remember.</h2>
          <p>Build a personal record of the films you finished, the series you paused and everything still waiting for movie night.</p>
        </div>
        <div className="room-scene">
          <div className="room-red-block" />
          <img className="room-sofa" src="images/aftercredits/sofa.jpg" alt="Cream sofa" />
          <img className="room-tv" src="images/aftercredits/television.jpg" alt="Vintage television" />
          <img className="room-popcorn" src="images/aftercredits/popcorn.jpg" alt="Popcorn" />
          <span>MOVIE NIGHT / 20:00</span>
        </div>
        <div className="stats"><span><b>{watched}</b> watched</span><span><b>{average}</b> mean score</span><span><b>{movies.length}</b> in archive</span></div>
      </section>
      <section className="collection" id="collection">
        <div className="collection-heading"><div><p className="section-number">02 / THE INDEX</p><h2>Current rotation</h2></div><p>One hundred moving images. Filter the noise, keep what stays.</p></div>
        <FilterBar filters={filters} genres={genres} onChange={setFilters} onReset={() => setFilters(initialFilters)} />
        {notice && <div className="notice" role="status">{notice}<button type="button" onClick={() => setNotice("")}>×</button></div>}
        {loadState !== "success" ? <StatePanel type={loadState} onRetry={loadState === "error" ? () => setReloadKey((key) => key + 1) : null} /> : visibleMovies.length === 0 ? <StatePanel type="empty" /> : <div className="movie-grid">{visibleMovies.map((movie) => <MovieCard key={movie.id} movie={movie} active={selectedId === movie.id} onSelect={setSelectedId} />)}</div>}
        {loadState === "success" && <Pagination page={page} totalPages={totalPages} onPage={(nextPage) => setFilters((current) => ({ ...current, page: nextPage }))} />}
      </section>
      <footer><a className="brand" href="#top">AC—001</a><p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p><span>AFTERCREDITS / 2026</span></footer>
      {selectedMovie && <MovieDetails movie={selectedMovie} onClose={() => setSelectedId(null)} onStatus={(id, status) => updateMovie(id, { status })} onEdit={(movie) => { setSelectedId(null); setFormMovie(movie); }} onDelete={removeMovie} />}
      {formMovie !== undefined && <MovieForm movie={formMovie} onCancel={() => setFormMovie(undefined)} onSave={saveMovie} />}
    </main>
  );
}
