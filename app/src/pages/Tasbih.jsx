import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import ConfirmDialog from '../components/ConfirmDialog';
import TasbihShareModal from '../components/TasbihShareModal';
import { useToast } from '../context/ToastContext';
import { useEscapeKey } from '../lib/useEscapeKey';
import { useSwipeDismiss } from '../lib/useSwipeDismiss';
import Portal from '../components/Portal';
import { DZIKIR_PHRASES, TARGETS, loadCounts, saveCounts, loadCustomPhrases, addCustomPhrase, removeCustomPhrase } from '../lib/tasbih';

function AddPhraseSheet({ onClose, onAdd }) {
  const [label, setLabel] = useState('');
  const [arab, setArab] = useState('');
  const [arti, setArti] = useState('');
  useEscapeKey(onClose);
  const { dragY, dragging, handlers } = useSwipeDismiss(onClose);

  return (
    <Portal>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
        <div onClick={(e) => e.stopPropagation()} {...handlers} style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: 'var(--card)', borderRadius: '20px 20px 0 0', padding: '0 20px 20px', transform: `translateY(${dragY}px)`, transition: dragging ? 'none' : 'transform 0.2s ease' }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border)', margin: '10px auto 16px' }} />
          <span style={{ fontSize: 14, fontWeight: 800, display: 'block', marginBottom: 12 }}>Tambah Dzikir Sendiri</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Nama dzikir (wajib) — misal: Shalawat"
              autoFocus
              style={{ padding: '11px 13px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13 }}
            />
            <input
              value={arab}
              onChange={(e) => setArab(e.target.value)}
              placeholder="Teks Arab (opsional)"
              dir="rtl"
              style={{ padding: '11px 13px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 15, fontFamily: "'Amiri', serif" }}
            />
            <input
              value={arti}
              onChange={(e) => setArti(e.target.value)}
              placeholder="Arti (opsional)"
              style={{ padding: '11px 13px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button className="btn-outline" style={{ flex: 1 }} onClick={onClose}>Batal</button>
            <button
              className="btn"
              style={{ flex: 1 }}
              disabled={!label.trim()}
              onClick={() => onAdd({ label: label.trim(), arab: arab.trim(), arti: arti.trim() })}
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

function getLastPhrase() {
  return localStorage.getItem('airmoon-tasbih-phrase') || DZIKIR_PHRASES[0].id;
}
function getLastTarget() {
  const saved = Number(localStorage.getItem('airmoon-tasbih-target'));
  return TARGETS.includes(saved) ? saved : 33;
}

const RING_R = 92;
const RING_CIRC = 2 * Math.PI * RING_R;

export default function Tasbih() {
  const { showToast } = useToast();
  const [counts, setCounts] = useState(() => loadCounts());
  const [customPhrases, setCustomPhrases] = useState(() => loadCustomPhrases());
  const [phraseId, setPhraseId] = useState(getLastPhrase);
  const [target, setTarget] = useState(getLastTarget);
  const [pulse, setPulse] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAddPhrase, setShowAddPhrase] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const allPhrases = [...DZIKIR_PHRASES, ...customPhrases];
  const phrase = allPhrases.find((p) => p.id === phraseId) || DZIKIR_PHRASES[0];
  const count = counts[phraseId] || 0;
  const inLap = count % target;
  const laps = Math.floor(count / target);
  const progress = inLap === 0 && count > 0 ? 1 : inLap / target;

  useEffect(() => {
    localStorage.setItem('airmoon-tasbih-phrase', phraseId);
  }, [phraseId]);
  useEffect(() => {
    localStorage.setItem('airmoon-tasbih-target', String(target));
  }, [target]);

  function updateCount(next) {
    setCounts((prev) => {
      const merged = { ...prev, [phraseId]: Math.max(0, next) };
      saveCounts(merged);
      return merged;
    });
  }

  function tap() {
    const next = count + 1;
    updateCount(next);
    // A slightly stronger buzz right when a lap completes (33/99/100 etc.)
    // gives the same "felt it complete a round" feedback a physical
    // tasbih's bead-back-to-start gives, plain haptic tick otherwise.
    if (navigator.vibrate) navigator.vibrate(next % target === 0 ? [30, 40, 30] : 12);
    setPulse(true);
    setTimeout(() => setPulse(false), 140);
  }

  function undo() {
    if (count === 0) return;
    updateCount(count - 1);
  }

  function reset() {
    updateCount(0);
  }

  function handleAddPhrase({ label, arab, arti }) {
    const id = addCustomPhrase({ label, arab, arti });
    setCustomPhrases(loadCustomPhrases());
    setPhraseId(id);
    setShowAddPhrase(false);
    showToast('Dzikir baru ditambahkan');
  }

  function handleRemovePhrase() {
    removeCustomPhrase(phraseId);
    setCustomPhrases(loadCustomPhrases());
    setCounts((prev) => {
      const { [phraseId]: _removed, ...rest } = prev;
      saveCounts(rest);
      return rest;
    });
    setPhraseId(DZIKIR_PHRASES[0].id);
    setShowRemoveConfirm(false);
    showToast('Dzikir dihapus');
  }

  return (
    <div className="screen">
      <div className="screen-content" style={{ paddingBottom: 'calc(40px + env(safe-area-inset-bottom))' }}>
        <TopBar title="Tasbih Digital" subtitle="Ketuk untuk menghitung" />

        <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {allPhrases.map((p) => (
            <button
              key={p.id}
              onClick={() => setPhraseId(p.id)}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: p.id === phraseId ? 'none' : '1px solid var(--border)',
                color: p.id === phraseId ? 'var(--on-primary)' : 'var(--ink)',
                background: p.id === phraseId ? 'var(--primary)' : 'var(--card)',
              }}
            >
              {p.label}
              {(counts[p.id] || 0) > 0 && (
                <span style={{ marginLeft: 6, opacity: 0.8 }}>· {counts[p.id]}</span>
              )}
            </button>
          ))}
          <button
            onClick={() => setShowAddPhrase(true)}
            aria-label="Tambah dzikir sendiri"
            style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%', border: '1px dashed var(--border)', background: 'none', color: 'var(--muted)', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}
          >
            +
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 6 }}>
          {phrase.arab && <span style={{ fontFamily: "'Amiri', serif", fontSize: 26 }}>{phrase.arab}</span>}
          {phrase.arti && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{phrase.arti}</span>}
          {phrase.custom && (
            <button
              onClick={() => setShowRemoveConfirm(true)}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 10.5, textDecoration: 'underline', cursor: 'pointer', padding: 0, marginTop: 2 }}
            >
              Hapus dzikir ini
            </button>
          )}
        </div>

        <button
          onClick={tap}
          aria-label="Tambah hitungan"
          style={{
            position: 'relative',
            width: 210,
            height: 210,
            margin: '18px auto 4px',
            borderRadius: '50%',
            border: 'none',
            background: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: pulse ? 'scale(0.96)' : 'scale(1)',
            transition: 'transform 0.12s ease',
          }}
        >
          <svg width="210" height="210" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="105" cy="105" r={RING_R} fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="105"
              cy="105"
              r={RING_R}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={RING_CIRC * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.15s ease' }}
            />
          </svg>
          <div
            style={{
              width: 168,
              height: 168,
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              background: 'linear-gradient(160deg, var(--primary), var(--primary-dark))',
              boxShadow: '0 10px 24px rgba(13,77,71,0.28)',
            }}
          >
            <span style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{count}</span>
            <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
              {laps > 0 ? `${laps}x ${target} selesai` : `dari ${target}`}
            </span>
          </div>
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {TARGETS.map((n) => (
            <button
              key={n}
              onClick={() => setTarget(n)}
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: n === target ? 'none' : '1px solid var(--border)',
                color: n === target ? '#fff' : 'var(--muted)',
                background: n === target ? 'var(--primary-dark)' : 'transparent',
              }}
            >
              {n}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 10 }}>
          <button className="btn-outline" style={{ flex: 'none', padding: '10px 20px' }} onClick={undo} disabled={count === 0}>
            −1
          </button>
          <button className="btn-outline" style={{ flex: 'none', padding: '10px 20px', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => setShowResetConfirm(true)} disabled={count === 0}>
            Reset
          </button>
          <button className="btn-outline" style={{ flex: 'none', padding: '10px 16px' }} onClick={() => setShowShare(true)} disabled={count === 0} aria-label="Bagikan progress">
            ↗
          </button>
        </div>
      </div>

      {showAddPhrase && <AddPhraseSheet onClose={() => setShowAddPhrase(false)} onAdd={handleAddPhrase} />}

      {showShare && (
        <TasbihShareModal
          phraseLabel={phrase.label}
          phraseArab={phrase.arab}
          count={count}
          laps={laps}
          target={target}
          onClose={() => setShowShare(false)}
        />
      )}

      {showRemoveConfirm && (
        <ConfirmDialog
          title="Hapus dzikir ini?"
          message={`"${phrase.label}" dan hitungannya bakal dihapus permanen.`}
          confirmLabel="Ya, Hapus"
          danger
          onCancel={() => setShowRemoveConfirm(false)}
          onConfirm={handleRemovePhrase}
        />
      )}

      {showResetConfirm && (
        <ConfirmDialog
          title="Reset hitungan?"
          message={`Hitungan ${phrase.label} (${count}) bakal balik ke 0. Ini gak bisa dibatalin.`}
          confirmLabel="Ya, Reset"
          danger
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={() => {
            reset();
            showToast('Hitungan direset');
            setShowResetConfirm(false);
          }}
        />
      )}
    </div>
  );
}
