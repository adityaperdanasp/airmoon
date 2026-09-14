import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';
import { hapticTick } from '../lib/haptics';
import {
  createFriendPair, joinFriendPairByCode, watchMyFriendPairs,
  watchFriendPairStats, reportMyWeeklyScore, watchGroupDoc,
} from '../lib/friends';

function FriendPairDetail({ groupId, onBack }) {
  const { user } = useAuth();
  const { t } = useLang();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => watchGroupDoc(groupId, setGroup), [groupId]);
  useEffect(() => watchFriendPairStats(groupId, setMembers), [groupId]);

  // Self-reports on open, same "not live, computed on visit" pattern
  // Grup Ibadah's own reportMyGroupStats uses.
  useEffect(() => {
    if (!user) return;
    reportMyWeeklyScore(groupId, user);
  }, [groupId, user]);

  async function copyCode() {
    if (!group?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard permission denied/unsupported — the code's still visible to copy by hand.
    }
  }

  const sorted = [...members].sort((a, b) => (b.weeklyScore || 0) - (a.weeklyScore || 0));
  const maxScore = Math.max(1, ...members.map((m) => m.weeklyScore || 0));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
        {t('tantangan_semua')}
      </button>

      {group && members.length < 2 && (
        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{t('tantangan_ajak_teman_desc')}</span>
          <div onClick={copyCode} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: 'var(--bg)', cursor: 'pointer' }}>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t('tantangan_kode_undangan')}</span>
            <span style={{ fontSize: 14, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{copied ? t('tersalin') : group.inviteCode}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {t('tantangan_skor_judul')}
        </span>
        {sorted.map((m, i) => (
          <div key={m.uid} className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>
                {i === 0 && sorted.length > 1 ? '🏆 ' : ''}{m.displayName}{m.uid === user?.uid ? ` ${t('tantangan_kamu_suffix')}` : ''}
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)' }}>{m.weeklyScore || 0}</span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ width: `${((m.weeklyScore || 0) / maxScore) * 100}%`, height: '100%', background: 'var(--primary)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tantangan Teman (2026-09-12) — add a friend directly (1:1, no name/
// invite-only-code circle like Grup Ibadah) and compare weekly Amalan
// Harian scores. See lib/friends.js for why this reuses Grup Ibadah's
// exact groups/groupInvites/memberStats data model instead of new
// infrastructure, and why the 2-person cap is client-side only.
export default function TantanganTeman() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useLang();
  const [pairs, setPairs] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => watchMyFriendPairs(user?.uid, setPairs), [user?.uid]);

  async function handleCreate() {
    if (!user || busy) return;
    hapticTick();
    setBusy(true);
    try {
      const { groupId } = await createFriendPair(user);
      setActiveId(groupId);
      showToast(t('tantangan_toast_dibuat'));
    } catch (err) {
      showToast(err.message || t('tantangan_gagal_buat'), { type: 'danger' });
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    if (!user || busy) return;
    hapticTick();
    setBusy(true);
    try {
      const groupId = await joinFriendPairByCode(user, joinCode, 1);
      setJoinCode('');
      setShowJoin(false);
      setActiveId(groupId);
      showToast(t('tantangan_toast_gabung'));
    } catch (err) {
      showToast(err.message || t('tantangan_gagal_gabung'), { type: 'danger' });
    } finally {
      setBusy(false);
    }
  }

  if (activeId) {
    return (
      <div className="screen">
        <div className="screen-content">
          <TopBar title={t('tantangan_title')} />
          <FriendPairDetail groupId={activeId} onBack={() => setActiveId(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('tantangan_title')} />

        {!user ? (
          <p className="state-msg">{t('tantangan_masuk_dulu')}</p>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" style={{ flex: 1 }} onClick={handleCreate} disabled={busy}>{t('tantangan_ajak_teman_btn')}</button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowJoin((v) => !v)}>{t('tantangan_gabung_kode_btn')}</button>
            </div>

            {showJoin && (
              <form onSubmit={handleJoin} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="input-row">
                  <input required placeholder={t('tantangan_placeholder_kode')} value={joinCode} onChange={(e) => setJoinCode(e.target.value)} maxLength={6} style={{ textTransform: 'uppercase' }} />
                </div>
                <button className="btn" type="submit" disabled={busy || !joinCode.trim()}>{busy ? t('tantangan_bergabung') : t('tantangan_gabung')}</button>
              </form>
            )}

            {pairs === null ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <SkeletonCard height={56} radius={14} />
                <SkeletonCard height={56} radius={14} />
              </div>
            ) : pairs.length === 0 ? (
              <EmptyState
                icon="🤝"
                title={t('tantangan_empty_title')}
                subtitle={t('tantangan_empty_subtitle')}
                actionLabel={t('tantangan_empty_action')}
                onAction={handleCreate}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pairs.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveId(p.id)}
                    className="card"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', color: 'inherit' }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.memberUids.length}/2 {t('tantangan_orang_suffix')}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
