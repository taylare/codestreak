# CodeStreak

An installable web app that teaches C# and C++ with one daily challenge, from beginner to advanced. Wrong answers give a specific tip. Works offline once loaded. No build step and no dependencies.

Live: [https://taylare.github.io/codestreak/](https://taylare.github.io/codestreak/)

## What's in it
- **Today:** one daily challenge per language, your streak and XP, and progress by level.
- **Path:** over 90 challenges per language, ordered beginner, intermediate, advanced. Multiple choice or type the answer. Every wrong answer gets a specific tip, and every correct one unlocks a trick. The path is a full course, not just syntax:
  - **Project setup first:** how each language runs, what every file extension means (`.cpp` `.h` `.o` `.cs` `.csproj` `.sln` `.dll` and more), the build pipeline, project layout, and separation of concerns.
  - **Language basics:** I/O, identifiers, keywords, variables, data types, operators, conditionals, loops, functions, arrays and strings.
  - **Memory and types:** pointers and references (C++), `ref` and the garbage collector (C#), structs, unions, enums, aliases, dynamic memory.
  - **Object-oriented programming:** classes, constructors, encapsulation, inheritance, polymorphism, abstraction.
  - **Libraries and patterns:** templates and the STL (C++), generics, collections and LINQ (C#), exceptions, files and streams, lambdas and callbacks, namespaces, the preprocessor.
  - **Advanced:** smart pointers, move semantics, RAII, multithreading (threads, mutexes, race conditions, synchronisation), signal handling, dependency injection, NuGet and CMake libraries, and test projects.
- **Build:** a guided project per language. Finish the lessons a step uses to unlock it, then type the code yourself. A checker explains each mistake, and a simulated console runs your program. Each step explains what the code did, how it works and why the output looks the way it does.
  - C#: Dungeon Dash (a small dungeon crawler)
  - C++: Space Trader (a cargo ship trading game)
- **Tips:** the tricks you've unlocked, your recent mistakes, and **Save and sync** (see below).

Progress is stored in the browser (`localStorage`) on each device. Nothing is sent anywhere.

## Using more than one device
Open **Tips > Save and sync**. Tap **Create save token** and copy it. On your other device, paste it into the same box and choose:
- **Merge into this device** (the safe choice): keeps the lessons and project steps from both devices. Where both finished a lesson, the earlier completion is kept. The streak with the more recent activity wins. XP is estimated as the union of both (it cannot simply be added, or shared lessons would count twice).
- **Replace this device**: makes this device match the token exactly.

A token is a snapshot of your progress packed into text (about 1 to 2 thousand characters). It is not a login and it does not sync by itself, so make a fresh one when you want to carry newer progress across. It holds only lesson ids, dates, XP and project steps, no personal data, but anyone who has it can load your progress. Pasted tokens are strictly validated before use.

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
Add an object to `js/lessons.js` (the format is described in the comment at the top of that file). The **position in the file** is the learning path, not the id number, so put a new challenge where it belongs and keep each language's levels in order (beginner, intermediate, advanced). Never change an existing `id`: saved progress and project unlock rules refer to it. Then bump `VERSION` in `sw.js` so installed copies refresh.

## Adding project steps
Projects live in `js/projects.js`. A step has a `title`, an `explain` blurb and the new console `out` lines. The program text is built from `parts` (code inside `main` or top-level), plus `head` for C++ includes and functions. Each part lists versions by the step that introduced them. Per step, also write: the "how it works" and "why that output" notes in `js/project-docs.js`; the task text, hint and the lessons that unlock it (`needs`) in `js/project-tasks.js`. All three files list steps in the same order, and each code box in a step needs one task line. Check the output by hand or by compiling the final program.

## Files
- `index.html`, `styles.css`: the app shell and styles.
- `js/app.js`: the app logic (views, answer checking, progress, syntax highlighting).
- `js/lessons.js`: all challenge content.
- `js/projects.js`, `js/project-docs.js`, `js/project-tasks.js`: the Build projects, their walkthroughs, and the tasks and unlock rules.
- `js/checker.js`: checks the code you type in Build against the expected code and explains mismatches.
- `js/sync.js`: the save token (build, validate and merge progress between devices).
- `sw.js`, `manifest.webmanifest`, `icons/`: offline support and install metadata.
- `.nojekyll`: stops GitHub Pages from processing the site.
