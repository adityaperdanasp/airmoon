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
    navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => {});
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
