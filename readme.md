# CodeStreak

An installable web app that teaches C# and C++ with one daily challenge, from beginner to advanced. Wrong answers give a specific tip. Works offline once loaded. No build step and no dependencies.

Live: [https://taylare.github.io/codestreak/](https://taylare.github.io/codestreak/)

## What's in it
- **Today:** one daily challenge per language, your streak and XP, and progress by level.
- **Path:** 15 challenges per language, ordered beginner, intermediate, advanced. Multiple choice or type the answer. Every wrong answer gets a specific tip, and every correct one unlocks a trick.
- **Build:** a guided project per language. Finish a challenge to unlock the next step, add it to the program, and watch a simulated console run it. Each step explains what the code did, how it works and why the output looks the way it does.
  - C#: Dungeon Dash (a small dungeon crawler)
  - C++: Space Trader (a cargo ship trading game)
- **Tips:** the tricks you've unlocked and your recent mistakes.

Progress is stored in the browser (`localStorage`) on each device. Nothing is sent anywhere.

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
Add an object to `js/lessons.js` (the format is described in the comment at the top of that file). Then bump `VERSION` in `sw.js` so installed copies refresh.

## Adding project steps
Projects live in `js/projects.js`. A step has a `title`, an `explain` blurb, the `needs` challenge id that unlocks it, and the new console `out` lines. The program text is built from `parts` (code inside `main` or top-level), plus `head` for C++ includes and functions. Each part lists versions by the step that introduced them. Write the matching "how it works" and "why that output" in `js/project-docs.js`, in the same order. Check the output by hand or by compiling the final program.

## Files
- `index.html`, `styles.css`: the app shell and styles.
- `js/app.js`: the app logic (views, answer checking, progress, syntax highlighting).
- `js/lessons.js`: all challenge content.
- `js/projects.js` and `js/project-docs.js`: the Build projects and their walkthroughs.
- `sw.js`, `manifest.webmanifest`, `icons/`: offline support and install metadata.
- `.nojekyll`: stops GitHub Pages from processing the site.
