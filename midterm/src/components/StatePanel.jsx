export default function StatePanel({ type, onRetry }) {
  const copy = {
    loading: ["Loading the programme", "Fetching this week’s films and series from TMDB."],
    empty: ["Nothing in this screening", "Try changing or resetting the filters."],
    error: ["The projector stopped", "We couldn’t load the TMDB catalogue. Check the key and try again."],
    config: ["Connect the film archive", "Add VITE_TMDB_API_KEY or VITE_TMDB_TOKEN to .env.local, then restart the app."],
  }[type];
  return <div className={`state-panel ${type}`}><span>{type === "loading" ? "●" : "○"}</span><h3>{copy[0]}</h3><p>{copy[1]}</p>{onRetry && <button type="button" onClick={onRetry}>Try again</button>}</div>;
}
