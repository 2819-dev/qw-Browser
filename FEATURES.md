# qw — Feature priorities

Core design: clean, minimal **Apple Liquid Glass** — sharp frosted refraction, not mushy rounded AI UI. Classic is solid opaque bars (no blur). Cyber is optional neon.

---

## Priority 0 — First-run experience (shipped)

| Feature | Status | Notes |
|--------|--------|--------|
| Minimal onboarding | Done | Welcome → Look → Place → Guide |
| Visual styles | Done | Liquid Glass / Classic / Cyber — must read differently |
| Layout picker + live preview | Done | Bottom / top / split / floating, etc. |
| Interactive feature tour | Done | Highlights controls; Tabs & Settings require a tap |
| Welcome badge + XP | Done | Finish tour → animation → saveable badge |
| Achievements foundation | Done | Welcome, First Search, Customizer, Tab Hopper, Explorer I/II |

Flow: **Onboarding → Guide (tour) → Finish → Welcome badge → Start page**

---

## Priority 1 — Core browsing (basic, in progress)

| Feature | Status | Notes |
|--------|--------|--------|
| Address / search bar | Done | Engines: DDG, Google, Bing, Ecosia, Brave |
| Tabs (open / close / switch) | Done | |
| Back / forward / reload | Done | |
| Start page (`qw://start`) | Done | Blank / favorites / suggestions / wallpaper |
| Settings sheet | Done | Full customization surface |
| Bookmarks (save current) | Basic | Toggle current page onto start shortcuts |
| HTTPS badge | Done | |
| Haptics / reduce motion | Done | |

---

## Priority 2 — Customization depth

| Feature | Status | Notes |
|--------|--------|--------|
| Chrome layouts | Done | 7 layouts |
| Glass intensity | Done | Liquid Glass only |
| Accents + theme | Done | Light / dark / system |
| App icon families | Done | Light/dark auto-swap |
| Wallpapers | Done | |
| Loading indicators | Done | |
| Full Customization Guide | Done | Separate longer walkthrough |
| Replay feature tour | Done | From Settings |

---

## Priority 3 — Native & platform

| Feature | Status | Notes |
|--------|--------|--------|
| Capacitor shell | Config | WebView on iOS/Android |
| Real WKWebView / System WebView | Next | Replace iframe for real browsing |
| Home Screen icons (light/dark) | Partial | Favicon + PWA; true icons need native assets |
| Share sheet | Basic | Uses Web Share API when available |

---

## Priority 4 — `qw://` surfaces & games (future)

| Feature | Status | Notes |
|--------|--------|--------|
| `qw://games` hub | Planned | Mini-games only on qw |
| Achievements → level / power-ups | Foundation | XP + unlocks already tracked |
| Visit 100 Sites, etc. | Wired | Unlocks feed future game buffs |
| Cross-site qw:// deep links | Planned | e.g. `qw://games`, profile badge |

---

## Explicit non-goals (for now)

- Desktop browser chrome
- Extension store
- Account sync
- Heavy AI chat chrome in the shell
