# Delivery Dashboard

A static HTML dashboard (`index.html`) with realtime, shared storage via a
Netlify Function backed by [Netlify Blobs](https://docs.netlify.com/blobs/overview/).
No database or backend to provision — Blobs comes with every Netlify site.

## How storage works

- `netlify/functions/data.mjs` is a small serverless function with two
  endpoints, both at `/.netlify/functions/data`:
  - `GET` → returns the current saved state (`{ projects, updatedAt }`)
  - `POST` → saves a new state and stamps it with the current time
- The dashboard loads its data from that function on page load, pushes an
  update after every edit (debounced ~600ms), and polls every 4 seconds so
  any other open browser picks up changes automatically. This gives
  near-real-time sync across everyone viewing the dashboard, without anyone
  needing to export or import a file.
- The "Load .xlsx workbook" / "Export updated workbook" buttons still work,
  for bulk imports or as an offline backup — importing a workbook also pushes
  the result to the shared store so it propagates to everyone else.

## Deploy on Netlify (via GitHub)

1. Push the contents of this folder to a GitHub repo (root of the repo should
   contain `index.html`, `netlify.toml`, `package.json`, and `netlify/`).
2. In Netlify: **Add new site → Import an existing project → GitHub**, pick
   the repo.
3. Build settings:
   - **Build command:** (leave blank — there's nothing to build)
   - **Publish directory:** `.`
   - Netlify auto-detects `netlify/functions` from `netlify.toml`.
4. Deploy. Netlify Blobs works out of the box on deployed sites — no extra
   setup, environment variables, or credentials needed.

## Local preview / testing the function

Netlify Blobs also works locally through the Netlify CLI:

```
npm install
npx netlify dev
```

This serves `index.html` and runs the function locally, backed by a local
Blobs emulator, so you can test the full realtime flow before deploying.

## Notes

- Storage is last-write-wins: if two people edit the exact same field within
  the same ~4-second poll window, whichever save lands last on the server
  wins. For a small internal dashboard this is a reasonable tradeoff; it's
  not built for heavy concurrent editing.
- The dashboard skips applying an incoming update while you're actively
  focused in a field, so a poll never overwrites keystrokes mid-edit.
