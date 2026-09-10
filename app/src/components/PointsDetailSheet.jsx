import Portal from './Portal';
import { useEscapeKey } from '../lib/useEscapeKey';
import { useSwipeDismiss } from '../lib/useSwipeDismiss';
import { MedalIcon } from './serviceIcons';

const DAY_LABEL_FMT = new Intl.DateTimeFormat('id-ID', { weekday: 'short' });

// Bottom sheet for Poin & Medali's detail view — was an absolutely-
// positioned dropdown anchored under the badge itself, which read fine
// while it only held 2-3 short lines, but grew tall enough (tier +
// progress bar + 7-day chart + monthly comparison + share button) to
// visually collide with whatever sits below Home's header ("nabrak"
// bug, founder-reported 2026-09-07 with a real screenshot). Converted to
// the same Portal-based bottom-sheet shell every other sheet in this app
// already uses (CollectionPickerSheet, TafsirSheet, etc.) — a sheet has
// its own full-height scroll room and can never overlap page content
// the way a dropdown anchored to a small badge can.
export default function PointsDetailSheet({ points, tier, next, recentDays, monthlyCompare, onShareMedal, onClose }) {
  useEscapeKey(onClose);
  const { dragY, dragging, handlers } = useSwipeDismiss(onClose);

  return (
    <Portal>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 52, display: 'flex', alignItems: 'flex-end' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          {...handlers}
          style={{
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
            background: 'var(--card)',
            borderRadius: '20px 20px 0 0',
            padding: '0 20px 20px',
            transform: `translateY(${dragY}px)`,
            transition: dragging ? 'none' : 'transform 0.2s ease',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border)', margin: '10px auto 14px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {tier ? (
                <>
                  <MedalIcon tier={tier.tier} size={24} />
                  Tier {tier.label}
                </>
              ) : (
                'Belum ada tier'
              )}
            </span>
            <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
              {next
                ? `${next.points - points} poin lagi menuju ${next.label}`
                : 'Tier tertinggi tercapai — Alhamdulillah!'}
            </span>

            <div style={{ height: 7, borderRadius: 999, background: 'var(--border)', overflow: 'hidden', marginTop: 4 }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: 999,
                  width: next
                    ? `${Math.min(100, ((points - (tier?.points || 0)) / (next.points - (tier?.points || 0))) * 100)}%`
                    : '100%',
                  background: tier?.color || 'var(--primary)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.4, marginTop: 4 }}>
              Poin dari checklist Amalan Harian &amp; login harian.
            </span>

            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                Riwayat 7 Hari
              </span>
              {!recentDays ? (
                <div className="spinner" style={{ width: 16, height: 16, margin: '4px auto' }} />
              ) : (
                <div style={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
                  {recentDays.map((d) => {
                    const dayDate = new Date(`${d.dateKey}T00:00:00`);
                    const pct = d.max > 0 ? d.score / d.max : 0;
                    return (
                      <div key={d.dateKey} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }} title={`${d.score}/${d.max} poin`}>
                        <div style={{ width: '100%', height: 42, borderRadius: 6, background: 'var(--border)', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                          <div style={{ width: '100%', height: `${Math.max(pct * 100, d.score > 0 ? 12 : 0)}%`, background: 'var(--primary)', borderRadius: 6 }} />
                        </div>
                        <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>{DAY_LABEL_FMT.format(dayDate)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {monthlyCompare && (
              <div style={{ marginTop: 6, paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Bulan ini vs bulan lalu</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: monthlyCompare.thisMonth >= monthlyCompare.lastMonth ? 'var(--success)' : 'var(--danger)',
                  }}
                >
                  {monthlyCompare.thisMonth} vs {monthlyCompare.lastMonth}{' '}
                  {monthlyCompare.thisMonth >= monthlyCompare.lastMonth ? '▲' : '▼'}
                </span>
              </div>
            )}

            {tier && (
              <button onClick={onShareMedal} className="btn-outline" style={{ marginTop: 10, padding: '11px 0' }}>
                Bagikan Medali
              </button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
