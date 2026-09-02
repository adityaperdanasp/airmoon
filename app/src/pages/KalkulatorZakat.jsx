import { useEffect, useState } from 'react';
import { calcZakatPenghasilan, calcZakatMaal, formatRupiah, NISAB_GOLD_GRAMS } from '../lib/zakat';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import { watchZakatHaul, startZakatHaul, clearZakatHaul, daysUntilHaulDue } from '../lib/zakatHaul';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';

function digitsOnly(v) {
  return v.replace(/\D/g, '');
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '9px 0',
        borderRadius: 999,
        border: 'none',
        fontSize: 12.5,
        fontWeight: 700,
        cursor: 'pointer',
        color: active ? 'var(--on-primary)' : 'var(--ink)',
        background: active ? 'var(--primary)' : 'transparent',
      }}
    >
      {children}
    </button>
  );
}

export default function KalkulatorZakat() {
  const { t } = useLang();
  const { user } = useAuth();
  const [tab, setTab] = useState('penghasilan');

  // Zakat Penghasilan
  const [income, setIncome] = useState('15000000');
  const [needs, setNeeds] = useState('5000000');
  const incomeN = Number(digitsOnly(income)) || 0;
  const needsN = Number(digitsOnly(needs)) || 0;
  const zakatPenghasilan = calcZakatPenghasilan(incomeN, needsN);

  // Zakat Maal
  const [assets, setAssets] = useState('100000000');
  const [goldPrice, setGoldPrice] = useState('1500000');
  const assetsN = Number(digitsOnly(assets)) || 0;
  const goldPriceN = Number(digitsOnly(goldPrice)) || 0;
  const nisab = NISAB_GOLD_GRAMS * goldPriceN;
  const zakatMaal = calcZakatMaal(assetsN, goldPriceN);
  const reachesNisab = assetsN >= nisab && nisab > 0;

  const [haul, setHaul] = useState(null);
  useEffect(() => watchZakatHaul(user?.uid, setHaul), [user?.uid]);
  const daysLeft = haul?.startDate ? daysUntilHaulDue(haul.startDate) : null;

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title={t('item_kalkulator_zakat')} photo={PAGE_PHOTOS.zakat} />

        <div style={{ display: 'flex', padding: 3, borderRadius: 999, background: 'var(--mint-soft)' }}>
          <TabBtn active={tab === 'penghasilan'} onClick={() => setTab('penghasilan')}>
            {t('zakat_tab_penghasilan')}
          </TabBtn>
          <TabBtn active={tab === 'maal'} onClick={() => setTab('maal')}>
            {t('zakat_tab_maal')}
          </TabBtn>
        </div>

        {tab === 'penghasilan' ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{t('penghasilan_label')}</span>
              <div className="input-row">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
                <input inputMode="numeric" value={incomeN.toLocaleString('id-ID')} onChange={(e) => setIncome(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{t('kebutuhan_label')}</span>
              <div className="input-row">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
                <input inputMode="numeric" value={needsN.toLocaleString('id-ID')} onChange={(e) => setNeeds(e.target.value)} />
              </div>
            </div>

            <div style={{ borderRadius: 20, padding: 20, textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {t('zakat_wajib_label')}
              </span>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginTop: 8 }}>{formatRupiah(zakatPenghasilan)}</div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                2.5% &times; ({formatRupiah(incomeN)} &minus; {formatRupiah(needsN)})
              </span>
            </div>

            <button className="btn">{t('bayar_zakat_btn')}</button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>{t('zakat_info')}</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{t('harta_label')}</span>
              <div className="input-row">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
                <input inputMode="numeric" value={assetsN.toLocaleString('id-ID')} onChange={(e) => setAssets(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{t('harga_emas_label')}</span>
              <div className="input-row">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
                <input inputMode="numeric" value={goldPriceN.toLocaleString('id-ID')} onChange={(e) => setGoldPrice(e.target.value)} />
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{t('nisab_info')} &middot; {formatRupiah(nisab)}</span>
            </div>

            <div style={{ borderRadius: 20, padding: 20, textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {t('zakat_wajib_label')}
              </span>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginTop: 8 }}>{formatRupiah(zakatMaal)}</div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                {reachesNisab ? `2.5% × ${formatRupiah(assetsN)}` : t('belum_capai_nisab')}
              </span>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>🌙</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{t('haul_label')}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.4 }}>{t('haul_sub')}</span>
                </div>
              </div>

              {haul?.startDate ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: daysLeft <= 0 ? 'var(--danger)' : 'var(--primary)' }}>
                      {daysLeft > 0 ? daysLeft : 0}
                    </span>
                    <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                      {daysLeft > 0 ? t('haul_sisa_hari') : t('haul_jatuh_tempo')}
                    </span>
                  </div>
                  <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                    {t('haul_tersimpan')}: {new Date(`${haul.startDate}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <button className="btn-outline" style={{ padding: '9px' }} onClick={() => user && clearZakatHaul(user.uid)}>
                    Reset
                  </button>
                </>
              ) : (
                <button className="btn" style={{ padding: '11px' }} onClick={() => user && startZakatHaul(user.uid)} disabled={!user}>
                  {t('tandai_haul_btn')}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>{t('zakat_info')}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
