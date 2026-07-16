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

```bash
npm install
npm run server          # extensions API on :8787 (keep running)
npm run dev -- --host   # app on :5173 — proxies /api
```

Or both together: `npm run dev:full`.

- **Mobile store:** open the app → `qw://extensions` (approved listings only)
- **Developer portal (computer):** http://localhost:5173/developer — submit, check status, review/approve

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
