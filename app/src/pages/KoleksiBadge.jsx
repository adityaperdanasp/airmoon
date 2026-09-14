import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';
import { watchDzikirStreak } from '../lib/dzikirStreak';
import { watchPuasaSunnahLog } from '../lib/puasaSunnahLog';
import { watchUserProfile } from '../lib/profile';
import { watchHafalanProgress } from '../lib/hafalanProgress';
import { watchMyGroups, watchGroupMemberStats } from '../lib/groups';
import {
  STREAK_TIERS, highestTier,
  PUASA_TIERS, highestPuasaTier,
  REFERRAL_TIERS, highestReferralTier,
  HAFALAN_TIERS, highestHafalanTier,
  GRUP_IBADAH_TIERS, highestGrupIbadahTier,
  nextTierNudge,
} from '../lib/badges';

// `earned.label`/`tier.label`/the `nudge` string all come from
// lib/badges.js, which stays Indonesian-only for now (translating 5 tier
// systems' worth of labels, plus keeping check-campaign-deadlines.js's
// own digest push in sync, was judged out of scope for this pass) — only
// this page's own chrome (titles, empty states) is wired to t() below.
function BadgeRow({ icon, title, value, unit, tiers, earned, tercapaiLabel, belumAdaLabel }) {
  const nudge = nextTierNudge(value, tiers, unit);

  return (
    <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 28, lineHeight: 1, opacity: earned ? 1 : 0.35 }}>{earned ? earned.icon : icon}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 800 }}>{title}</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {earned ? `${earned.label} ${tercapaiLabel}` : belumAdaLabel}
          </span>
        </div>
        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)', flexShrink: 0 }}>{value}{unit}</span>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {tiers.map((tier) => {
          const threshold = tier.count ?? tier.days;
          const reached = value >= threshold;
          return (
            <div
              key={threshold}
              style={{ flex: 1, height: 6, borderRadius: 999, background: reached ? 'var(--primary)' : 'var(--border)' }}
              title={`${tier.icon} ${tier.label}`}
            />
          );
        })}
      </div>

      {nudge && (
        <span style={{ fontSize: 10.5, color: 'var(--muted-soft)' }}>{nudge}</span>
      )}
    </div>
  );
}

// Koleksi Badge Saya (2026-09-13) — this app grew 5 independent tier
// systems across as many rounds (badges.js: streak, puasa, referral,
// hafalan, grup ibadah) each surfaced only as a small sub-text on its own
// unrelated page. First place all of them are shown together, with a
// concrete "X lagi menuju Y" nudge instead of a bare number.
export default function KoleksiBadge() {
  const { user } = useAuth();
  const { t } = useLang();
  const [dzikirStreak, setDzikirStreak] = useState({});
  const [puasaDates, setPuasaDates] = useState([]);
  const [referralActivatedCount, setReferralActivatedCount] = useState(0);
  const [hafalanVerses, setHafalanVerses] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [groupTimesReported, setGroupTimesReported] = useState(0);

  useEffect(() => watchDzikirStreak(user?.uid, setDzikirStreak), [user?.uid]);
  useEffect(() => watchPuasaSunnahLog(user?.uid, (v) => setPuasaDates(v || [])), [user?.uid]);
  useEffect(() => watchUserProfile(user?.uid, (p) => setReferralActivatedCount(p?.referralActivatedCount || 0)), [user?.uid]);
  useEffect(() => watchHafalanProgress(user?.uid, setHafalanVerses), [user?.uid]);
  useEffect(() => watchMyGroups(user?.uid, setMyGroups), [user?.uid]);

  // Grup Ibadah's timesReported is per-group, not per-user — this shows
  // the highest across whichever groups the user is actually in (usually
  // just one), since there's no natural single "your Grup Ibadah number"
  // otherwise. Someone in zero groups just sees a locked/empty state.
  useEffect(() => {
    if (myGroups.length === 0) {
      setGroupTimesReported(0);
      return;
    }
    const unsubs = myGroups.map((g) =>
      watchGroupMemberStats(g.id, (members) => {
        const mine = members.find((m) => m.uid === user?.uid);
        setGroupTimesReported((prev) => Math.max(prev, mine?.timesReported || 0));
      })
    );
    return () => unsubs.forEach((u) => u());
  }, [myGroups, user?.uid]);

  const bestStreak = Math.max(dzikirStreak?.pagi?.best || 0, dzikirStreak?.petang?.best || 0);
  const tercapaiLabel = t('koleksi_badge_tercapai');
  const belumAdaLabel = t('koleksi_badge_belum_ada');

  if (!user) {
    return (
      <div className="screen">
        <div className="screen-content">
          <TopBar title={t('koleksi_badge_title')} />
          <p className="state-msg">{t('koleksi_badge_masuk_dulu')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('koleksi_badge_title')} />

        <BadgeRow icon="🔥" title={t('koleksi_badge_rentetan_dzikir')} value={bestStreak} unit={` ${t('koleksi_badge_unit_hari')}`} tiers={STREAK_TIERS} earned={highestTier(bestStreak)} tercapaiLabel={tercapaiLabel} belumAdaLabel={belumAdaLabel} />
        <BadgeRow icon="🌙" title={t('koleksi_badge_puasa_sunnah')} value={puasaDates.length} unit="x" tiers={PUASA_TIERS} earned={highestPuasaTier(puasaDates.length)} tercapaiLabel={tercapaiLabel} belumAdaLabel={belumAdaLabel} />
        <BadgeRow icon="🧠" title={t('koleksi_badge_tahfiz')} value={hafalanVerses.length} unit={` ${t('koleksi_badge_unit_ayat')}`} tiers={HAFALAN_TIERS} earned={highestHafalanTier(hafalanVerses.length)} tercapaiLabel={tercapaiLabel} belumAdaLabel={belumAdaLabel} />
        <BadgeRow icon="🌱" title={t('koleksi_badge_referral_aktif')} value={referralActivatedCount} unit="" tiers={REFERRAL_TIERS} earned={highestReferralTier(referralActivatedCount)} tercapaiLabel={tercapaiLabel} belumAdaLabel={belumAdaLabel} />
        {myGroups.length > 0 ? (
          <BadgeRow icon="👪" title={t('koleksi_badge_grup_ibadah')} value={groupTimesReported} unit="x" tiers={GRUP_IBADAH_TIERS} earned={highestGrupIbadahTier(groupTimesReported)} tercapaiLabel={tercapaiLabel} belumAdaLabel={belumAdaLabel} />
        ) : (
          <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, opacity: 0.6 }}>
            <span style={{ fontSize: 28 }}>👪</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 800 }}>{t('koleksi_badge_grup_ibadah')}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t('koleksi_badge_grup_locked')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
