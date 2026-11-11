# streetALA — Task 6: Authentication and Caching

This project extends Task 5. It keeps all routes, URL filters, pagination, dashboard statistics and sneaker CRUD operations, and adds Firebase Authentication and TanStack Query caching.

## Authentication

- Email/password sign up and login
- Google sign-in popup
- Firebase session persistence after refresh
- `AuthContext`, `AuthProvider` and `useAuth`
- Protected `/profile` route with the user's email and Firebase UID
- Conditional navigation: Login/Sign up or Profile/Log out
- Loading, validation and authentication error states

## Caching strategy

TanStack Query caches sneaker lists by the key `['sneakers', 'list', query]` and individual sneakers by `['sneakers', 'detail', id]`. Different filters and pages therefore receive separate cache entries. Data stays fresh for 60 seconds (`staleTime`) and unused entries remain in memory for 5 minutes (`gcTime`). Requests receive an `AbortSignal`, so a cancelled outdated request cannot overwrite the currently displayed query.

After every create, update, status change or delete mutation, all queries beginning with `['sneakers']` are invalidated. Active list/detail queries are then revalidated and display current data.

## Firebase setup

1. Create a project in [Firebase Console](https://console.firebase.google.com/).
2. Add a Web app.
3. In **Authentication → Sign-in method**, enable **Email/Password** and **Google**.
4. Copy `.env.example` to `.env.local`.
5. Replace every placeholder with the Firebase Web configuration values.
6. For deployment, add the same variables in the hosting provider settings.
7. Add the deployed domain in **Firebase Authentication → Settings → Authorized domains**.

`.env.local` is ignored by Git and must never be committed. `.env.example` contains names only, without secrets.

## Environment variables

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Routes

- `/` — Home
- `/about` — About
- `/sneakers` — cached catalog with URL filters and pagination
- `/sneakers/:id` — cached dynamic details and CRUD actions
- `/dashboard` — statistics based on cached API data
- `/login` — email/password and Google login
- `/signup` — registration with password confirmation
- `/profile` — protected user profile
- `*` — custom 404 page

## Run locally

```powershell
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

## Check before submission

```powershell
npm.cmd run lint
npm.cmd run build
```
