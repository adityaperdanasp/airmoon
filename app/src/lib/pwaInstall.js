// Chrome/Android's `beforeinstallprompt` event fires once, early, and only
// if the listener is already attached when it does — so this is captured
// at module-import time (a top-level side effect, not inside a component
// effect) rather than risking a component mounting too late to catch it.
// A tiny pub-sub lets any number of components (Home's dismissible banner,
// Pengaturan's persistent entry) react to the same single captured event.
import { useEffect, useState } from 'react';

let deferredPrompt = null;
let installed = false;
const listeners = new Set();

function currentState() {
  return { canInstall: !!deferredPrompt, installed };
}

function notify() {
  const state = currentState();
  listeners.forEach((cb) => cb(state));
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // stop Chrome's own mini-infobar so this app's own UI decides when/how to ask
    deferredPrompt = e;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredPrompt = null;
    notify();
  });
}

export function isStandalone() {
  if (typeof window === 'undefined') return false;
  // iOS Safari has no `display-mode` media query support for this; it
  // exposes `navigator.standalone` instead (true once launched from a
  // home-screen icon) — check both since which one applies depends on
  // platform, not on which install path was used.
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// iOS Safari never fires beforeinstallprompt at all (no such API) — "Add
// to Home Screen" only exists behind the Share sheet there, so that's a
// static instructions card instead of a real prompt button.
export function isIosSafari() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

export function usePwaInstall() {
  const [state, setState] = useState(currentState);
  useEffect(() => {
    listeners.add(setState);
    setState(currentState());
    return () => listeners.delete(setState);
  }, []);
  return state;
}

// Resolves 'accepted' | 'dismissed' | 'unavailable' — the captured event
// can only be used once, so it's cleared either way afterward.
export async function promptInstall() {
  if (!deferredPrompt) return 'unavailable';
  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  promptEvent.prompt();
  const choice = await promptEvent.userChoice;
  notify();
  return choice.outcome;
}
