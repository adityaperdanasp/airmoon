import { useState } from 'react';
import { doaCategories } from '../data/doaHarian';
import { useLang } from '../context/LangContext';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';

export default function DoaHarian() {
  const { t } = useLang();
  const [activeId, setActiveId] = useState('pagi');
  const active = doaCategories.find((c) => c.id === activeId) ?? doaCategories[0];

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title={t('item_doa_harian')} photo={PAGE_PHOTOS.doaHarian} />

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {doaCategories.map((c) => {
            const isActive = c.id === active.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                style={{
                  flexShrink: 0,
                  padding: '9px 16px',
                  borderRadius: 999,
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: isActive ? '#fff' : 'var(--ink)',
                  background: isActive ? 'var(--primary)' : 'var(--card)',
                }}
              >
                {t(c.labelKey)}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {active.items.map((d, i) => (
            <div key={`${active.id}-${i}`} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{d.title}</span>
                {d.repeat && (
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 999,
                      color: 'var(--primary)',
                      background: 'var(--mint)',
                    }}
                  >
                    {d.repeat}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "'Amiri', serif", fontSize: 19, lineHeight: 1.9, direction: 'rtl', textAlign: 'right' }}>
                {d.arabic}
              </div>
              {d.latin && (
                <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.55, color: 'var(--muted-soft)', fontStyle: 'italic' }}>{d.latin}</p>
              )}
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--muted)' }}>{d.translation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
