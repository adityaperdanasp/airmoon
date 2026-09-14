import { useEffect } from 'react';

// Per-page document title (2026-09-14) — every route showed the same
// bare "airmoon" tab title before this; no page ever called
// `document.title`. Restores the app's default title on unmount so
// navigating away doesn't leave a stale title behind on whatever page
// mounts next without calling this itself.
//
// Deliberately NOT a claim of full per-route SEO/social-preview
// support — this is a client-only SPA with no prerendering/SSR, so
// Facebook/WhatsApp-style crawlers that don't execute JS still only
// ever see index.html's single global `og:title`/`og:image`. A real
// per-route social preview would need a prerendering step this app
// doesn't have; this hook only helps the browser tab, bookmarks, and
// any crawler that does run JS (e.g. Twitter/X in some cases).
export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — airmoon` : 'airmoon';
    return () => {
      document.title = previous;
    };
  }, [title]);
}
