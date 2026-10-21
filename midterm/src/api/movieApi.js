const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p";

const genreNames = {
  12: "Adventure", 14: "Fantasy", 16: "Animation", 18: "Drama", 27: "Horror",
  28: "Action", 35: "Comedy", 36: "History", 37: "Western", 53: "Thriller",
  80: "Crime", 99: "Documentary", 878: "Sci-Fi", 9648: "Mystery",
  10402: "Music", 10749: "Romance", 10751: "Family", 10752: "War",
  10759: "Action & Adventure", 10762: "Kids", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10768: "War & Politics",
};

function normalize(item, index) {
  const type = item.media_type === "tv" ? "Series" : "Movie";
  const date = item.release_date || item.first_air_date || "";
  return {
    id: `${item.media_type}-${item.id}`,
    title: item.title || item.name || "Untitled",
    description: item.overview || "No synopsis is available for this title yet.",
    type,
    year: date ? date.slice(0, 4) : "—",
    genres: (item.genre_ids || []).map((id) => genreNames[id]).filter(Boolean),
    rating: Number(item.vote_average || 0).toFixed(1),
    status: ["Watched", "Watchlist", "Watching"][index % 3],
    poster: item.poster_path ? `${IMAGE_URL}/w500${item.poster_path}` : "",
    backdrop: item.backdrop_path ? `${IMAGE_URL}/w1280${item.backdrop_path}` : "",
    popularity: item.popularity || 0,
  };
}

export async function fetchTrending({ signal } = {}) {
  const token = import.meta.env.VITE_TMDB_TOKEN?.trim();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY?.trim();
  if (!token && !apiKey) throw new Error("TMDB_KEY_MISSING");

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const requests = [
    ["movie", 1], ["movie", 2], ["movie", 3],
    ["tv", 1], ["tv", 2],
  ];
  const pages = await Promise.all(requests.map(async ([mediaType, page]) => {
    const params = new URLSearchParams({ language: "en-US", page: String(page) });
    if (apiKey) params.set("api_key", apiKey);
    const response = await fetch(`${API_URL}/trending/${mediaType}/week?${params}`, { headers, signal });
    if (!response.ok) throw new Error(`TMDB request failed (${response.status})`);
    const data = await response.json();
    return (data.results || []).map((item) => ({ ...item, media_type: mediaType }));
  }));

  return pages.flat().slice(0, 100).map(normalize);
}
