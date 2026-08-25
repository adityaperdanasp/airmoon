# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`airmoon` is a Muslim app: Qur'an reader, prayer times, mosque electricity donation routed directly to a PLN customer ID (not a committee bank account), plus lighter utility features (zakat calculator, Hijri calendar, asmaul husna, daily duas, mosque finder, Makkah live, greeting cards).

This repo is deliberately just the buildable product surface — app code, design references, and Firebase config. Business/reference material (pitch decks, financial models, market research) lives outside this repo and is intentionally not published here.

**`app/` is the real, deployed product.** `mockup/` and `design-canvas/` are design artifacts that came before it — kept as reference for visual language and for prototyping new screens before building them for real, not as things to deploy.

## Structure & how to run things

- **`app/`** — the real app: React + Vite. Deployed to **both** Firebase Hosting (https://airmoon-d9620.web.app) and Vercel (https://airmoon.vercel.app) — same static frontend, two hosts. **Redeploy both after every change that should go live** — `git push` auto-deploys Vercel, but Firebase Hosting needs its own explicit `firebase deploy --only hosting` from the repo root; they will silently drift apart otherwise (this has actually happened mid-session before — caught by comparing the live `/assets/*.js` hash against the local `app/dist` one). Vercel also carries the serverless functions Firebase Hosting can't run: `app/api/ask-me.js`, `api/nearby-mosques.js`, `api/aladhan.js`, `api/send-prayer-notifications.js`.
  ```
  cd app && npm install   # first time only
  npm run dev             # local dev server
  npm run build            # production build → app/dist
  ```
  Deploy after a `build`:
  ```
  firebase deploy --only hosting   # from repo root — firebase.json's hosting.public points at app/dist
  vercel --prod                    # from repo root (not app/!) — see the Vercel section below for why
  ```
  Do both when `app/` changes — they're independent deploys, not automatically in sync. The Vercel project is also Git-connected, so a `git push` to `main` triggers its own auto-deploy on top of any manual `vercel --prod` you run — expect two deployments per push, both landing on the same production alias.

  Routing is client-side (`react-router-dom`, `BrowserRouter`) — both `firebase.json` and `app/vercel.json` have a catch-all rewrite to `index.html` so deep links work on either host.

- **`mockup/`** — the original static HTML/CSS home-screen prototype. No longer deployed (superseded by `app/`); kept for history. If you open it, do so through a local server (`cd mockup && python3 -m http.server 8743`), not `file://` — it fetches Google Fonts and uses a same-origin stylesheet link.

- **`design-canvas/`** — source for the editable Claude Design canvas (`Main.dc.html`, `Login.dc.html`, `SurahReader.dc.html`, etc. — one `.dc.html` per screen, plus `canvas.json` for layout). Authored through the `design` skill (invoke `/design`), not hand-edited after seeding. Useful for prototyping a new screen's look before building it for real in `app/`; the two are not kept in lockstep automatically — a design change here doesn't propagate to `app/` on its own. `airmoon-home.html` is the seeded/published output — never edit it directly.

## App architecture (`app/src/`)

- **`context/`** — `AuthProvider` (Firebase Auth state + sign-up/in/out), `ThemeProvider` (light/dark, persisted to `localStorage`, toggles `data-theme` on `<html>`), `LangProvider` (id/en, persisted, `t(key)` lookup against `lib/translations.js`).
- **`lib/firebase.js`** — Firebase SDK init. Config is duplicated from `../../firebase-config.js` at the repo root (client config, not a secret) — keep both in sync if it ever changes.
- **`lib/quranApi.js`** — EQuran.id v2 (`equran.id/api/v2`), public, no key. Surah list + detail + per-ayat audio for 5 reciters.
- **`lib/prayerApi.js` / `lib/usePrayerTimes.js`** — real `navigator.geolocation` + Aladhan API (`method=20`, Kemenag) for prayer times; the hook also derives the next prayer + a live countdown. Reused by both Home's widget and the full Jadwal Sholat page.
- **`lib/mosqueApi.js`** — tries Google Places API (New) first, via the Vercel function `api/nearby-mosques.js` (real ratings/names/hours, needs `GOOGLE_MAPS_API_KEY` in Vercel — same "not set yet" situation as `ANTHROPIC_API_KEY`, see below), and falls back to OpenStreetMap Overpass (free, no key, sparser data) if that call fails for any reason. `CariMasjid.jsx` shows a small banner when it's running on the OSM fallback so it's obvious which source is live. Directions are a plain `google.com/maps/dir` deep link either way — no key needed for that part, and no plan to add the Routes API on top of it.
- **`lib/donations.js`** — Firestore-backed donation campaign (`donations/{id}`). `getOrSeedDonation()` bootstraps the one demo campaign client-side on first read if it doesn't exist yet (see the write-rule note in `firestore.rules` — this should move to an admin-only Cloud Function once there's a real back office, not stay client-writable).
- **`lib/zakat.js`** — pure zakat math (penghasilan/maal/fitrah), no external dependency.
- **`data/asmaulHusna.js`, `data/doaHarian.js`** — static content. Low-risk, well-known text, but still **verify against a mu'tabar source (e.g. Kemenag, Hisnul Muslim) before treating as final** — none of this was pulled from a verified API; it was authored directly and needs a human check.
- **`lib/quotesApi.js` / `data/quoteRefs.js`** — the "100 kutipan" on `pages/KutipanInspirasi.jsx`. Fully real: `quoteRefs.js` is just 100 valid `{surah, ayat}` coordinates (opening ayat of surahs 15–114 — picked for guaranteed validity, not curated for content), and `quotesApi.js` fetches the actual Arabic + Indonesian (Kemenag) + English (Sahih International) text live from `api.quran.com/v4`. One is shown per day (`todaysQuoteIndex()`, day-of-year mod 100), language follows `LangProvider`. No hand-typed quote text anywhere in this feature.
- **`api/aladhan.js`** — Vercel serverless function proxying both Aladhan endpoints this app uses (`?type=timings`, `?type=hijri-calendar`). Exists because api.aladhan.com's IPv6 endpoint hangs/times out on every attempt (verified with `curl -6` vs `-4`: IPv6 never connects, IPv4 is instant) — calling it directly from the browser breaks for anyone on an IPv6-preferring network (common on Indonesian mobile carriers), which is a real production bug this was found fixing, not a hypothetical. `lib/prayerApi.js` and `pages/KalenderHijriah.jsx` both go through this now instead of `api.aladhan.com` directly. No API key needed, Aladhan is free/public.
- **`api/ask-me.js`** — Vercel serverless function proxying to Claude Haiku (`claude-haiku-4-5-20251001`) for the "Ust. Rewin" chat (`pages/AskMe.jsx`, linked from Home's search bar). System prompt guardrails it to Islam-related topics only, plain-text-only replies (chat bubble doesn't render markdown), streamed response (forwards Anthropic's SSE text deltas as they arrive rather than buffering the whole reply). **`ANTHROPIC_API_KEY` is set in Vercel and confirmed working** (verified live via curl 2026-08-25). The frontend calls the fixed absolute URL `https://airmoon.vercel.app/api/ask-me`, not a relative path — that's deliberate, so it works the same whether the page is loaded from the Firebase or the Vercel host.

## Known gaps (don't assume these are done)

- **Qur'an word-level highlight — done, for 2 of 5 reciters.** `lib/quranTimingApi.js` pulls per-word timestamps from Quran.com's public API (`chapter_recitations/{id}/{surah}?segments=true` — free, no key, verified live) and `SurahReader.jsx` uses it to highlight the exact word as it's spoken (verified against real playback: highlight tracked one word for ~2s then correctly advanced to the next word/ayat). Only wired up for reciters with a clean 1:1 match to a Quran.com recitation — As-Sudais and Al-Afasy (`quranTimingApi.js`'s `hasWordSync`), flagged with a small badge in `PilihQari.jsx`. The other 3 EQuran.id reciters (Al-Juhany, Al-Qasim, Al-Akhdar) have no Quran.com match to borrow timing from, so they keep the original whole-ayat highlight — a real gap, not a bug, and don't paper over it with a fake per-word guess.
- **Adzan notifications — built, one manual step left.** Real background push (works with the app closed) via FCM: `lib/notifications.js` registers `public/firebase-messaging-sw.js` and saves the token + location to `users/{uid}`; `api/send-prayer-notifications.js` (Firebase Admin, `FIREBASE_SERVICE_ACCOUNT_B64` already set in Vercel) checks due prayers per user via `/api/aladhan` and sends through FCM, deduped per prayer/day. **Needs `VITE_FCM_VAPID_KEY`** — Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Generate Key Pair (no public API for this, Firebase keeps the private half itself) — set as a Vercel env var, then redeploy. Without it `lib/notifications.js` throws a clear error instead of silently failing. **Also needs an external cron pinger** hitting `https://airmoon.vercel.app/api/send-prayer-notifications?secret=<CRON_SECRET>` every 1-5 minutes — Vercel's own Cron Jobs are daily-only on the Hobby plan, nowhere near fine-grained enough for 5x-daily prayer triggers. `CRON_SECRET` is already set in Vercel; a free service like cron-job.org works fine. The Android TWA (`android-twa/`) has notification delegation available but currently off (`enableNotifications: false` in `twa-manifest.json`) — flip that + rebuild once the above is live, so pushes render as native Android notifications there too.
- **Donasi payment flow is a placeholder** — `pages/Donasi.jsx` has a literal "MENUNGGU ARAHAN MAMAS" banner (deliberate, per an explicit ask — don't remove without checking first) and the "sedekah sekarang" button just increments a Firestore counter client-side. The actual PLN-direct-payment mechanism (the app's core differentiator per the original pitch — paying a mosque's electricity bill directly via its PLN customer ID, precisely so a committee/treasurer can't misuse the funds) has no real payment gateway integrated at all yet.
- **`GOOGLE_MAPS_API_KEY` is set in Vercel and confirmed working** — Cari Masjid uses real Google Places data (verified live via curl 2026-08-25, returns real place names/ratings). OSM Overpass is still the automatic fallback if the key ever breaks/hits quota. Directions are always a real no-key Google Maps deep link (`google.com/maps/dir/?api=1&origin=...&destination=...`) regardless of which search source is active. Not an embedded map view or the Routes API — that's out of scope for now.
- **Composio is agent-side only** — this Claude Code session has an active Composio connection (Google Maps and others) usable *by Claude* for one-off lookups/testing, but the deployed app itself can never call Composio at runtime — end users' browsers have no path to it. Real runtime integrations (Google Maps search, Claude Haiku chat) go through proper API keys in Vercel serverless functions instead; Composio is for Claude's own use in this session (data pulls, testing, one-off automation), not a backend for the shipped product.
- **Makkah Live** — embeds a real YouTube video (id verified via web search, not guessed) of a public 24/7 stream. Swap for an official channel embed if there's a specific licensing/partnership.
- **i18n — done for UI chrome.** `LangProvider`/`translations.js` now covers all 7 `Lainnya` feature pages (titles, labels, buttons, empty/error states) plus the screens already done before. Deliberately left Indonesian-only: the 99 names' meanings (`data/asmaulHusna.js`), dua text (`data/doaHarian.js`), and the greeting-card templates in `KartuUcapan.jsx` — that's religious/cultural content, not UI chrome, and machine-translating it inline risks getting the meaning wrong in a way that matters here. If real English translations of that content are wanted, get them from a proper source, don't have Claude translate them ad hoc.
- **Umroh Needs** (`pages/Umroh.jsx`) — placeholder cards only ("segera hadir"). The deck's original Umrah marketplace concept was scoped down earlier to lightweight content features (Tabungan Umroh, Badal Umrah, manasik guide, checklist) — none are built yet.
- **Donasi page** has a literal "MENUNGGU ARAHAN MAMAS" placeholder banner — deliberate, per an explicit ask; don't remove it without checking first.

