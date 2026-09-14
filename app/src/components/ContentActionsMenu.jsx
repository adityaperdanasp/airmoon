import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { submitContentReport } from '../lib/contentReports';
import { blockUser } from '../lib/blockedUsers';

// Laporkan & Blokir (2026-09-14) — a small "⋯" menu reused across the
// forum and Wall of Gratitude, the two places this app has genuinely
// public user-generated content. "Laporkan" is real moderation (see
// lib/contentReports.js — the founder reviews via console); "Blokir" is
// a personal client-side filter (lib/blockedUsers.js), not moderation —
// it only ever changes what THIS device renders, never anyone else's.
export default function ContentActionsMenu({ contentType, contentPath, authorUid, authorName, onBlocked }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user || user.uid === authorUid) return null; // nothing to report/block on your own content

  async function handleReport(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await submitContentReport(user.uid, { contentType, contentPath, reason });
      showToast('Laporan terkirim, makasih udah bantu jaga komunitas.');
      setOpen(false);
      setReporting(false);
      setReason('');
    } catch (err) {
      showToast(err.message || 'Gagal kirim laporan.', { type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  function handleBlock() {
    blockUser(authorUid);
    showToast(`${authorName || 'Pengguna ini'} udah gak akan muncul lagi buat kamu.`);
    setOpen(false);
    onBlocked?.();
  }

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        style={{ background: 'none', border: 'none', color: 'var(--muted-soft)', fontSize: 16, cursor: 'pointer', padding: '2px 4px', lineHeight: 1 }}
      >
        ⋯
      </button>

      {open && (
        <div
          className="card"
          style={{ position: 'absolute', top: '100%', right: 0, zIndex: 5, marginTop: 4, padding: 10, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        >
          {!reporting ? (
            <>
              <button
                onClick={() => setReporting(true)}
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: '4px 2px', fontSize: 12.5, color: 'var(--ink)', cursor: 'pointer' }}
              >
                🚩 Laporkan
              </button>
              <button
                onClick={handleBlock}
                style={{ background: 'none', border: 'none', textAlign: 'left', padding: '4px 2px', fontSize: 12.5, color: 'var(--ink)', cursor: 'pointer' }}
              >
                🚫 Blokir {authorName || 'pengguna ini'}
              </button>
            </>
          ) : (
            <form onSubmit={handleReport} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                autoFocus
                placeholder="Kenapa dilaporkan? (opsional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={500}
                style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 11.5 }}
              />
              <button className="btn" type="submit" disabled={submitting} style={{ padding: '6px 0', fontSize: 11.5 }}>
                {submitting ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
