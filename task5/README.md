# streetALA — Task 5: Routes

A routed React application for a custom sneaker studio.

## Routes

- `/` — Home
- `/about` — About the project
- `/sneakers` — searchable, filterable and paginated catalog
- `/sneakers/:id` — dynamic sneaker details and CRUD actions
- `/dashboard` — API-based statistics and breakdowns
- `/login` — authentication placeholder
- `*` — custom 404 page

## Requirements covered

- React Router with a nested `RootLayout`, `NavBar` and `Outlet`
- search, two filters, sorting and pagination synchronized with URL parameters
- dynamic details route with `useParams`
- loading, error, empty, missing-item and stale-request handling
- create, edit, status update and delete operations through the fake API service
- dashboard with five statistics, two breakdowns and an interactive status filter
- five lazy-loaded pages with `React.lazy` and `Suspense`
- responsive styling and SPA navigation without full page reloads

## Run locally

```bash
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if script execution is restricted:

```powershell
npm.cmd install
npm.cmd run dev
```

## Build

```powershell
npm.cmd run lint
npm.cmd run build
```

The included `public/_redirects` file enables direct URL refreshes when deployed to Netlify.