## Firebase

Project: **airmoon-d9620** (`.firebaserc` sets it as default).

- **Hosting**: serves `app/dist`, live at https://airmoon-d9620.web.app.
- **Auth**: Email/Password and Google sign-in are enabled (console → Authentication). Facebook sign-in has the client code wired (`AuthContext.jsx`, `lib/firebase.js`, buttons on Login/SignUp) but **needs a Facebook Developer App's App ID + App Secret pasted into Firebase Console → Authentication → Sign-in method → Facebook** before it actually works — that's a manual step nobody's done yet, same shape as the other "code's ready, needs a credential only the founder can create" gaps below. Facebook also requires a public Privacy Policy URL before its app can go Live — that's `pages/PrivacyPolicy.jsx` at `/privacy-policy`, public (not behind `ProtectedRoute`) so Facebook's review crawler can reach it signed out.
- **Firestore**: real (small) data model now —
  - `users/{uid}`: `displayName`, `email`, `walletBalance`, `points`, `lastRead` (Qur'an bookmark). Read/write scoped to the owning user only.
  - `donations/{id}`: public read (home feed works signed-out), write open to any signed-in user for now — see the client-seed note above; tighten this once there's an admin path.
  - Everything else stays denied by the trailing `match /{document=**} { allow read, write: if false; }` — add explicit collections as real features need them, don't loosen the blanket default.
- **`firebase-config.js`** (repo root) — the Web SDK config, duplicated into `app/src/lib/firebase.js`. Not a secret, safe committed.

## Vercel

Project: **airmoon** under the `ellilo` scope. Also Git-connected to this GitHub repo (auto-deploys on push to `main`), on top of manual CLI deploys — see the deploy note above.

**Deploy from the repo root, not `app/`.** The project's Root Directory setting is `app` (so the Git-connected auto-deploy can find `package.json` after cloning the whole monorepo-style repo). That means CLI deploys must also run from the repo root — `.vercel/project.json` at the repo root links it to the `airmoon` project. Running `vercel --prod` from inside `app/` instead will look for a nonexistent `app/app` and error. Don't `vercel link` a fresh directory to "fix" this — that creates a **second, separate project** (this happened once already, named `airmoon-app`, since deleted) that has none of the domain/env var config the real one does.

Custom domain: **jalanmenujusurga.web.id**, registered elsewhere (SumoPod) with a plain `A` record → `76.76.21.21` (no nameserver delegation) — Vercel confirmed this config valid via `vercel domains verify`.

Exists specifically to host the serverless functions (`api/ask-me.js`, `api/nearby-mosques.js`) — Firebase Hosting is static-only and can't run them; Firebase Hosting keeps serving the same static frontend independently. See the `ANTHROPIC_API_KEY` / `GOOGLE_MAPS_API_KEY` notes above for what's configured.

## Design decisions already settled

These came out of iteration with the founder — keep them unless explicitly asked to change:

- **Palette**: dark teal `#0d4d47` / `#0a3630` (primary), gold `#e8b84b` (accent), white `#ffffff` background, pastel tint cards (mint `#e2f1ec`, cream-gold `#fbf0d9`) for stat/service tiles. Dark theme uses mint `#6ee7c9` / gold `#f0cd7b` on near-black `#071612` — see `app/src/styles/theme.css` for the full token set (`[data-theme='dark']`).
- **Type**: Poppins (Google Fonts) for UI text, Amiri for Arabic verse/dua text. The **logo wordmark specifically** uses Fredoka (`components/Logo.jsx`) to match the founder's reference deck's rounded wordmark more closely than Poppins did — Fredoka is not used anywhere else.
- **Logo mark**: a solid filled crescent (no stroke, no circle badge behind it) plus a real 5-point star sitting in the crescent's own inner notch — see `components/Logo.jsx`. This replaced an earlier outline-crescent + 4-point-sparkle version after the founder shared the actual design-system asset pack (`Moon (airmoon) Design System.zip`) showing the mark is meant to be solid-filled; the star's exact position/size was traced from that reference PNG via pixel connected-component analysis, not eyeballed. The mark's viewBox is intentionally tight around the shape (`2.761 3.436 17.778 17.778`, not `0 0 24 24`) so it renders ~35% larger within the same `size` prop — don't "fix" that back to a square 0-24 viewBox, the shape only filled ~69% of that box. Same path + viewBox duplicated in `index.html`'s inline favicon data-URI; keep both in sync if either changes.
- **Icons**: inline SVG line icons for nav/UI chrome. The **4 Home "Layanan" tiles are the one deliberate exception** — real emoji (📖🕌🤲🕋) at large size (68px tile, 32px emoji) on a soft gradient + shadow tile, per an explicit ask to make them look less flat/cheap. Don't generalize this to other icons without checking; it's a one-place exception, not a new rule.
- **Bottom nav**: a floating rounded pill, not a full-width bar. Items: Home, Qur'an, Donasi, Umroh Needs.
- **Visual reference**: `Deck/Moon - Sequoia .pdf` (outside this repo) — the teal/gold palette, arabesque line-pattern accents, and card-based layout are intentionally derived from this deck, not invented fresh.
