# qw

**Extremely customizable. Still minimal.**

qw is a mobile-first browser shell with Apple-inspired liquid glass UI. Chromium-class rendering on device via Capacitor (Android System WebView / iOS WKWebView). The web app in this repo is the full chrome, customization system, onboarding, and start page — ready to wrap natively.

## What you get

- **Onboarding** — pick app icon, chrome layout, theme & accent before first browse
- **Chrome layouts**
  - Safari style (search top / controls bottom)
  - Unified bottom or top blob (Quiche-like)
  - Inverted / controls-top
  - Search-only & minimal floating
- **Liquid glass** — blur intensity, accents, light / dark / system
- **Start page** — wallpapers, favorites, suggestions, blank, or wallpaper-only
- **Settings** organized by section (Chrome, Appearance, Start, Loading, Behavior)
- **Full Customization Guide** — walks every option: icons → loaders → search engine
- **App icons** — auto (follows theme), light, dark, glass, mono

## Run (web preview)

```bash
npm install
npm run dev
```

Open the URL — on desktop you’ll see an iPhone-sized frame; on a phone it’s full-bleed.

```bash
npm run build
npm run preview
```

## Native (Capacitor)

```bash
npm run build
npx cap add ios      # requires macOS + Xcode
npx cap add android
npx cap sync
npx cap open ios | android
```

On Android, browsing uses the Chromium-based System WebView. On iOS, WKWebView.

## Scripts

| Command        | Purpose            |
|----------------|--------------------|
| `npm run dev`  | Vite dev server    |
| `npm run build`| Typecheck + build  |
| `npm run preview` | Preview production |
| `npm run lint` | oxlint             |

## Customization model

Prefs live in `localStorage` via Zustand (`qw-browser-v1`). Types live in `src/types/customization.ts`.

## License

Private / WIP — qw-browser
