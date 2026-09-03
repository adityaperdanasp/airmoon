import { useEffect, useState } from 'react';
import Portal from './Portal';

// A thin banner while the device has no network — before this, losing
// connection was silent: content kept rendering from the service worker's
// offline cache (see firebase-messaging-sw.js) with no signal that it
// might be stale, which could read as a bug ("why isn't this updating?")
// rather than the expected offline behavior. Portalled to document.body
// (same reasoning as every other fixed-position element in this app —
// see Portal.jsx) and safe-area-aware since it pins to the very top,
// right under the iOS status bar/notch.
export default function OfflineBanner() {
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);

  useEffect(() => {
    function goOffline() {
      setOffline(true);
    }
    function goOnline() {
      setOffline(false);
    }
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <Portal>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 70,
          padding: 'calc(8px + env(safe-area-inset-top)) 16px 8px',
          background: 'var(--gold-ink)',
          color: 'var(--on-gold)',
          fontSize: 11.5,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        📡 Sedang offline — sebagian konten ditampilkan dari cache
      </div>
    </Portal>
  );
}
