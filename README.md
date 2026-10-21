# Crystal Guide

A personal, offline-capable reference app for the metaphysical and healing
properties of crystals. Built as an installable web app (PWA) so it runs from
the iPhone Home Screen with no Apple Developer account and works in airplane
mode.

## Develop

```bash
npm install
npm run dev        # local dev server
npm test           # unit + component tests
npm run typecheck
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Deploy (Vercel)

One time: `npx vercel login`.

```bash
npm run deploy     # tests, typecheck, then `vercel --prod` (Vercel builds with vercel.json)
```

The first deploy asks a few questions to link the folder to a Vercel project;
accept the defaults.

## Install on iPhone

1. Open the production URL in **Safari**.
2. Tap **Share** → **Add to Home Screen**.
3. Launch it once from the Home Screen while online so it caches everything.
   After that it works offline. New deploys show an "Updated — tap to reload"
   prompt the next time you open it online.

## Project layout

- `src/core/` – pure TypeScript: types, dataset, repository, search, filters.
  No DOM, so it carries over to a future Expo app unchanged.
- `src/hooks/` – React hooks and providers over `core` (also portable).
- `src/web/` – web-only screens, components, and styles.
- `src/core/repository.ts` – the only module that knows where data lives.
  Swap its internals for `fetch` calls when the API exists.

## Adding or editing a crystal

1. Edit `src/core/data/crystals.json`. Intentions, chakras, zodiac signs, and
   elements must come from `src/core/vocabulary.ts` (tests enforce this).
   Set `image.file` to `<slug>.webp` and leave the other image fields empty.
2. Find a photo on [Wikimedia Commons](https://commons.wikimedia.org) with a
   CC BY, CC BY-SA, CC0, or public-domain license and add
   `"<slug>": "File:<title>"` to `scripts/image-sources.json`.
3. `npm run images -- --only <slug>` downloads, resizes, and records the credit.
4. `npm test`.

Icons are generated from `public/icon.svg` with `npm run icons`.

Crystal properties reflect spiritual and traditional beliefs, not medical advice.
