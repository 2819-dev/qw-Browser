# qw

**Extremely customizable. Still minimal.**

qw is a mobile-first browser shell with real Apple-style **Liquid Glass** UI (plus solid Classic and optional Cyber). Chromium-class rendering on device via Capacitor. See [FEATURES.md](./FEATURES.md) for priorities.

## First-run flow

1. **Onboarding** — look (Liquid Glass / Classic / Cyber) + layout  
2. **Feature guide** — highlights Search, Tabs, Settings (tap to continue)  
3. **Welcome badge** — animation + saveable badge + XP  
4. **Start browsing** on `qw://start`

## Visual styles

| Style | What you should see |
|-------|---------------------|
| **Liquid Glass** | Frosted blur, specular rim, refracting atmosphere |
| **Classic** | Opaque solid bars. **No blur.** Crystal clear |
| **Cyber** | Neon / mono gamer chrome |

## Run (web preview)

You need the feature branch that includes the extensions API (`cursor/qw-browser-customization-5d3f` or a merge of it):

```bash
git fetch origin
git checkout cursor/qw-browser-customization-5d3f
git pull
npm install
```

Then either run both services with one command:

```bash
npm run dev:full
```

Or in two terminals:

```bash
npm run server
```

```bash
npm run dev -- --host
```

- Extensions API: http://localhost:8787  
- App: http://localhost:5173 (Vite proxies `/api`)  
- Developer portal: http://localhost:5173/developer  
- Mobile store: open the app → `qw://extensions`

Admin review key defaults to `qw-dev` (`QW_ADMIN_KEY` env to override).

On desktop you’ll see an iPhone-sized frame; on a phone it’s full-bleed. Clear site data / use a private window if you need to re-run onboarding (`localStorage` key `qw-browser-v6`).

## Native (Capacitor)

```bash
npm run build
npx cap add ios      # requires macOS + Xcode
npx cap add android
npx cap sync
```

## License

Private / WIP — qw
