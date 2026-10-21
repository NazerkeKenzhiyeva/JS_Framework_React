# aftercredits — Movie Diary

A responsive personal movie and series diary powered by the TMDB API.

## Features

- 100 trending movies and series loaded from five TMDB pages
- search, genre/type/status filters, sorting and pagination
- poster gallery and detailed title view
- controlled form for creating and editing diary entries
- persistent watch statuses, custom entries and removals via `localStorage`
- loading, configuration, error, empty and success states
- `AbortController` cleanup for asynchronous effects
- responsive editorial interface with 9 reusable React components

## TMDB setup

Create an API credential in your TMDB account settings. Copy `.env.example` to `.env.local` and add either:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

or:

```env
VITE_TMDB_TOKEN=your_tmdb_read_access_token
```

Restart the development server after editing `.env.local`.

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm run lint
npm run build
```

This product uses the TMDB API but is not endorsed or certified by TMDB.
