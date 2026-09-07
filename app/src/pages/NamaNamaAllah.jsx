import { useState } from 'react';
import { asmaulHusna } from '../data/asmaulHusna';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import TopBar from '../components/TopBar';
import AsmaulHusnaShareModal from '../components/AsmaulHusnaShareModal';

export default function NamaNamaAllah() {
  const { t } = useLang();
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);
  const [shareName, setShareName] = useState(null);
  const list = showAll ? asmaulHusna : asmaulHusna.slice(0, 6);

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Asmaul Husna" subtitle={t('asmaul_husna_subtitle')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {list.map((n) => (
            <div key={n.no} className="card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, padding: 14 }}>
              <button
                onClick={() => setShareName(n)}
                aria-label={`Bagikan ${n.latin}`}
                title="Bagikan sebagai kartu"
                style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'var(--mint-soft)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="18" cy="5" r="3" strokeWidth="1.8" /><circle cx="6" cy="12" r="3" strokeWidth="1.8" /><circle cx="18" cy="19" r="3" strokeWidth="1.8" />
                  <path d="M8.6 10.5 15.4 6.5M8.6 13.5 15.4 17.5" strokeWidth="1.8" />
                </svg>
              </button>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)' }}>{String(n.no).padStart(2, '0')}</span>
              <span style={{ fontFamily: "'Amiri', serif", fontSize: 20, fontWeight: 700 }}>{n.arabic}</span>
              <span style={{ fontSize: 11.5, fontWeight: 700 }}>{n.latin}</span>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{n.meaning}</span>
            </div>
          ))}
        </div>
        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 13, borderRadius: 999, background: 'var(--mint-soft)', border: 'none', cursor: 'pointer', font: 'inherit' }}
          >
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary)' }}>{t('lihat_semua_99')}</span>
          </button>
        )}
      </div>

      {shareName && (
        <AsmaulHusnaShareModal
          no={shareName.no}
          arabic={shareName.arabic}
          latin={shareName.latin}
          meaning={shareName.meaning}
          photoIndex={shareName.no}
          theme={theme}
          onClose={() => setShareName(null)}
        />
      )}
    </div>
  );
}
