# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`airmoon` is a Muslim app: Qur'an reader, prayer times, mosque electricity donation routed directly to a PLN customer ID (not a committee bank account), plus lighter utility features (zakat calculator, Hijri calendar, asmaul husna, daily duas, mosque finder, Makkah live, greeting cards).

This repo is deliberately just the buildable product surface — app code, design references, and Firebase config. Business/reference material (pitch decks, financial models, market research) lives outside this repo and is intentionally not published here.

**`app/` is the real, deployed product.** `mockup/` and `design-canvas/` are design artifacts that came before it — kept as reference for visual language and for prototyping new screens before building them for real, not as things to deploy.

## Structure & how to run things

- **`app/`** — the real app: React + Vite, deployed to Firebase Hosting. This is what's live at https://airmoon-d9620.web.app.
  ```
  cd app && npm install   # first time only
  npm run dev             # local dev server
  npm run build            # production build → app/dist
  ```
  After a `build`, deploy with `firebase deploy --only hosting` from the repo root (`firebase.json`'s `hosting.public` points at `app/dist`).

  Routing is client-side (`react-router-dom`, `BrowserRouter`) — `firebase.json` has a catch-all rewrite to `index.html` so deep links work on Hosting.

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
- **`data/asmaulHusna.js`, `data/doaHarian.js`** — static content. Low-risk, well-known text, but still **verify against a mu'tabar source (e.g. Kemenag, Hisnul Muslim) before treating as final** — same for the quotes hardcoded in `pages/KutipanInspirasi.jsx`. None of this was pulled from a verified API; it was authored directly and needs a human check.

## Known gaps (don't assume these are done)

- **Qur'an "word turns green while reciting"** — not implemented as word-level. EQuran.id only gives ayat-level audio with no word timestamps, so `SurahReader.jsx` highlights the whole currently-playing ayat instead. True word-by-word sync needs a different audio/timestamp source.
- **Adzan notifications** — `JadwalSholat.jsx` uses the browser `Notification` API with a `setTimeout` to the next prayer, which only fires while the tab is open. Real background push (works with the app closed) needs Firebase Cloud Messaging + a service worker + a scheduled trigger (Cloud Functions or similar) — none of that exists yet.
- **Adzan/reciter sound picker** — `PilihAdzan.jsx` only stores a preference string in `localStorage`; there's no bundled/licensed adzan audio yet.
- **Makkah Live** — embeds a real YouTube video (id verified via web search, not guessed) of a public 24/7 stream. Swap for an official channel embed if there's a specific licensing/partnership.
- **i18n** — `LangProvider`/`translations.js` covers the core screens (nav, auth, Home, Pengaturan). The `Lainnya` hub's 8 feature pages are Indonesian-only hardcoded strings; extending translations to them is mechanical but not done.
- **Umroh Needs** (`pages/Umroh.jsx`) — placeholder cards only ("segera hadir"). The deck's original Umrah marketplace concept was scoped down earlier to lightweight content features (Tabungan Umroh, Badal Umrah, manasik guide, checklist) — none are built yet.

## Firebase

Project: **airmoon-d9620** (`.firebaserc` sets it as default).

- **Hosting**: serves `app/dist`, live at https://airmoon-d9620.web.app.
- **Auth**: Email/Password and Google sign-in are enabled (console → Authentication). `AuthContext.jsx` wires both.
- **Firestore**: real (small) data model now —
  - `users/{uid}`: `displayName`, `email`, `walletBalance`, `points`, `lastRead` (Qur'an bookmark). Read/write scoped to the owning user only.
  - `donations/{id}`: public read (home feed works signed-out), write open to any signed-in user for now — see the client-seed note above; tighten this once there's an admin path.
  - Everything else stays denied by the trailing `match /{document=**} { allow read, write: if false; }` — add explicit collections as real features need them, don't loosen the blanket default.
- **`firebase-config.js`** (repo root) — the Web SDK config, duplicated into `app/src/lib/firebase.js`. Not a secret, safe committed.

## Design decisions already settled

These came out of iteration with the founder — keep them unless explicitly asked to change:

- **Palette**: dark teal `#0d4d47` / `#0a3630` (primary), gold `#e8b84b` (accent), white `#ffffff` background, pastel tint cards (mint `#e2f1ec`, cream-gold `#fbf0d9`) for stat/service tiles. Dark theme uses mint `#6ee7c9` / gold `#f0cd7b` on near-black `#071612` — see `app/src/styles/theme.css` for the full token set (`[data-theme='dark']`).
- **Type**: Poppins (Google Fonts) for UI text, Amiri for Arabic verse/dua text — chosen to match the founder's reference pitch deck's rounded-geometric wordmark (was Plus Jakarta Sans in the very first pass).
- **Icons**: inline SVG line icons only — never emoji as icons.
- **Bottom nav**: a floating rounded pill, not a full-width bar. Items: Home, Qur'an, Donasi, Umroh Needs.
- **Visual reference**: `Deck/Moon - Sequoia .pdf` (outside this repo) — the teal/gold palette, arabesque line-pattern accents, and card-based layout are intentionally derived from this deck, not invented fresh.
