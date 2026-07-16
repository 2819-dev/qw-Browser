# qw — Feature priorities

Core design: clean, minimal **Apple Liquid Glass** — frosted refraction, continuous curves, quiet chrome. Classic is solid opaque bars (no blur). Cyber is optional neon.

No AI features in the shell.

---

## Priority 0 — First-run experience (shipped)

| Feature | Status | Notes |
|--------|--------|--------|
| Minimal onboarding | Done | Welcome → Look → Place → Guide |
| Visual styles | Done | Liquid Glass / Classic / Cyber |
| Layout picker + live preview | Done | Bottom / top / split / floating, etc. |
| Interactive feature tour | Done | Search → site nav → tabs → settings → optional full guide |
| Default UI font | Done | System / Rounded / Serif / Mono / Condensed / Cyber |
| Quiet B&W chrome | Done | Color reserved for Cyber (+ optional accents) |
| Welcome badge + XP | Done | Finish tour → animation → saveable badge |
| Achievements foundation | Done | Welcome, First Search, Customizer, Tab Hopper, Explorer, Games |

Flow: **Onboarding → Guide (tour) → Finish → Welcome badge → Start page**

---

## Priority 1 — Core browsing

| Feature | Status | Notes |
|--------|--------|--------|
| Address / search bar | Done | Engines: DDG, Google, Bing, Ecosia, Brave |
| Tabs (open / close / switch) | Done | Persisted across relaunches |
| Back / forward / reload | Done | |
| Start page (`qw://start`) | Done | Blank / favorites / suggestions / wallpaper |
| Settings sheet | Done | Full surface including behavior + comfort |
| Bookmarks (save current) | Basic | Toggle current page onto start shortcuts |
| HTTPS badge | Done | |
| Haptics / reduce motion | Done | Capacitor Haptics on native |

---

## Priority 2 — Customization depth

| Feature | Status | Notes |
|--------|--------|--------|
| Chrome layouts | Done | 7 layouts |
| Glass intensity | Done | Liquid Glass only |
| Accents + theme | Done | Light / dark / system |
| In-app icon families | Done | Light/dark auto-swap |
| Wallpapers | Done | |
| Loading indicators | Done | |
| Full Customization Guide | Done | Style → comfort (14 steps) — every setting reachable |
| Behavior toggles | Done | Expanded URL, new tab, confirm close, clear on exit, hints |
| Factory reset | Done | Reset customization + Clear all data |
| Replay feature tour | Done | From Settings |

---

## Priority 3 — Native & App Store

| Feature | Status | Notes |
|--------|--------|--------|
| Capacitor shell | Done | `ios/` project + plugins |
| PrivacyInfo.xcprivacy | Done | UserDefaults CA92.1, no tracking |
| Flat App Store icon | Done | `public/appstore/AppIcon-1024.png` |
| Publishing checklist | Done | See [PUBLISHING.md](./PUBLISHING.md) |
| Real WKWebView for pages | Next | Ship build must replace iframe (Guideline 2.5.6) |
| Home Screen icons | Partial | In-app icons done; alternate icons need Xcode |

---

## Priority 4 — `qw://` surfaces & games

| Feature | Status | Notes |
|--------|--------|--------|
| `qw://games` hub | Done | Offline Reflex / Memory / Pulse + 3D teaser |
| Extension store | Done | Online catalog + `/developer` submit → approve |
| Achievements → level / power-ups | Done | XP unlocks game buffs |

---

## Explicit non-goals

- AI chat / AI customization API inside the shell
- Account sync
- Desktop browser chrome (aside from `/developer`)
