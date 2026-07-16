# Publishing qw to the App Store

This document is the checklist for taking qw from this repo to an iOS App Store
submission. It intentionally focuses on the mechanical steps that a publisher
must perform on a Mac; anything that can be automated in-repo has already been
scaffolded.

qw is a **native browser shell around a Capacitor WKWebView**. There is no AI,
no analytics, no tracking. The remote-content story (below) matters for App
Review — read that section carefully.

---

## 1. Prerequisites

- **Apple Developer Program** account ($99/yr). Individual or Organization is
  fine; you will need an Organization account only if you want the app listed
  under a company name.
- **Mac** with **Xcode 15.3 or later** (Xcode 16+ recommended for iOS 18
  simulators and the current privacy-manifest tooling).
- **CocoaPods** installed on the Mac: `sudo gem install cocoapods` (or via
  Homebrew). Capacitor's `npx cap sync ios` will call `pod install` for you.
- **Node 20+** and **npm 10+** on the same Mac (or on your CI).
- An **App Store Connect** app record with a chosen SKU, primary language, and
  the same Bundle ID you will set in step 2.

---

## 2. Bundle identifier

The repo ships with `appId: "dev.qw.browser"` in `capacitor.config.json`. This
is a **placeholder**. Before your first `npx cap add ios` (or immediately after,
if you're using the scaffold that already exists in `ios/`), change it to a
Bundle ID that lives under a team you control, for example:

```
com.<yourteam>.qw
```

### Where to change it

1. `capacitor.config.json` → `appId`
2. Xcode: open `ios/App/App.xcodeproj`, select the **App** target →
   **Signing & Capabilities** → set **Team** and **Bundle Identifier**. Xcode
   will regenerate provisioning profiles automatically once a Team is picked.
3. App Store Connect: create the app record with the exact same Bundle ID.

Run `npx cap sync ios` after editing `capacitor.config.json` so the native
project picks up the change.

---

## 3. Privacy manifest — `PrivacyInfo.xcprivacy`

Apple requires a privacy manifest for all new App Store submissions since
**May 1, 2024**. This repo already ships one at:

```
ios/App/App/PrivacyInfo.xcprivacy
```

It declares:

- `NSPrivacyTracking = false` — qw does not track users across apps or websites.
- `NSPrivacyTrackingDomains` — empty.
- `NSPrivacyCollectedDataTypes` — empty. qw does not collect any user data;
  all browsing state stays on-device.
- `NSPrivacyAccessedAPITypes` — declares **UserDefaults** with reason code
  **CA92.1** (access info from same app, per its documentation). Capacitor and
  WKWebView both touch `NSUserDefaults`, so this is required.

### When you must extend it

If you ever add an SDK that touches any of the other Required-Reason APIs
(file timestamp, system boot time, disk space, active keyboard) or that
collects any user data, extend the manifest **before** submitting. Apple's
automated Privacy Report scanner will otherwise reject the build.

Add the file to the **App** target in Xcode: right-click the `App` folder in
the project navigator → **Add Files to "App"…** → select
`PrivacyInfo.xcprivacy` → make sure **Target Membership → App** is checked.
Capacitor's Xcode template does not auto-add it.

---

## 4. Info.plist — required keys to paste

Capacitor's default `Info.plist` (`ios/App/App/Info.plist`) is mostly fine for
qw, but the App Store will reject or downgrade the listing if these keys are
missing. Add them to the top-level `<dict>` in the Info.plist:

```xml
<!-- Encryption exemption — qw uses only HTTPS/WKWebView; no proprietary crypto. -->
<key>ITSAppUsesNonExemptEncryption</key>
<false/>

<!-- Allow WKWebView to load HTTPS content. qw does NOT need arbitrary loads. -->
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <false/>
  <key>NSAllowsArbitraryLoadsInWebContent</key>
  <true/>
</dict>

<!-- Human-readable "Why" strings — REQUIRED only if you later add any of these. -->
<!-- Uncomment and edit if/when you use them. qw currently uses none of these. -->
<!--
<key>NSCameraUsageDescription</key>
<string>qw uses the camera to let websites you visit take pictures (e.g. profile uploads).</string>

<key>NSMicrophoneUsageDescription</key>
<string>qw uses the microphone to let websites you visit record audio (e.g. voice notes).</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>qw uses the photo library to let websites you visit pick images to upload.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>qw shares your location with websites you visit only when you allow it.</string>
-->

<!-- Custom URL scheme (optional) — lets other apps deep-link into qw. -->
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>dev.qw.browser</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>qw</string>
    </array>
  </dict>
</array>
```

**Do not** add `NSAllowsArbitraryLoads = true` unless you understand the App
Review consequences (justification required).

---

## 5. Icons

- Provide a **flat 1024×1024 PNG** App Store icon:
  - **No rounded corners** — iOS masks them for you.
  - **No alpha channel** — flatten transparency against a solid background.
  - **sRGB, 8-bit**.
- Drop all launcher sizes into `ios/App/App/Assets.xcassets/AppIcon.appiconset/`.
  The easiest path is a single 1024×1024 PNG plus Xcode 15's "Single Size"
  slot, which Xcode will use to generate every other required size.
- The web PWA icon in `public/` is **not** used for the App Store — it's a
  separate asset.

---

## 6. Screenshots

App Store Connect requires screenshots for each device family you support. As
of iOS 18 the minimum set is:

| Device                  | Portrait                    | Notes                       |
| ----------------------- | --------------------------- | --------------------------- |
| 6.9" iPhone (16 Pro Max)| **1320 × 2868**             | Required                    |
| 6.5" iPhone (11 Pro Max)| 1242 × 2688 or 1284 × 2778  | Required for older devices  |
| 5.5" iPhone (8 Plus)    | 1242 × 2208                 | Optional but recommended    |
| 12.9" iPad Pro (3rd–6th)| 2048 × 2732                 | Required **only** if you    |
|                         |                             | ship an iPad build          |
| 13" iPad Pro (M4)       | 2064 × 2752                 | Same as above               |

3–10 screenshots per device family. PNG, sRGB, no transparency.

---

## 7. WKWebView vs. iframe (this is important)

The web preview in `dev` and `preview` renders the "browsed" page inside an
**`<iframe>`**. That is deliberate — it lets you develop the chrome without
Capacitor.

**The shipping iOS build must render browsed content in the native Capacitor
WKWebView**, not in an iframe, because:

1. Apple rejects browser apps that render web content through anything other
   than WKWebView (App Store Review Guideline 2.5.6).
2. iframes inside WKWebView are subject to the same third-party cookie and
   navigation restrictions, which will break many sites qw is expected to
   handle.

Before submitting, replace the `<iframe>` fallback in `BrowserView` with the
Capacitor WKWebView `InAppBrowser` plugin (or a custom plugin that hosts a
child `WKWebView` and forwards navigation events to the JS layer). Track
that work separately from this scaffolding change — this repo is deliberately
scoped to _App Store readiness_ and not the WKWebView rewrite itself.

---

## 8. Encryption

qw uses only HTTPS + WKWebView, no proprietary crypto, no encrypted user data
storage beyond the platform's own protections. Set:

```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

in Info.plist. This makes the "Export Compliance" question in App Store
Connect a single-click "No, this app does not use non-exempt encryption."
Without this key, Apple will ask on every single build.

---

## 9. Age rating

- Target **4+**.
- Answer **No** to every question in the App Store Connect "Age Rating"
  questionnaire **except** "Unrestricted Web Access" — the correct answer
  there is **Yes**, because qw is a browser.
- With "Unrestricted Web Access = Yes" and no other flagged content, the
  computed rating stays **17+** by default. Apple will not let a general web
  browser be rated below 17+ regardless of other answers; that is expected
  and matches Safari, Chrome, Firefox, etc.

---

## 10. Extensions

qw's "Extensions" are **curated remote content descriptors**, not executable
plugins. They are fetched from `server/data/` (or your production endpoint)
and render pre-approved links / CSS overlays inside qw's own UI. They:

- Do **not** load or execute third-party JavaScript.
- Do **not** ship a JS runtime beyond WKWebView itself.
- Do **not** provide a way for third parties to submit code.

This distinction matters because App Review Guideline 2.5.2 forbids apps
from downloading and executing code that changes the app's primary purpose.
Be prepared to state, in the Review Notes field of App Store Connect:

> "Extensions" in qw are curated content descriptors (name, icon, URL, CSS
> theme) served from our own backend. qw does not download or execute
> third-party code. All extension effects are hard-coded in the app binary
> and only toggled on/off by descriptor.

---

## 11. Build & submit — step-by-step

From a Mac with Xcode installed:

```bash
git clone <this repo>
cd qw
npm install

# 1. Build the web app AND sync into the native iOS project.
npm run build && npx cap add ios   # first time only; skip if ios/ exists
npx cap sync ios

# 2. Open the iOS project in Xcode.
npx cap open ios
# …or:
open ios/App/App.xcworkspace
```

In Xcode:

1. Select the **App** scheme, then **Any iOS Device (arm64)** as the run
   destination.
2. **Signing & Capabilities** → pick your Team, confirm Bundle ID.
3. **Product → Archive**.
4. In the Organizer window, **Distribute App → App Store Connect → Upload**.
5. Wait ~10 minutes for App Store Connect to process the build; it will
   appear under **TestFlight → iOS Builds**.
6. Attach the build to your app record, fill in metadata + screenshots, then
   **Submit for Review**.

Repeat the `npm run build && npx cap sync ios` step every time you change
web code — Capacitor copies `dist/` into `ios/App/App/public/`, and Xcode
will not pick up changes otherwise.

---

## 12. Convenience scripts

The repo defines the following npm scripts to keep the workflow short:

- `npm run cap:sync` — `npm run build && npx cap sync`. Web build + copy into
  all native platforms.
- `npm run build:ios` — same as above but iOS only.
- `npm run cap:ios` — `npx cap open ios`. Opens Xcode on the current project.

---

## 13. What's NOT in scope of this scaffold

- No AI features are integrated. qw is a browser; AI belongs in a separate,
  clearly-labeled feature branch with its own privacy manifest updates.
- No fake iOS binary is checked in. `cap add ios` must be run on a Mac to get
  a signable project; the `ios/` directory in this repo is only the
  Capacitor template.
- No Android platform. Add it later with `npx cap add android` if you want.
