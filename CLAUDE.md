# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`airmoon` is a Muslim app: Qur'an reader, prayer times, mosque electricity donation routed directly to a PLN customer ID (not a committee bank account), plus lighter utility features (zakat calculator, Hijri calendar, asmaul husna, daily duas, mosque finder, Makkah live, greeting cards).

This repo is deliberately just the buildable product surface — app code, design references, and Firebase config. Business/reference material (pitch decks, financial models, market research) lives outside this repo and is intentionally not published here.

**`app/` is the real, deployed product.** `mockup/` and `design-canvas/` are design artifacts that came before it — kept as reference for visual language and for prototyping new screens before building them for real, not as things to deploy.

## Structure & how to run things

- **`app/`** — the real app: React + Vite. Deployed to **both** Firebase Hosting (https://airmoon-d9620.web.app) and Vercel (https://airmoon.vercel.app) — same static frontend, two hosts. Vercel also carries the one serverless function (`app/api/ask-me.js`) that Firebase Hosting can't run.
  ```
  cd app && npm install   # first time only
  npm run dev             # local dev server
  npm run build            # production build → app/dist
  ```
  Deploy after a `build`:
  ```
  firebase deploy --only hosting   # from repo root — firebase.json's hosting.public points at app/dist
  vercel --prod                    # from app/ — picks up app/vercel.json + api/
  ```
  Do both when `app/` changes — they're independent deploys, not automatically in sync.

  Routing is client-side (`react-router-dom`, `BrowserRouter`) — both `firebase.json` and `app/vercel.json` have a catch-all rewrite to `index.html` so deep links work on either host.

- **`mockup/`** — the original static HTML/CSS home-screen prototype. No longer deployed (superseded by `app/`); kept for history. If you open it, do so through a local server (`cd mockup && python3 -m http.server 8743`), not `file://` — it fetches Google Fonts and uses a same-origin stylesheet link.

- **`design-canvas/`** — source for the editable Claude Design canvas (`Main.dc.html`, `Login.dc.html`, `SurahReader.dc.html`, etc. — one `.dc.html` per screen, plus `canvas.json` for layout). Authored through the `design` skill (invoke `/design`), not hand-edited after seeding. Useful for prototyping a new screen's look before building it for real in `app/`; the two are not kept in lockstep automatically — a design change here doesn't propagate to `app/` on its own. `airmoon-home.html` is the seeded/published output — never edit it directly.

## App architecture (`app/src/`)

- **`context/`** — `AuthProvider` (Firebase Auth state + sign-up/in/out), `ThemeProvider` (light/dark, persisted to `localStorage`, toggles `data-theme` on `<html>`), `LangProvider` (id/en, persisted, `t(key)` lookup against `lib/translations.js`).
- **`lib/firebase.js`** — Firebase SDK init. Config is duplicated from `../../firebase-config.js` at the repo root (client config, not a secret) — keep both in sync if it ever changes.
- **`lib/quranApi.js`** — EQuran.id v2 (`equran.id/api/v2`), public, no key. Surah list + detail + per-ayat audio for 5 reciters.
- **`lib/prayerApi.js` / `lib/usePrayerTimes.js`** — real `navigator.geolocation` + Aladhan API (`method=20`, Kemenag) for prayer times; the hook also derives the next prayer + a live countdown. Reused by both Home's widget and the full Jadwal Sholat page.
- **`lib/mosqueApi.js`** — OpenStreetMap Overpass API (free, no key) for real nearby-mosque data. Coverage depends entirely on what's mapped in OSM for a given area — don't assume completeness.
- **`lib/donations.js`** — Firestore-backed donation campaign (`donations/{id}`). `getOrSeedDonation()` bootstraps the one demo campaign client-side on first read if it doesn't exist yet (see the write-rule note in `firestore.rules` — this should move to an admin-only Cloud Function once there's a real back office, not stay client-writable).
- **`lib/zakat.js`** — pure zakat math (penghasilan/maal/fitrah), no external dependency.
- **`data/asmaulHusna.js`, `data/doaHarian.js`** — static content. Low-risk, well-known text, but still **verify against a mu'tabar source (e.g. Kemenag, Hisnul Muslim) before treating as final** — none of this was pulled from a verified API; it was authored directly and needs a human check.
- **`lib/quotesApi.js` / `data/quoteRefs.js`** — the "100 kutipan" on `pages/KutipanInspirasi.jsx`. Fully real: `quoteRefs.js` is just 100 valid `{surah, ayat}` coordinates (opening ayat of surahs 15–114 — picked for guaranteed validity, not curated for content), and `quotesApi.js` fetches the actual Arabic + Indonesian (Kemenag) + English (Sahih International) text live from `api.quran.com/v4`. One is shown per day (`todaysQuoteIndex()`, day-of-year mod 100), language follows `LangProvider`. No hand-typed quote text anywhere in this feature.
- **`api/ask-me.js`** — Vercel serverless function proxying to Claude Haiku (`claude-haiku-4-5-20251001`) for the "Ask me" chat (`pages/AskMe.jsx`, linked from Home's search bar). System prompt guardrails it to Islam-related topics only. **Requires an `ANTHROPIC_API_KEY` environment variable in the Vercel project (`airmoon` under the `ellilo` scope) — it returns a clear JSON error and does nothing else without one; nobody has set this yet.** The frontend calls the fixed absolute URL `https://airmoon.vercel.app/api/ask-me`, not a relative path — that's deliberate, so "Ask me" works the same whether the page is loaded from the Firebase or the Vercel host.

## Known gaps (don't assume these are done)

- **"Ask me" needs `ANTHROPIC_API_KEY` set in Vercel** — see the `api/ask-me.js` note above. Without it the chat page loads fine but every message returns an error.
- **Qur'an "word turns green while reciting"** — not implemented as word-level. EQuran.id only gives ayat-level audio with no word timestamps, so `SurahReader.jsx` highlights the whole currently-playing ayat instead. True word-by-word sync needs a different audio/timestamp source.
- **Adzan notifications** — `JadwalSholat.jsx` uses the browser `Notification` API with a `setTimeout` to the next prayer, which only fires while the tab is open. Real background push (works with the app closed) needs Firebase Cloud Messaging + a service worker + a scheduled trigger (Cloud Functions or similar) — none of that exists yet.
- **Cari Masjid directions** — real Overpass (OSM) data for nearby mosques, and a real no-key Google Maps deep link (`google.com/maps/dir/?api=1&origin=...&destination=...`) per result. Not an embedded map view or the Google Maps JS SDK — that would need a billed Google Cloud API key nobody's provided.
- **Makkah Live** — embeds a real YouTube video (id verified via web search, not guessed) of a public 24/7 stream. Swap for an official channel embed if there's a specific licensing/partnership.
- **i18n** — `LangProvider`/`translations.js` covers the core screens (nav, auth, Home, Pengaturan) plus the 100-quote feature. The `Lainnya` hub's other 7 feature pages are Indonesian-only hardcoded strings; extending translations to them is mechanical but not done.
- **Umroh Needs** (`pages/Umroh.jsx`) — placeholder cards only ("segera hadir"). The deck's original Umrah marketplace concept was scoped down earlier to lightweight content features (Tabungan Umroh, Badal Umrah, manasik guide, checklist) — none are built yet.
- **Donasi page** has a literal "MENUNGGU ARAHAN MAMAS" placeholder banner — deliberate, per an explicit ask; don't remove it without checking first.

## Firebase

Project: **airmoon-d9620** (`.firebaserc` sets it as default).

- **Hosting**: serves `app/dist`, live at https://airmoon-d9620.web.app.
- **Auth**: Email/Password and Google sign-in are enabled (console → Authentication). `AuthContext.jsx` wires both.
- **Firestore**: real (small) data model now —
  - `users/{uid}`: `displayName`, `email`, `walletBalance`, `points`, `lastRead` (Qur'an bookmark). Read/write scoped to the owning user only.
  - `donations/{id}`: public read (home feed works signed-out), write open to any signed-in user for now — see the client-seed note above; tighten this once there's an admin path.
  - Everything else stays denied by the trailing `match /{document=**} { allow read, write: if false; }` — add explicit collections as real features need them, don't loosen the blanket default.
- **`firebase-config.js`** (repo root) — the Web SDK config, duplicated into `app/src/lib/firebase.js`. Not a secret, safe committed.

## Vercel

Project: **airmoon** under the `ellilo` scope, linked via `app/.vercel` (gitignored). Deploy from `app/`: `vercel --prod`. Exists specifically to host `api/ask-me.js` — Firebase Hosting is static-only and can't run it. See the `ANTHROPIC_API_KEY` note above; that's the one manual step nobody's done yet.

## Design decisions already settled

These came out of iteration with the founder — keep them unless explicitly asked to change:

- **Palette**: dark teal `#0d4d47` / `#0a3630` (primary), gold `#e8b84b` (accent), white `#ffffff` background, pastel tint cards (mint `#e2f1ec`, cream-gold `#fbf0d9`) for stat/service tiles. Dark theme uses mint `#6ee7c9` / gold `#f0cd7b` on near-black `#071612` — see `app/src/styles/theme.css` for the full token set (`[data-theme='dark']`).
- **Type**: Poppins (Google Fonts) for UI text, Amiri for Arabic verse/dua text. The **logo wordmark specifically** uses Fredoka (`components/Logo.jsx`) to match the founder's reference deck's rounded wordmark more closely than Poppins did — Fredoka is not used anywhere else.
- **Logo mark**: an outline crescent (stroked, no filled badge/circle behind it) plus a small 4-point star at the tip — see `components/Logo.jsx`. Don't reintroduce the filled-circle version; it was explicitly replaced.
- **Icons**: inline SVG line icons for nav/UI chrome. The **4 Home "Layanan" tiles are the one deliberate exception** — real emoji (📖🕌🤲🕋) at large size (68px tile, 32px emoji) on a soft gradient + shadow tile, per an explicit ask to make them look less flat/cheap. Don't generalize this to other icons without checking; it's a one-place exception, not a new rule.
- **Bottom nav**: a floating rounded pill, not a full-width bar. Items: Home, Qur'an, Donasi, Umroh Needs.
- **Visual reference**: `Deck/Moon - Sequoia .pdf` (outside this repo) — the teal/gold palette, arabesque line-pattern accents, and card-based layout are intentionally derived from this deck, not invented fresh.
