import { doaHarian } from '../data/doaHarian';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';

export default function DoaHarian() {
  const { t } = useLang();
  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('item_doa_harian')} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {doaHarian.map((d) => (
            <div key={d.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700 }}>{d.title}</span>
              <div style={{ fontFamily: "'Amiri', serif", fontSize: 19, lineHeight: 1.9, direction: 'rtl', textAlign: 'right' }}>
                {d.arabic}
              </div>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: 'var(--muted)' }}>"{d.translation}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
