import { useState } from 'react';
import { asmaulHusna } from '../data/asmaulHusna';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';

export default function NamaNamaAllah() {
  const { t } = useLang();
  const [showAll, setShowAll] = useState(false);
  const list = showAll ? asmaulHusna : asmaulHusna.slice(0, 6);

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Asmaul Husna" subtitle={t('asmaul_husna_subtitle')} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {list.map((n) => (
            <div key={n.no} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 14 }}>
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
    </div>
  );
}
