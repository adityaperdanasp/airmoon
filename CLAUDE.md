# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this directory is

`airmoon` is a Muslim app project (working name from the founder's earlier pitch decks). Core planned features: Qur'an reader, prayer times (location-based), mosque electricity donation routed directly to a PLN customer ID (not a committee bank account), and lighter "dunia umroh" content (Badal Umrah, Umrah savings, manasik guides).

Most of this directory is the founder's reference material, not app code: `Deck/` (pitch decks — see below), `Doc/`, `Grab FR 2023/`, `Grab Important FS/`, `Baznaz & Muslim Populations/`, `Consultant/`, `Pricing/`, and the loose screenshots/PDFs at the top level are financial-modeling and market-research references, unrelated to any build step. The actual product work lives in `mockup/` and `design-canvas/`.

## Structure & how to run things

- **`mockup/`** — static HTML/CSS home-screen prototype (`index.html` + `style.css`). No dependencies, no build step. It fetches Google Fonts and relies on a same-origin stylesheet link, so open it through a local server, not as a `file://` URL:
  ```
  cd mockup && python3 -m http.server 8743
  ```
  then browse to `http://localhost:8743/index.html`.

- **`design-canvas/`** — source for the editable Claude Design canvas (`Main.dc.html`, `canvas.json`). This is authored through the `design` skill (invoke `/design` in a Claude Code session), not hand-edited after seeding. To change the design: edit `Main.dc.html` (and `canvas.json` if artboard layout changes), then re-run the skill to re-seed and republish to the same artifact URL. `airmoon-home.html` in this folder is the seeded/published output — never edit it directly; it's regenerated wholesale from `Main.dc.html` on every re-seed.

## Design decisions already settled

These came out of iteration with the founder — keep them unless explicitly asked to change:

- **Palette**: dark teal `#0d4d47` / `#0a3630` (primary), gold `#e8b84b` (accent), white `#ffffff` background, pastel tint cards (mint `#e2f1ec`, cream-gold `#fbf0d9`) for stat/service tiles.
- **Type**: Plus Jakarta Sans (Google Fonts) for UI text, Amiri for Arabic verse text.
- **Icons**: inline SVG line icons only — never emoji as icons (emoji were explicitly replaced with SVG after the first pass).
- **Bottom nav**: a floating rounded pill, not a full-width bar.
- **No fake device chrome** in the design-canvas artboard (no drawn iOS status bar/notch) — that's a `design` skill convention, kept even though the earlier `mockup/` HTML does draw one.
- **Visual reference**: `Deck/Moon - Sequoia .pdf` (and the sibling deck files) — the teal/gold palette, arabesque line-pattern accents, and card-based layout are intentionally derived from this deck, not invented fresh.
