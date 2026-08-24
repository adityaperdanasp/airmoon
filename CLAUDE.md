# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`airmoon` is a Muslim app project. Core planned features: Qur'an reader, prayer times (location-based), mosque electricity donation routed directly to a PLN customer ID (not a committee bank account), and lighter "dunia umroh" content (Badal Umrah, Umrah savings, manasik guides).

This repo is deliberately just the buildable product surface — prototype UI and Firebase config. Business/reference material (pitch decks, financial models, market research) lives outside this repo and is intentionally not published here.

## Structure & how to run things

- **`mockup/`** — static HTML/CSS home-screen prototype (`index.html` + `style.css`). No dependencies, no build step. Also deployed as the Firebase Hosting public directory (see below), so it doubles as the live site's source. It fetches Google Fonts and relies on a same-origin stylesheet link, so for local work open it through a server, not as a `file://` URL:
  ```
  cd mockup && python3 -m http.server 8743
  ```
  then browse to `http://localhost:8743/index.html`.

- **`design-canvas/`** — source for the editable Claude Design canvas (`Main.dc.html`, `canvas.json`). This is authored through the `design` skill (invoke `/design` in a Claude Code session), not hand-edited after seeding. To change the design: edit `Main.dc.html` (and `canvas.json` if artboard layout changes), then re-run the skill to re-seed and republish to the same artifact URL. `airmoon-home.html` in this folder is the seeded/published output — never edit it directly; it's regenerated wholesale from `Main.dc.html` on every re-seed.

## Firebase

Project: **airmoon-d9620** (`.firebaserc` sets it as default — `firebase` CLI commands in this repo target it without `--project`).

- **Hosting** serves `mockup/` as static files, live at https://airmoon-d9620.web.app. Deploy after changing anything in `mockup/`:
  ```
  firebase deploy --only hosting
  ```
- **Firestore** exists but has no data model yet — `firestore.rules` denies all reads/writes by default (`allow read, write: if false`). Add explicit `match` blocks per collection as real features (wallet, donations, prayer log) are built; don't loosen the default blanket rule.
- **Auth** has not been configured yet — no sign-in providers are enabled in the console. Decide which providers this app needs (email/password, Google, phone/OTP are the common choices for an Indonesian consumer app) before wiring any login UI, then enable them at console.firebase.google.com/project/airmoon-d9620/authentication.
- **`firebase-config.js`** — the Web SDK config (apiKey, authDomain, etc.) for the registered `airmoon-web` app. This is a client identifier, not a secret; it's fine committed. Import it wherever the app initializes the Firebase SDK — don't regenerate/duplicate it inline elsewhere.

## Design decisions already settled

These came out of iteration with the founder — keep them unless explicitly asked to change:

- **Palette**: dark teal `#0d4d47` / `#0a3630` (primary), gold `#e8b84b` (accent), white `#ffffff` background, pastel tint cards (mint `#e2f1ec`, cream-gold `#fbf0d9`) for stat/service tiles.
- **Type**: Plus Jakarta Sans (Google Fonts) for UI text, Amiri for Arabic verse text.
- **Icons**: inline SVG line icons only — never emoji as icons (emoji were explicitly replaced with SVG after the first pass).
- **Bottom nav**: a floating rounded pill, not a full-width bar.
- **No fake device chrome** in the design-canvas artboard (no drawn iOS status bar/notch) — that's a `design` skill convention, kept even though the earlier `mockup/` HTML does draw one.
- **Visual reference**: `Deck/Moon - Sequoia .pdf` (and the sibling deck files) — the teal/gold palette, arabesque line-pattern accents, and card-based layout are intentionally derived from this deck, not invented fresh.
