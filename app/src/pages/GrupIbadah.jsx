import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import { watchUserProfile } from '../lib/profile';
import {
  createGroup, joinGroupByCode, watchMyGroups, watchGroup,
  reportMyGroupStats, watchGroupMemberStats, setGroupChallenge, clearGroupChallenge,
} from '../lib/groups';

// Grup Ibadah (2026-09-12) — small circles (family/pengajian) sharing
// dzikir/reading-streak numbers, meant especially for Ramadan-style
// mutual encouragement. Deliberately a lean MVP: no chat, no admin
// controls beyond create/join. See lib/groups.js's own header for the
// full scoping reasoning.
function GroupDetail({ groupId, onBack }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challengeTarget, setChallengeTarget] = useState('20');

  useEffect(() => watchGroup(groupId, setGroup), [groupId]);
  useEffect(() => watchGroupMemberStats(groupId, setMembers), [groupId]);

  // Self-reports on open, not live — see lib/groups.js's own note on why.
  useEffect(() => {
    if (!user) return;
    return watchUserProfile(user.uid, (userData) => {
      reportMyGroupStats(groupId, user, userData);
    });
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

  const memberTotal = (m) => m.readingStreak + m.dzikirPagiStreak + m.dzikirPetangStreak;
  const sorted = [...members].sort((a, b) => memberTotal(b) - memberTotal(a));
  const groupTotal = members.reduce((sum, m) => sum + memberTotal(m), 0);
  const isOwner = user && group?.ownerUid === user.uid;

  async function handleSetChallenge(e) {
    e.preventDefault();
    const target = Number(challengeTarget);
    if (!target || target <= 0) return;
    await setGroupChallenge(groupId, target);
    setShowChallengeForm(false);
    showToast('Tantangan mingguan diset!');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
        ← Semua Grup
      </button>

      {group && (
        <>
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 800 }}>{group.name}</span>
            <div onClick={copyCode} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: 'var(--bg)', cursor: 'pointer' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Kode Undangan</span>
              <span style={{ fontSize: 14, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{copied ? 'Tersalin!' : group.inviteCode}</span>
            </div>
            {/* [PM 2026-09-12] Was copy-only — a one-tap WhatsApp share is
                the realistic way a family/pengajian circle actually
                spreads an invite code, not "copy then paste it somewhere
                yourself". */}
            <button
              className="btn-outline"
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Yuk gabung grup ibadah "${group.name}" di airmoon! Pakai kode: ${group.inviteCode}\n\nBuka airmoon → Lainnya → Grup Ibadah → Gabung Grup.`)}`, '_blank')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              Bagikan Undangan lewat WhatsApp
            </button>
          </div>

          {/* Tantangan Mingguan (2026-09-12) — a single shared target the
              owner sets; progress is just the same memberStats sum
              already computed above, not a separately tracked counter.
              No week-boundary reset logic yet (an MVP scope call) — the
              owner re-sets it manually for a fresh week. */}
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 800 }}>🎯 Tantangan Mingguan</span>
              {isOwner && (
                <button
                  onClick={() => setShowChallengeForm((v) => !v)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  {group.challenge ? 'Ubah' : 'Atur'}
                </button>
              )}
            </div>

            {showChallengeForm && (
              <form onSubmit={handleSetChallenge} style={{ display: 'flex', gap: 8 }}>
                <div className="input-row" style={{ flex: 1 }}>
                  <input type="number" min="1" value={challengeTarget} onChange={(e) => setChallengeTarget(e.target.value)} placeholder="Target total streak (hari)" />
                </div>
                <button className="btn" type="submit" style={{ width: 'auto', padding: '0 16px' }}>Simpan</button>
                {group.challenge && (
                  <button type="button" className="btn-outline" style={{ width: 'auto', padding: '0 14px' }} onClick={() => { clearGroupChallenge(groupId); setShowChallengeForm(false); }}>
                    Hapus
                  </button>
                )}
              </form>
            )}

            {group.challenge ? (
              <>
                <div style={{ height: 7, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, Math.round((groupTotal / group.challenge.target) * 100))}%`, background: 'var(--primary)', transition: 'width var(--dur-3) var(--ease)' }} />
                </div>
                <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                  {groupTotal}/{group.challenge.target} hari gabungan
                  {groupTotal >= group.challenge.target ? ' — Alhamdulillah, tercapai! 🎉' : ''}
                </span>
              </>
            ) : (
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                {isOwner ? 'Belum ada tantangan — atur target streak gabungan minggu ini.' : 'Belum ada tantangan minggu ini.'}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Anggota ({sorted.length})
            </span>
            {sorted.map((m) => (
              <div key={m.uid} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{m.displayName}{m.uid === user?.uid ? ' (kamu)' : ''}</span>
                <div style={{ display: 'flex', gap: 10, fontSize: 10.5, color: 'var(--muted)' }}>
                  {m.readingStreak > 0 && <span>📖 {m.readingStreak}h</span>}
                  {m.dzikirPagiStreak > 0 && <span>🌅 {m.dzikirPagiStreak}h</span>}
                  {m.dzikirPetangStreak > 0 && <span>🌇 {m.dzikirPetangStreak}h</span>}
                  {!m.readingStreak && !m.dzikirPagiStreak && !m.dzikirPetangStreak && <span>Belum ada streak</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function GrupIbadah() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [groups, setGroups] = useState(null);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => watchMyGroups(user?.uid, setGroups), [user?.uid]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!user || busy) return;
    setBusy(true);
    try {
      const { groupId } = await createGroup(user, groupName);
      setGroupName('');
      setShowCreate(false);
      setActiveGroupId(groupId);
      showToast('Grup dibuat!');
    } catch (err) {
      showToast(err.message || 'Gagal bikin grup.', { type: 'danger' });
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    if (!user || busy) return;
    setBusy(true);
    try {
      const groupId = await joinGroupByCode(user, joinCode);
      setJoinCode('');
      setShowJoin(false);
      setActiveGroupId(groupId);
      showToast('Berhasil gabung grup!');
    } catch (err) {
      showToast(err.message || 'Gagal gabung grup.', { type: 'danger' });
    } finally {
      setBusy(false);
    }
  }

  if (activeGroupId) {
    return (
      <div className="screen">
        <div className="screen-content">
          <TopBar title="Grup Ibadah" />
          <GroupDetail groupId={activeGroupId} onBack={() => setActiveGroupId(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Grup Ibadah" />

        {!user ? (
          <p className="state-msg">Masuk dulu buat bikin atau gabung grup.</p>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" style={{ flex: 1 }} onClick={() => { setShowCreate((v) => !v); setShowJoin(false); }}>+ Buat Grup</button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => { setShowJoin((v) => !v); setShowCreate(false); }}>Gabung Grup</button>
            </div>

            {showCreate && (
              <form onSubmit={handleCreate} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="input-row">
                  <input required placeholder="Nama grup (mis. Keluarga Besar)" value={groupName} onChange={(e) => setGroupName(e.target.value)} maxLength={60} />
                </div>
                <button className="btn" type="submit" disabled={busy || !groupName.trim()}>{busy ? 'Membuat...' : 'Buat Grup'}</button>
              </form>
            )}

            {showJoin && (
              <form onSubmit={handleJoin} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="input-row">
                  <input required placeholder="Kode undangan (mis. AB3XYZ)" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} maxLength={6} style={{ textTransform: 'uppercase' }} />
                </div>
                <button className="btn" type="submit" disabled={busy || !joinCode.trim()}>{busy ? 'Bergabung...' : 'Gabung'}</button>
              </form>
            )}

            {groups === null ? null : groups.length === 0 ? (
              <EmptyState icon="👪" title="Belum punya grup" subtitle="Buat grup buat keluarga/circle pengajian kamu, atau gabung pakai kode undangan." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {groups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGroupId(g.id)}
                    className="card"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', color: 'inherit' }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{g.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{g.memberUids.length} anggota</span>
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
