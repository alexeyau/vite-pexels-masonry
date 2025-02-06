# Masonry Grid with Pexels API (React + TypeScript + Vite)

This web app displays images by search query.

## How to run

```bash
npm i
npm run build
npm run preview
```

## Application's performance

- Reduced the number of requests to DOM (approximate calculations for virtualisation)
- Ignores most of the scroll triggering (every 10px and can be tuned)
- Lazy loading for additional images
- Lazy loading for additional pade
- Preconnect to Pexels
- Store data with context (no external lib like instead of redux/zustand) to reduce build size

