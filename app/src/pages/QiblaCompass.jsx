import { useLang } from '../context/LangContext';
import { useQibla } from '../lib/useQibla';
import TopBar from '../components/TopBar';

export default function QiblaCompass() {
  const { t } = useLang();
  const { locStatus, qibla, heading, headingStatus, requestHeadingPermission } = useQibla();

  const hasHeading = headingStatus === 'granted' && heading != null;
  // 0deg = arrow points straight up on screen. When the arrow points up,
  // the phone's top edge is aimed at the Kaaba.
  const needleRotation = qibla ? (hasHeading ? qibla.bearing - heading : qibla.bearing) : 0;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('kiblat_title')} />

        {locStatus === 'loading' && (
          <div className="center" style={{ minHeight: 240 }}>
            <div className="spinner" />
          </div>
        )}

        {locStatus === 'denied' && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
            {t('kiblat_loc_denied')}
          </div>
        )}

        {locStatus === 'error' && (
          <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
            {t('kiblat_loc_error')}
          </div>
        )}

        {locStatus === 'ready' && qibla && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '12px 0' }}>
              <div style={{ position: 'relative', width: 240, height: 240 }}>
                <svg width="240" height="240" viewBox="0 0 240 240">
                  <circle cx="120" cy="120" r="112" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
                  {Array.from({ length: 12 }).map((_, i) => {
                    const a = (i * 30 * Math.PI) / 180;
                    const isCardinal = i % 3 === 0;
                    const r1 = isCardinal ? 92 : 100;
                    const x1 = 120 + r1 * Math.sin(a);
                    const y1 = 120 - r1 * Math.cos(a);
                    const x2 = 120 + 112 * Math.sin(a);
                    const y2 = 120 - 112 * Math.cos(a);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-soft)" strokeWidth={isCardinal ? 2 : 1} />;
                  })}
                  <text x="120" y="34" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--muted)">N</text>
                  <text x="206" y="125" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--muted)">E</text>
                  <text x="120" y="216" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--muted)">S</text>
                  <text x="34" y="125" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--muted)">W</text>
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `rotate(${needleRotation}deg)`,
                    transition: 'transform 0.15s linear',
                  }}
                >
                  <svg width="240" height="240" viewBox="0 0 240 240">
                    <path d="M120 30 L133 76 L120 64 L107 76 Z" fill="var(--primary)" />
                    <line x1="120" y1="64" x2="120" y2="176" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="120" cy="120" r="7" fill="var(--primary)" />
                    <text x="120" y="66" textAnchor="middle" fontSize="18" style={{ transform: `rotate(${-needleRotation}deg)`, transformOrigin: '120px 66px' }}>
                      🕋
                    </text>
                  </svg>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{Math.round(qibla.bearing)}°</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {t('kiblat_dari_utara')} · {Math.round(qibla.distanceKm).toLocaleString('id-ID')} km {t('kiblat_dari_kabah')}
                </div>
              </div>
            </div>

            {headingStatus === 'needs-permission' && (
              <button className="btn" onClick={requestHeadingPermission}>
                {t('kiblat_aktifkan_kompas')}
              </button>
            )}

            {headingStatus === 'denied' && (
              <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
                {t('kiblat_kompas_denied')}
              </div>
            )}

            {(headingStatus === 'unsupported' || (headingStatus === 'granted' && heading == null)) && (
              <div className="card" style={{ padding: 16, fontSize: 12.5, lineHeight: 1.5 }}>
                {t('kiblat_kompas_unsupported')}
              </div>
            )}

            {hasHeading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
                  <path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>{t('kiblat_info')}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
