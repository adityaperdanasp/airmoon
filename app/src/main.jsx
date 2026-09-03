import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import { ToastProvider } from './context/ToastContext';

// Registered unconditionally now (not just when someone opts into prayer
// notifications, see lib/notifications.js) so its offline-caching fetch
// handler actually runs for every visitor — see the "Offline reading"
// section at the bottom of public/firebase-messaging-sw.js. Registering
// the same scriptURL+scope twice is a no-op (the browser just hands back
// the existing registration), so this doesn't conflict with that other
// call site. Best-effort: unsupported browsers just don't get offline
// caching or notifications, nothing else in the app depends on this.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        // The browser only checks for a new SW script on its own timing
        // (roughly once a day, or on a fresh navigation) — someone who
        // just leaves the installed PWA open for a while, or reopens it
        // from a home-screen icon without a full navigation, could sit on
        // a stale worker far longer than that. A manual update() check
        // whenever the tab becomes visible again closes that gap without
        // needing to poll constantly.
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') registration.update();
        });
      })
      .catch(() => {});

    // firebase-messaging-sw.js's install handler already calls
    // self.skipWaiting() and activate calls clients.claim() — together
    // those make a newly-installed worker take over immediately instead
    // of waiting for every open tab to fully close first. This is the
    // other half: once that handover actually happens (controllerchange),
    // the *already-loaded* page is still running whatever JS it loaded
    // under the old worker — a one-time reload is what actually puts it
    // on the new code/cache instead of silently continuing on stale
    // assets until the next manual refresh. Guarded so a controllerchange
    // firing more than once (shouldn't normally happen) can't reload-loop.
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LangProvider>
        <ToastProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </LangProvider>
    </ThemeProvider>
  </StrictMode>
);
