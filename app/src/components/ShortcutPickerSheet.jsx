import { useState } from 'react';
import Portal from './Portal';
import SheetDragHandle from './SheetDragHandle';
import { useEscapeKey } from '../lib/useEscapeKey';
import { useSwipeDismiss } from '../lib/useSwipeDismiss';
import { useLang } from '../context/LangContext';
import { SECTIONS, CORE_ITEMS, ALL_SHORTCUT_ITEMS } from './featureCatalog';
import { MAX_HOME_SHORTCUTS } from '../lib/homeShortcuts';

// Bottom sheet for choosing what Home's "Jelajahi" grid shows. Top half is
// the current picks (reorder with ↑ ↓, remove with ×), bottom half is the
// whole catalog grouped like Lainnya, tapping a row adds/removes it.
// Nothing is saved until "Simpan", so closing the sheet cancels.
export default function ShortcutPickerSheet({ initial, onSave, onReset, onClose }) {
  const { t } = useLang();
  const [picked, setPicked] = useState(initial);
  useEscapeKey(onClose);
  // Only the handle strip drags the sheet — the body scrolls.
  const { dragY, dragging, handlers } = useSwipeDismiss(onClose);

  const byTo = Object.fromEntries(ALL_SHORTCUT_ITEMS.map((it) => [it.to, it]));
  const labelFor = (it) => (it.key ? t(it.key) : it.label);
  const full = picked.length >= MAX_HOME_SHORTCUTS;

  function toggle(to) {
    setPicked((cur) => (cur.includes(to) ? cur.filter((x) => x !== to) : cur.length >= MAX_HOME_SHORTCUTS ? cur : [...cur, to]));
  }
  function move(i, dir) {
    setPicked((cur) => {
      const j = i + dir;
      if (j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  const groups = [{ title: 'Utama', items: CORE_ITEMS }, ...SECTIONS];
  const iconBtn = { width: 28, height: 28, borderRadius: 8, border: 'none', background: 'var(--bg)', color: 'var(--muted)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 };

  return (
    <Portal>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 52, display: 'flex', alignItems: 'flex-end' }}>
        <div
          role="dialog"
          aria-label="Atur pintasan Jelajahi"
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: 'var(--sheet)', borderRadius: '20px 20px 0 0', maxHeight: '85dvh', display: 'flex', flexDirection: 'column', transform: `translateY(${dragY}px)`, transition: dragging ? 'none' : 'transform var(--dur-2) var(--ease)' }}
        >
          <div {...handlers} style={{ padding: '10px 20px 4px' }}>
            <SheetDragHandle />
            <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 800 }}>Atur Pintasan Jelajahi</div>
            <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
              Pilih sampai {MAX_HOME_SHORTCUTS} fitur favoritmu · {picked.length}/{MAX_HOME_SHORTCUTS}
            </div>
          </div>

          <div style={{ overflowY: 'auto', padding: '8px 16px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>Urutan di Home</span>
              {picked.length === 0 && <span style={{ fontSize: 12, color: 'var(--muted)' }}>Belum ada. Pilih dari daftar di bawah.</span>}
              {picked.map((to, i) => {
                const it = byTo[to];
                if (!it) return null;
                return (
                  <div key={to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 12, background: 'var(--mint-soft)' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: it.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>{it.node}</div>
                    <span style={{ flex: 1, fontSize: 12.5, fontWeight: 700 }}>{labelFor(it)}</span>
                    <button style={iconBtn} onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Naikkan ${labelFor(it)}`}>↑</button>
                    <button style={iconBtn} onClick={() => move(i, 1)} disabled={i === picked.length - 1} aria-label={`Turunkan ${labelFor(it)}`}>↓</button>
                    <button style={iconBtn} onClick={() => toggle(to)} aria-label={`Hapus ${labelFor(it)} dari pintasan`}>×</button>
                  </div>
                );
              })}
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Tombol "Semua" selalu ada di ujung.</span>
            </div>

            {groups.map((g) => (
              <div key={g.title} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>{g.title}</span>
                {g.items.map((it) => {
                  const on = picked.includes(it.to);
                  const disabled = !on && full;
                  return (
                    <button
                      key={it.to}
                      onClick={() => toggle(it.to)}
                      disabled={disabled}
                      aria-pressed={on}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 12, border: 'none', background: 'transparent', color: 'inherit', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1, textAlign: 'left', fontFamily: 'inherit' }}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: it.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>{it.node}</div>
                      <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>{labelFor(it)}</span>
                      <span
                        aria-hidden="true"
                        style={{ width: 22, height: 22, borderRadius: '50%', border: on ? 'none' : '1.5px solid var(--border)', background: on ? 'var(--primary)' : 'transparent', color: 'var(--on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}
                      >
                        {on ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, padding: '10px 16px calc(14px + env(safe-area-inset-bottom))', borderTop: '1px solid var(--border)' }}>
            <button className="btn-outline" style={{ width: 'auto', padding: '0 16px', whiteSpace: 'nowrap' }} onClick={() => { setPicked(onReset()); }}>
              Atur Ulang
            </button>
            <button className="btn" onClick={() => onSave(picked)}>Simpan</button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
