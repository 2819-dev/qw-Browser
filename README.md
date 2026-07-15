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
npm run dev -- --host
```

On desktop you’ll see an iPhone-sized frame; on a phone it’s full-bleed. Clear site data / use a private window if you need to re-run onboarding (`localStorage` key `qw-browser-v4`).

## Native (Capacitor)

```bash
npm run build
npx cap add ios      # requires macOS + Xcode
npx cap add android
npx cap sync
```

## License

Private / WIP — qw
