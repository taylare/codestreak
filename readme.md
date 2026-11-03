# CodeStreak

An installable web app that teaches C# and C++ with one daily challenge, from beginner to advanced. Wrong answers give a specific tip. Works offline once loaded. No build step and no dependencies.
[found at:](https://taylare.github.io/codestreak/)

## Deploy to GitHub Pages
1. Create a repo and push these files to the `main` branch (repo root).
2. Repo Settings > Pages > Source: "Deploy from a branch" > `main` / `/ (root)`.
3. Open `https://<user>.github.io/<repo>/` after a minute or two.

## Install on your phone
- Android (Chrome): menu > Install app.
- iPhone (Safari): Share > Add to Home Screen.

## Run locally
Service workers need http, not `file://`:

```
npx serve .
```

## Adding challenges
Add an object to `lessons.js` (the format is described in the comment at the top of that file). Then bump `VERSION` in `sw.js` so installed copies refresh.

## Files
- `index.html`, `styles.css`, `app.js`: the app shell, styles and logic.
- `lessons.js`: all challenge content.
- `sw.js`, `manifest.webmanifest`, `icons/`: offline support and install metadata.
