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

### 2. Notification sound — the real Makkah azan

`app/src/main/res/raw/azan.mp3` (4 min 43 s) is **"Makkah Azan-Ramadan"** from the Internet Archive, uploaded by a dedicated Haramain-recordings account (`haramainstaff@gmail.com`, item id `MakkahAzan-ramadan`) and released under **CC0 1.0 (public domain)** — free to use, modify, and distribute, commercially or not, no attribution required (`archive.org/details/MakkahAzan-ramadan`). Picked over a generic/anonymous recording specifically because it's an actual Masjidil Haram (Makkah) azan with a clear, verifiable public-domain dedication, per an explicit ask to use a real, recognizable one rather than a placeholder tone. Converted to a standard 44.1kHz mp3 with `ffmpeg` (the source file was 16kHz; re-encoded up for broader device compatibility, same content/duration).

**If this file is ever swapped for a different recording later, also bump the channel id** in `FcmService.kt` (currently `CHANNEL_ID = "adzan_channel_v3"` → next would be `"adzan_channel_v4"`) — Android locks a notification channel's sound in at creation and silently ignores changes to an existing channel, so anyone who already has the app installed would otherwise keep hearing the old file forever.

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
