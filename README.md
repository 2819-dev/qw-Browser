# qw

**Extremely customizable. Still minimal.**

qw is a mobile-first browser shell with Apple-style **Liquid Glass** (plus solid Classic and optional Cyber), built with Capacitor for App Store / Play. See [FEATURES.md](./FEATURES.md) and [PUBLISHING.md](./PUBLISHING.md).

No AI features — customization is all yours through Settings and the Full Customization Guide.

## First-run flow

1. **Onboarding** — look (Liquid Glass / Classic / Cyber) + layout  
2. **Feature guide** — highlights Search, Tabs, Settings (tap to continue)  
3. **Welcome badge** — animation + saveable badge + XP  
4. **Start browsing** on `qw://start`

## Visual styles

| Style | What you should see |
|-------|---------------------|
| **Liquid Glass** | Frosted blur, specular rim, nested materials, ambient refraction |
| **Classic** | Opaque solid bars. **No blur.** Crystal clear |
| **Cyber** | Neon / mono gamer chrome |

## Run (web preview)

```bash
git fetch origin
git checkout cursor/qw-browser-customization-5d3f
git pull
npm install
npm run dev:full
```

Or two terminals: `npm run server` then `npm run dev -- --host`.

- App: http://localhost:5173  
- Developer portal: http://localhost:5173/developer  
- Extensions: `qw://extensions` (API on :8787)

Clear site data if you need to re-run onboarding (`localStorage` key `qw-browser-v7`).

## Native (App Store)

iOS project lives in `ios/`. On a Mac with Xcode:

```bash
npm run build:ios
npx cap open ios
```

Follow [PUBLISHING.md](./PUBLISHING.md) for Bundle ID, privacy manifest, screenshots, and Review Notes. **Shipping builds must use WKWebView for page content** (web preview still uses an iframe).

## License

Private / WIP — qw
