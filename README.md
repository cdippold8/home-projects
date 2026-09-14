# Home Projects

A mobile-first, installable to-do list for home projects: a Monday–Friday
weekly schedule plus a full task list grouped by size, with materials
lists, tap-to-check-off tasks, and a progress bar. Checkmarks persist
between visits via `localStorage`, and the app works offline once
installed (Add to Home Screen).

## Structure

- `data.js` — the task list (`TASKS`), size categories (`CATEGORIES`), and
  the weekly schedule (`SCHEDULE`). This is the single source of truth;
  both views render from it, and schedule entries reference task IDs so a
  task's checked state is shared everywhere it appears.
- `index.html` / `style.css` / `app.js` — the app itself (no build step).
- `manifest.json` / `sw.js` / `icons/` — PWA install support and offline
  caching.

## Running locally

Any static file server works, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`. On a phone, open the same URL and use
"Add to Home Screen" (iOS Safari) or the install prompt (Android Chrome)
to install it as an app.

## Editing the task list

Add or edit tasks in `data.js`. Every schedule entry's `taskId` must match
a task `id` in `TASKS` — the app has no build step, so changes take effect
on refresh.
