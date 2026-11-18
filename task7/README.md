# streetALA - Task 7: Progressive Web App

Task 7 converts the complete Task 6 React application into an installable, offline-capable PWA. Authentication, protected routes, URL filters, pagination, dashboard statistics, TanStack Query caching and sneaker CRUD remain available.

## PWA features

- valid `/manifest.json` linked from `index.html`
- installable standalone application with 192x192 and 512x512 icons
- custom Workbox service worker with install, activate and fetch handling
- precached application shell, built JS/CSS, icons, images and offline page
- versioned runtime caches and automatic removal of old cache versions
- user-facing update notification with an **Update now** button
- dedicated React `/offline` route plus a static offline fallback
- live online/offline indicator and **Retry connection** button
- responsive mobile navigation and layouts from 320px

## Runtime caching strategy

The custom service worker is in `src/sw.js`.

1. **Cache-first** is used for images, icons and fonts. These files are served from cache immediately because they change rarely. The cache is limited to 60 entries and expires entries after 30 days.
2. **Stale-while-revalidate** is used for public `/api/` catalog list and detail requests. Previously fetched public data is shown from cache while a fresh network response updates the cache. The cache is limited to 50 entries and one day.
3. **Network-first** is used for page navigation. The newest page is preferred, while previously visited pages remain accessible offline. Navigation cache is limited to 30 entries and seven days.

After catalog create, update or delete operations, TanStack Query still invalidates the `['sneakers']` query key. Authentication requests, Firebase responses, tokens and private user data are not matched by any service-worker runtime cache route.

## Public API resource

`public/api/sneakers.json` is the public catalog resource used by list and detail requests. The UI service keeps CRUD changes in browser storage, while the public GET requests allow the service worker to demonstrate offline runtime API caching.

## Firebase environment

Copy `.env.example` to `.env.local` and add the Firebase Web configuration values. `.env.local` is ignored by Git. Add the same six `VITE_FIREBASE_*` variables to the deployment environment.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

For the closest production PWA test:

```powershell
npm.cmd run build
npm.cmd run preview
```

Then use browser DevTools **Application** and **Network > Offline** to verify the manifest, service worker, cache entries and offline fallback.

## Validation

```powershell
npm.cmd run lint
npm.cmd run build
```

## Routes

- `/` - Home
- `/sneakers` - cached public catalog, filters and pagination
- `/sneakers/:id` - cached public details and CRUD
- `/dashboard` - statistics
- `/about` - studio information
- `/login` and `/signup` - Firebase Authentication
- `/profile` - protected profile
- `/offline` - dedicated connectivity page
- `*` - custom 404
