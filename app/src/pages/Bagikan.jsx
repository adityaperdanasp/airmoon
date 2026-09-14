import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useLang } from '../context/LangContext';

// Bagikan (2026-09-13) — 9 different shareable cards had grown across
// 9 different pages over this app's history (Ringkasan Ibadah, Mode
// Ramadan, Kartu Pencapaian, struk donasi, Kalkulator Zakat, Kalkulator
// Waris, Asmaul Husna, Sejarah Islam, Tasbih), each with its own
// icon-button entry point nobody could discover without already being on
// that exact page. This is a discoverability hub, not a technical
// merge — each card below still opens on its own source page (where the
// live data it draws from already lives), not a duplicated modal here.
const SHARE_OPTIONS = [
  { to: '/lainnya/ringkasan-ibadah', icon: '📊', titleKey: 'bagikan_ringkasan_ibadah_title', subtitleKey: 'bagikan_ringkasan_ibadah_subtitle' },
  { to: '/lainnya/mode-ramadan', icon: '🏮', titleKey: 'bagikan_progress_ramadan_title', subtitleKey: 'bagikan_progress_ramadan_subtitle' },
  { to: '/pengaturan', icon: '🏅', titleKey: 'bagikan_kartu_pencapaian_title', subtitleKey: 'bagikan_kartu_pencapaian_subtitle' },
  { to: '/donasi', icon: '🧾', titleKey: 'bagikan_struk_donasi_title', subtitleKey: 'bagikan_struk_donasi_subtitle' },
  { to: '/lainnya/kalkulator-zakat', icon: '🕌', titleKey: 'bagikan_zakat_title', subtitleKey: 'bagikan_zakat_subtitle' },
  { to: '/lainnya/kalkulator-waris', icon: '⚖️', titleKey: 'bagikan_waris_title', subtitleKey: 'bagikan_waris_subtitle' },
  { to: '/lainnya/asmaul-husna', icon: '📿', titleKey: 'bagikan_asmaul_husna_title', subtitleKey: 'bagikan_asmaul_husna_subtitle' },
  { to: '/lainnya/sejarah-islam', icon: '📜', titleKey: 'bagikan_sejarah_islam_title', subtitleKey: 'bagikan_sejarah_islam_subtitle' },
  { to: '/lainnya/tasbih', icon: '📿', titleKey: 'bagikan_tasbih_title', subtitleKey: 'bagikan_tasbih_subtitle' },
];

export default function Bagikan() {
  const { t } = useLang();
  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('bagikan_title')} subtitle={t('bagikan_subtitle')} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SHARE_OPTIONS.map((opt) => (
            <Link
              key={opt.to + opt.titleKey}
              to={opt.to}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, textDecoration: 'none', color: 'inherit' }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>{opt.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{t(opt.titleKey)}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t(opt.subtitleKey)}</span>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0 }}><path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          ))}
        </div>

        <span style={{ fontSize: 10.5, color: 'var(--muted-soft)', textAlign: 'center', lineHeight: 1.5 }}>
          {t('bagikan_footer_note')}
        </span>
      </div>
    </div>
  );
}
