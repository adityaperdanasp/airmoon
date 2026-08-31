# airmoon — Android native app

A real native Android app (Kotlin), not a TWA — exists specifically so
prayer-time and doa notifications can play a **real, custom-bundled sound**
(the previous `android-twa/` wrapper couldn't do this — see the root
`CLAUDE.md` for the full story of why the TWA/web-push route hit a hard
ceiling here). The app itself is just a full-screen WebView pointed at
`https://airmoon.vercel.app` — all the actual screens/features are the same
web app already deployed; this project only adds real native notification
handling on top.

## One thing only the founder can do before this builds

### Register this app in Firebase and get `google-services.json`

This is a **new** Android app registration in the existing `airmoon-d9620`
Firebase project (separate from the TWA, which never registered one):

1. Firebase Console → `airmoon-d9620` project → ⚙️ Project Settings → scroll to "Your apps" → **Add app** → Android.
2. Android package name: `id.web.jalanmenujusurga.app` (must match exactly — this is `applicationId` in `app/build.gradle.kts`).
3. App nickname: anything, e.g. "airmoon native".
4. SHA-1 is optional for this app (only needed for Google Sign-In / Dynamic Links, neither of which this WebView shell uses) — skip it.
5. Download the generated **`google-services.json`**.
6. Don't commit this file to git. Instead, base64-encode it and store it as a **GitHub Actions repo secret** named `GOOGLE_SERVICES_JSON_B64` (Settings → Secrets and variables → Actions → New repository secret):
   ```bash
   base64 -i google-services.json | pbcopy   # macOS — copies the encoded value to your clipboard
   ```
   Paste that into the secret's value field.

### 2. Notification sound — 3 real azan recordings, user picks one

There's a **picker**, not just one fixed sound — see `AzanSound.kt` (the single source of truth both `FcmService.kt` and `MainActivity.kt`'s bridge read from) and the "Suara Azan" card on the web app's Pengaturan page (only rendered inside this native shell — a regular browser/PWA has no way to attach a custom sound to a notification at all, so there's nothing to pick between there). All three are CC0/public domain, picked specifically for having a real, checkable license attached rather than being grabbed from a random unlicensed source:

| File | Source | Length | License |
|---|---|---|---|
| `res/raw/azan_makkah.mp3` | "Makkah Azan-Ramadan", Internet Archive, uploaded by a dedicated Haramain-recordings account (`archive.org/details/MakkahAzan-ramadan`) | 4:43 | CC0 1.0 |
| `res/raw/azan_madinah.mp3` | Trimmed (first 68s, faded out) from "MadinahFajr9thNov2011Audio" on the Internet Archive — a live Fajr recording from Masjid Nabawi led by Sheikh Ale Sheikh (`archive.org/details/MadinahFajr9thNov2011Audio`); trimming to just the azan portion is a permitted derivative use under CC0 | 1:08 | CC0 1.0 |
| `res/raw/azan_lainnya.mp3` | "Beautiful adhan.ogg", Wikimedia Commons, uploaded by Adam-synagda — also the reference audio on Wikipedia's own Japanese/Turkmen/Turkish adhan articles (`commons.wikimedia.org/wiki/File:Beautiful_adhan.ogg`) | 2:34 | CC0 1.0 |

Each has its **own permanent notification channel** (`AzanSound.channelIdFor()`, e.g. `adzan_channel_makkah_v1`) — Android locks a channel's sound in at creation, so a picker needs one channel per option, not one shared channel whose sound changes. `FcmService.onMessageReceived` reads whatever's currently saved (`AzanSound.getSelected()`, backed by `SharedPreferences`, default `makkah`) each time a notification actually fires, so a change in Pengaturan takes effect on the very next prayer notification, not just future app installs.

**Adding a 4th option later**: drop the file in `res/raw/`, add one line to `AzanSound.ALL`/`rawResFor()`/`labelFor()` — nothing else needs to change. **Replacing one of the existing three**: also bump that id's version suffix (`_v1` → `_v2`) in `channelIdFor()`, or returning users keep hearing the old file forever on their already-created channel.

## Building the .apk

This dev environment has no JDK/Android SDK, so building happens on GitHub's own servers instead of locally:

1. Do the two steps above first (the build fails without `google-services.json`).
2. Push a change under `android-native/` (or open the repo's **Actions** tab → "Build Android APK" workflow → **Run workflow** to trigger it manually without needing a code change).
3. Once the run finishes (green check), open it → scroll to **Artifacts** → download `airmoon-debug-apk`.
4. Unzip it (GitHub always wraps artifacts in a zip) → you get `app-debug.apk`.
5. Transfer that to an Android phone (email it to yourself, Google Drive, USB, whatever) and tap it to install. Android will warn about installing from an unknown source the first time — that's expected for a sideloaded app, not a red flag.

This is a **debug** build (auto-signed with a throwaway key baked into every Android SDK install) — fine for sideloading to your own phone, not something to eventually publish to the Play Store as-is (that needs a real release signing key, a separate step for later if this ever needs to go that route).

## How notifications actually reach this app

Nothing changes on the backend's send side beyond what already shipped for the web app — `api/send-prayer-notifications.js` and `api/broadcast-doa.js` send **data-only** FCM messages (no top-level `notification` field), specifically so `FcmService.onMessageReceived` always runs and builds the notification itself on the custom-sound channel, rather than the OS auto-displaying it with the default sound first.

The one new piece is how this app's push token gets into the same `users/{uid}.fcmTokens` array the backend already reads from: `MainActivity` fetches the token from the native Firebase SDK and hands it to the WebView's JS via `window.__airmoonNativeToken(token)`; `lib/notifications.js` on the web side detects it's running inside this shell (a `AirmoonNativeApp/1.0` suffix on the WebView's user agent) and saves that token into Firestore the same way it already saves a browser's web-push token — no separate "native" code path in the backend at all.
