import { useState } from 'react';
import { usePwaInstall, isStandalone, isIosSafari, promptInstall } from '../lib/pwaInstall';
import { isNativeApp } from '../lib/notifications';

const DISMISS_KEY = 'airmoon-install-banner-dismissed';

// Two places use this: Home's dismissible banner ("gas" once, then stays
// hidden forever via localStorage — nagging about install repeatedly is
// worse than not asking at all) and Pengaturan's always-there entry
// (variant="settings", no dismiss button — someone opening Settings is
// already browsing, not being interrupted). Renders nothing at all when
// there's genuinely nothing actionable to show: already running as the
// installed PWA, already the native Android app, or a browser that
// neither supports beforeinstallprompt nor is iOS Safari (e.g. desktop
// Firefox) — those have no real "Add to Home Screen" path this app can
// surface either way.
export default function InstallAppCard({ variant = 'banner' }) {
  const { canInstall, installed } = usePwaInstall();
  const [dismissed, setDismissed] = useState(() => variant === 'banner' && localStorage.getItem(DISMISS_KEY) === '1');
  const [busy, setBusy] = useState(false);

  if (isNativeApp() || isStandalone() || installed || dismissed) return null;
  if (!canInstall && !isIosSafari()) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  }

  async function handleInstall() {
    setBusy(true);
    try {
      const outcome = await promptInstall();
      if (outcome !== 'unavailable') dismiss();
    } finally {
      setBusy(false);
    }
  }

  const isBanner = variant === 'banner';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        position: 'relative',
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)' }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--primary)">
          <rect x="4" y="3" width="16" height="18" rx="2.5" strokeWidth="1.6" />
          <path d="M12 8v6M9.5 11.5 12 14l2.5-2.5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.5 18h5" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>Pasang airmoon di Layar Utama</span>
        <span style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.4 }}>
          {isIosSafari() && !canInstall
            ? 'Tap tombol Share, lalu "Add to Home Screen"'
            : 'Akses lebih cepat, notifikasi & baca offline lebih lancar'}
        </span>
      </div>
      {canInstall && (
        <button className="btn" style={{ flexShrink: 0, width: 'auto', padding: '8px 14px', fontSize: 12 }} onClick={handleInstall} disabled={busy}>
          {busy ? '...' : 'Install'}
        </button>
      )}
      {isBanner && (
        <button
          onClick={dismiss}
          aria-label="Tutup"
          style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--muted-soft)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 6l12 12M18 6 6 18" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      )}
    </div>
  );
}
