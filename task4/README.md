# streetALA — React Effects Homework

A custom sneaker archive built to practise asynchronous React effects with the provided fake API.

## Features

- asynchronous list loading with `useEffect`
- separately loaded sneaker details
- create, edit, delete and status update actions
- loading, error, empty and success states
- reload button
- effect cleanup that prevents outdated responses from updating the UI
- conflict protection while mutations are running
- responsive interface

Only `useState` and `useEffect` are used. React components never access `localStorage` directly.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
