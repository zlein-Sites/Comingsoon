# Delivery Dashboard

A static, single-page HTML dashboard (no build step required).

## Deploy on Netlify (via GitHub)

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project → GitHub** and pick this repo.
3. Build settings:
   - **Build command:** (leave blank)
   - **Publish directory:** `.`
4. Deploy. Netlify will serve `index.html` at your site's root URL.

## Local preview

Just open `index.html` directly in a browser, or run a simple local server:

```
npx serve .
```

## Notes

- This app runs entirely client-side — nothing is saved to a server. Use the
  in-app "Export updated workbook" button to save your edits as a new `.xlsx`
  file, and share that file so others can load your changes.
