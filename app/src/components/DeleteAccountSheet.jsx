import { useState } from 'react';
import Portal from './Portal';
import { useEscapeKey } from '../lib/useEscapeKey';
import { useSwipeDismiss } from '../lib/useSwipeDismiss';
import { useAuth } from '../context/AuthContext';

// Deleting an account needs a fresh sign-in first (Firebase Auth's
// auth/requires-recent-login) — for an email/password account that means
// asking for the password again right here (no other way to reauthenticate
// one), for Google/Facebook it means re-triggering that provider's OAuth
// popup instead, no password field shown at all. See AuthContext.jsx's
// deleteAccount() for the actual reauth + deletion logic and why only the
// top-level users/{uid} doc — not every subcollection — actually gets
// removed, which is why the message below is specific about that rather
// than promising "all your data is erased".
export default function DeleteAccountSheet({ onClose, onDeleted }) {
  const { user, deleteAccount } = useAuth();
  const providerId = user?.providerData?.[0]?.providerId;
  const needsPassword = providerId === 'password';
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEscapeKey(onClose);
  const { dragY, dragging, handlers } = useSwipeDismiss(onClose);

  async function handleDelete() {
    setBusy(true);
    setError('');
    try {
      await deleteAccount(needsPassword ? password : undefined);
      onDeleted();
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Password salah.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Dibatalkan sebelum konfirmasi selesai.');
      } else {
        setError(err.message || 'Gagal menghapus akun.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Portal>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          {...handlers}
          style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: 'var(--card)', borderRadius: '20px 20px 0 0', padding: '0 20px 20px', transform: `translateY(${dragY}px)`, transition: dragging ? 'none' : 'transform 0.2s ease' }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border)', margin: '10px auto 16px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--danger)' }}>Hapus Akun</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
              Akun ini bakal dihapus permanen dan gak bisa dipakai login lagi. Data profil (dzikir streak, tabungan umroh, ayat favorit, bookmark) ikut terhapus. Riwayat sedekah tetap tersimpan di server buat keperluan audit pembayaran, tapi gak bisa kamu akses lagi setelah akun ini dihapus.
            </span>
          </div>

          {needsPassword && (
            <input
              type="password"
              placeholder="Masukkan password buat konfirmasi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13, marginBottom: 12, boxSizing: 'border-box' }}
            />
          )}
          {!needsPassword && (
            <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: '0 0 12px' }}>
              Kamu bakal diminta konfirmasi ulang lewat {providerId === 'google.com' ? 'Google' : 'Facebook'} sebelum akun dihapus.
            </p>
          )}

          {error && <p style={{ fontSize: 11.5, color: 'var(--danger)', margin: '0 0 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-outline" style={{ flex: 1 }} onClick={onClose} disabled={busy}>
              Batal
            </button>
            <button
              className="btn-outline"
              style={{ flex: 1, color: 'var(--on-danger)', background: 'var(--danger)', borderColor: 'var(--danger)' }}
              onClick={handleDelete}
              disabled={busy || (needsPassword && !password)}
            >
              {busy ? 'Menghapus...' : 'Ya, Hapus Akun'}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
