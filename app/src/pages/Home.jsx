import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { usePrayerTimes } from '../lib/usePrayerTimes';
import { watchActiveDonations, watchMyContributions } from '../lib/donations';
import { watchUserProfile } from '../lib/profile';
import { markSeen, watchHasNewDoa } from '../lib/unseenBadges';
import { getDailyTip } from '../data/dailyTips';
import { shouldShowLangNudge, dismissLangNudge } from '../lib/langNudge';
import { getMustajabWindow } from '../lib/mustajabTime';
import { formatRupiah } from '../lib/zakat';
import BottomNav from '../components/BottomNav';
import DonationCard from '../components/DonationCard';
import { QuranBookIcon, CuppedHandsIcon } from '../components/serviceIcons';
import { ALL_SHORTCUT_ITEMS } from '../components/featureCatalog';
import ShortcutPickerSheet from '../components/ShortcutPickerSheet';
import { getHomeShortcuts, saveHomeShortcuts, resetHomeShortcuts } from '../lib/homeShortcuts';
import PrayerStrip from '../components/PrayerStrip';
import HariIniCard from '../components/HariIniCard';
import { SkeletonCard } from '../components/Skeleton';
import InstallAppCard from '../components/InstallAppCard';
import EmptyState from '../components/EmptyState';
import CountUp from '../components/CountUp';
import PullToRefresh from '../components/PullToRefresh';
import OnboardingTour from '../components/OnboardingTour';
import { hasSeenOnboarding, markOnboardingSeen } from '../lib/onboarding';
import RatingPromptModal from '../components/RatingPromptModal';
import { shouldShowRatingPrompt, markRatingPromptShown, dismissRatingPromptForever } from '../lib/ratingPrompt';
import { submitFeedback } from '../lib/feedback';
import { markLoginPoint } from '../lib/amalanHarian';
import HomeHero from '../components/HomeHero';
import NPSPromptModal from '../components/NPSPromptModal';
import { shouldShowNpsPrompt, markNpsPromptShown, dismissNpsPromptForever, submitNpsResponse } from '../lib/npsPrompt';
import { isNpsPromptEnabled } from '../lib/remoteConfig';
import { checkAndUpdateLastSeen } from '../lib/lastSeen';
import { shouldShowChurnSurvey, markChurnSurveyShown, dismissChurnSurveyForever, submitChurnSurveyResponse } from '../lib/churnSurvey';
import ChurnSurveyModal from '../components/ChurnSurveyModal';
import { CHANGELOG } from '../data/changelog';
import { shouldShowChangelogSpotlight, markChangelogSpotlightSeen } from '../lib/changelogSpotlight';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function Home() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const { next, status: prayerStatus, data: prayerData } = usePrayerTimes();
  const [donations, setDonations] = useState(null);
  const [myContributions, setMyContributions] = useState([]);
  const [showSedekahHistory, setShowSedekahHistory] = useState(false);
  const [hasNewDoa, setHasNewDoa] = useState(false);
  const [shortcutPaths, setShortcutPaths] = useState(getHomeShortcuts);
  const [showShortcutPicker, setShowShortcutPicker] = useState(false);
  const [avatarColor, setAvatarColor] = useState(null);
  const [avatarPhoto, setAvatarPhoto] = useState(null);
  const [interestTag, setInterestTagState] = useState(null);
  const [lastReadAyat, setLastReadAyat] = useState(null);
  const [lastReadMushaf, setLastReadMushaf] = useState(null);
  const [searchParams] = useSearchParams();
  const [highlightAmalan, setHighlightAmalan] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !hasSeenOnboarding());
  // Only ever offered to signed-in users — submitFeedback() needs a uid,
  // and never shown on the same visit as the onboarding tour (that's
  // already one full-screen interruption; stacking a second unrelated
  // prompt on top of it would be a lot for one visit).
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  useEffect(() => {
    if (showOnboarding || !user) return;
    if (!shouldShowRatingPrompt()) return;
    // [UI 2026-09-11] This effect re-runs the instant showOnboarding
    // flips to false (onFinish below) — for someone who's actually past
    // the usual 7-day gate but is seeing the tour again anyway (e.g.
    // after "Reset Semua Data Lokal", which also clears the onboarding-
    // seen flag), that meant the rating prompt could pop up the very
    // instant the tour closed. A short pause gives Home itself a moment
    // on screen first, instead of one full-screen prompt chaining
    // straight into another.
    const timer = setTimeout(() => setShowRatingPrompt(true), 1200);
    return () => clearTimeout(timer);
  }, [showOnboarding, user]);

  // Survei NPS super ringan (2026-09-12) — same timing shape as the
  // rating prompt above, deliberately never shown the same visit as it
  // (checked via shouldShowRatingPrompt() itself, not just showRatingPrompt
  // state, since the rating prompt's own 1200ms delay means its state
  // hasn't flipped true yet at the moment this effect runs) — two
  // full-screen prompts fighting for one visit would be worse than either
  // alone. Gated behind Remote Config so this can be turned off live
  // without a redeploy if it turns out to be more annoying than useful.
  const [showNpsPrompt, setShowNpsPrompt] = useState(false);
  useEffect(() => {
    if (showOnboarding || !user) return;
    if (shouldShowRatingPrompt()) return;
    if (!isNpsPromptEnabled() || !shouldShowNpsPrompt()) return;
    const timer = setTimeout(() => setShowNpsPrompt(true), 1200);
    return () => clearTimeout(timer);
  }, [showOnboarding, user]);

  // Last-seen tracking (2026-09-12) — computed once per mount, feeds both
  // the "welcome back" banner (a lightweight, non-modal nudge, so it can
  // coexist with the full-screen prompts above) and the churn survey
  // below (a modal, so it DOES join the same one-prompt-per-visit
  // priority chain: onboarding > rating > NPS > churn).
  const [daysAway, setDaysAway] = useState(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  useEffect(() => {
    const away = checkAndUpdateLastSeen();
    setDaysAway(away);
    if (away !== null && away >= 14) setShowWelcomeBack(true);
  }, []);

  // Spotlight fitur baru sesuai minat (2026-09-12) — checked once
  // interestTag has actually loaded (starts null while watchUserProfile's
  // first snapshot is in flight, same as everywhere else this field is
  // read), against just the latest changelog entry.
  const latestChangelogEntry = CHANGELOG[0];
  const [showChangelogSpotlight, setShowChangelogSpotlight] = useState(false);
  useEffect(() => {
    if (!interestTag) return;
    setShowChangelogSpotlight(shouldShowChangelogSpotlight(latestChangelogEntry, interestTag));
  }, [interestTag]);

  const [showLangNudge, setShowLangNudge] = useState(false);
  useEffect(() => {
    setShowLangNudge(shouldShowLangNudge(lang));
  }, [lang]);

  // Waktu Mustajab Doa (2026-09-12) — recomputed every minute, not a
  // one-time dismissible nudge like the banners above, since this
  // reflects a real recurring time window rather than a one-off event.
  const [mustajabWindow, setMustajabWindow] = useState(null);
  useEffect(() => {
    if (!prayerData?.timings) {
      setMustajabWindow(null);
      return;
    }
    const check = () => setMustajabWindow(getMustajabWindow(prayerData.timings));
    check();
    const timer = setInterval(check, 60000);
    return () => clearInterval(timer);
  }, [prayerData?.timings]);

  const [showChurnSurvey, setShowChurnSurvey] = useState(false);
  useEffect(() => {
    if (showOnboarding || !user || daysAway === null) return;
    if (shouldShowRatingPrompt() || (isNpsPromptEnabled() && shouldShowNpsPrompt())) return;
    if (!shouldShowChurnSurvey(daysAway)) return;
    const timer = setTimeout(() => setShowChurnSurvey(true), 1200);
    return () => clearTimeout(timer);
  }, [showOnboarding, user, daysAway]);

  // Poin & Medali's daily login point — markLoginPoint() itself checks
  // whether today's point is already recorded before writing, so this
  // firing on every Home mount (not just once ever) is fine.
  useEffect(() => {
    if (user) markLoginPoint(user.uid);
  }, [user]);

  useEffect(() => watchActiveDonations(setDonations), []);
  useEffect(() => watchUserProfile(user?.uid, (p) => {
    setAvatarColor(p?.avatarColor || null);
    setAvatarPhoto(p?.avatarPhoto || null);
    setInterestTagState(p?.interestTag || null);
  }), [user?.uid]);
  useEffect(() => watchHasNewDoa(setHasNewDoa), []);

  // Same lastReadAyat/lastRead fallback SurahList.jsx uses — see that
  // file's own comment for why the older field name still has to be
  // checked (bookmarks saved before Mode Mushaf got its own separate
  // field). A "Lanjut Baca" quick-access row here means resuming a read
  // doesn't require going through SurahList first.
  async function refreshLastRead() {
    if (!user) return;
    const snap = await getDoc(doc(db, 'users', user.uid));
    const data = snap.data();
    const ayatBookmark = data?.lastReadAyat || data?.lastRead;
    if (ayatBookmark) setLastReadAyat(ayatBookmark);
    if (data?.lastReadMushaf) setLastReadMushaf(data.lastReadMushaf);
  }

  useEffect(() => {
    refreshLastRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshLastRead
    // is redefined every render (not memoized); including it here would
    // refire this on every render instead of only when the user changes.
  }, [user]);

  // "Progress Hari Ini" PWA shortcut (manifest.json) deep-links here with
  // ?focus=amalan since Amalan Harian lives inline on Home rather than its
  // own route — scroll it into view and give it the same brief highlight
  // ring SurahReader/MushafReader already use for their own deep links.
  useEffect(() => {
    if (searchParams.get('focus') !== 'amalan') return;
    const el = document.getElementById('amalan-harian');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightAmalan(true);
    const t = setTimeout(() => setHighlightAmalan(false), 2200);
    return () => clearTimeout(t);
  }, [searchParams]);

  // The doa/donation feeds below are already onSnapshot-live (nothing to
  // re-fetch there), so pulling down mainly re-checks the last-read
  // bookmark — still a real fetch, not just gesture theater — plus gives
  // the expected tactile "did something" feedback on a page whose other
  // data updates itself anyway.
  async function handlePullRefresh() {
    await refreshLastRead();
  }

  // Marked seen on the way out, not on mount — so BottomNav's dot stays
  // visible for as long as this page (which shows both feeds inline) was
  // actually open, rather than clearing itself the instant it appears.
  useEffect(() => {
    return () => {
      markSeen('donasi');
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    return watchMyContributions(user.uid, setMyContributions);
  }, [user]);

  const mySedekahTotal = myContributions.reduce((sum, c) => sum + c.amount, 0);
  // Tips Islami Harian (2026-09-12) — same interestTag Home already
  // reorders the Layanan grid by (see reorderSvcByInterest above),
  // reused so the one daily tip actually matches why this person opened
  // the app instead of showing the same generic quote to everyone.
  const dailyTip = getDailyTip(interestTag);

  const hour = new Date().getHours();
  const dzikirTab = hour < 12 ? 'pagi' : 'petang';
  const hasBanners = showLangNudge || mustajabWindow || showWelcomeBack || showChangelogSpotlight;

  const lanjutkan = [];
  if (lastReadAyat) {
    lanjutkan.push({ key: 'ayat', to: `/quran/${lastReadAyat.nomor}`, title: 'Lanjut baca', sub: `${lastReadAyat.namaLatin} : ${lastReadAyat.ayat}`, bg: 'var(--cream)', icon: <QuranBookIcon size={34} />, prefetch: () => import('./SurahReader') });
  }
  if (lastReadMushaf) {
    lanjutkan.push({ key: 'mushaf', to: `/quran/mushaf/${lastReadMushaf.page}?ayat=${lastReadMushaf.verseKey}`, title: 'Lanjut Mushaf', sub: `${lastReadMushaf.chapterName} : ${lastReadMushaf.page}`, bg: 'var(--mint-soft)', icon: <QuranBookIcon size={34} />, prefetch: () => import('./MushafReader') });
  }
  lanjutkan.push({ key: 'dzikir', to: '/lainnya/doa-harian', state: { activeId: dzikirTab }, title: dzikirTab === 'pagi' ? 'Dzikir pagi' : 'Dzikir petang', sub: 'Doa harian', bg: lanjutkan.length ? 'var(--mint-soft)' : 'var(--cream)', icon: <CuppedHandsIcon size={34} /> });

  // Jelajahi is whatever the user picked (lib/homeShortcuts.js), resolved
  // against the shared feature catalog; "Semua" is always the last tile.
  const jelajahi = [
    ...shortcutPaths.map((to) => ALL_SHORTCUT_ITEMS.find((it) => it.to === to)).filter(Boolean).map((it) => ({
      to: it.to,
      label: it.key ? t(it.key) : it.label,
      icon: it.node,
      prefetch: it.prefetch,
    })),
    { to: '/lainnya', label: 'Semua', icon: <span style={{ fontSize: 22, color: 'var(--primary)', fontWeight: 800, lineHeight: 1 }}>⋯</span> },
  ];

  const sectionTitle = { margin: 0, fontSize: 17, fontWeight: 800 };
  const bannerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 14px', borderRadius: 18, textDecoration: 'none', color: 'inherit' };

  return (
    <div className="screen">
      <div className="screen-content" style={{ padding: 0, gap: 0, paddingBottom: 'calc(130px + env(safe-area-inset-bottom))' }}>
      <PullToRefresh onRefresh={handlePullRefresh}>
        <HomeHero
          user={user}
          avatarPhoto={avatarPhoto}
          avatarColor={avatarColor}
          greeting={t('greeting')}
          settingsLabel={t('pengaturan')}
          tip={dailyTip}
          next={next}
          status={prayerStatus}
        />
        <PrayerStrip timings={prayerData?.timings} nextKey={next?.key} />

        <div style={{ padding: '24px 20px 0', display: 'flex', flexDirection: 'column', gap: 26 }}>
          {hasBanners && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mustajabWindow && (
                <Link to="/lainnya/doa-harian" style={{ ...bannerStyle, justifyContent: 'flex-start', background: 'var(--cream)' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, flex: 1 }}>🤲 {mustajabWindow.message}</span>
                </Link>
              )}
              {showLangNudge && (
                <div style={{ ...bannerStyle, background: 'var(--blue-gray)' }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>🌐 Your phone looks set to English — switch airmoon's language in Settings.</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <Link to="/pengaturan" onClick={() => { dismissLangNudge(); setShowLangNudge(false); }} style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>Settings</Link>
                    <button onClick={() => { dismissLangNudge(); setShowLangNudge(false); }} aria-label="Tutup" style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16, cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
                  </div>
                </div>
              )}
              {showWelcomeBack && (
                <div style={{ ...bannerStyle, background: 'var(--mint-soft)' }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>👋 Kangen nih! Yuk lanjutkan lagi kebiasaan ibadahmu.</span>
                  <button onClick={() => setShowWelcomeBack(false)} aria-label="Tutup" style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16, cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0 }}>×</button>
                </div>
              )}
              {showChangelogSpotlight && (
                <Link
                  to="/yang-baru"
                  onClick={() => { markChangelogSpotlightSeen(latestChangelogEntry.version); setShowChangelogSpotlight(false); }}
                  style={{ ...bannerStyle, background: 'var(--cream)' }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700 }}>✨ Ada fitur baru yang cocok buat kamu: {latestChangelogEntry.title}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); markChangelogSpotlightSeen(latestChangelogEntry.version); setShowChangelogSpotlight(false); }}
                    aria-label="Tutup"
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 16, cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0 }}
                  >
                    ×
                  </button>
                </Link>
              )}
            </div>
          )}

          {user && <HariIniCard uid={user.uid} forceOpen={highlightAmalan} />}

          <section>
            <h2 style={{ ...sectionTitle, marginBottom: 12 }}>Lanjutkan</h2>
            <div className="hide-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -20px', padding: '0 20px' }}>
              {lanjutkan.map((c) => (
                <Link key={c.key} to={c.to} state={c.state} onMouseEnter={c.prefetch} onTouchStart={c.prefetch} style={{ flexShrink: 0, width: 150, borderRadius: 22, background: c.bg, padding: 14, display: 'flex', flexDirection: 'column', gap: 18, textDecoration: 'none', color: 'var(--ink)' }}>
                  {c.icon}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{c.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <h2 style={sectionTitle}>Berbagi</h2>
              <button onClick={() => setShowSedekahHistory((v) => !v)} aria-expanded={showSedekahHistory} style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, fontFamily: 'inherit', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>
                Sedekahmu <CountUp value={mySedekahTotal} formatter={formatRupiah} /> · {showSedekahHistory ? 'Tutup' : 'Rincian'}
              </button>
            </div>
            {showSedekahHistory && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {myContributions.length === 0 ? (
                  <EmptyState icon="💝" title="Belum ada riwayat sedekah" subtitle="Yuk mulai sedekah hari ini, sekecil apapun." actionLabel="Lihat Campaign" actionTo="/donasi" />
                ) : (
                  myContributions.map((c) => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 14, background: 'var(--card)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{c.donationTitle}</span>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{c.createdAt ? dateFmt.format(c.createdAt.toDate()) : 'Baru saja'}</span>
                      </div>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--primary)' }}>+{formatRupiah(c.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
            {donations === null && <SkeletonCard height={140} />}
            {donations && donations.length === 0 && (
              <EmptyState icon="🕌" title="Belum ada campaign aktif" subtitle="Campaign donasi listrik masjid baru bakal muncul di sini begitu ada yang disetujui." />
            )}
            {donations && donations.length > 0 && <DonationCard donation={donations[0]} />}
            {donations && donations.length > 1 && (
              <Link to="/donasi" style={{ display: 'block', marginTop: 10, textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
                Lihat {donations.length - 1} campaign lainnya
              </Link>
            )}
          </section>

          <section>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={sectionTitle}>Jelajahi</h2>
              <button
                onClick={() => setShowShortcutPicker(true)}
                style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: 12, fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Atur
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
              {jelajahi.map((j) => (
                <Link key={j.to} to={j.to} onMouseEnter={j.prefetch} onTouchStart={j.prefetch} style={{ background: 'var(--card)', borderRadius: 20, padding: '14px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--ink)' }}>
                  <div style={{ height: 30, display: 'flex', alignItems: 'center', position: 'relative' }}>{j.icon}{j.to === '/doa' && hasNewDoa && <span aria-hidden="true" className="unseen-dot" style={{ position: 'absolute', top: -2, right: -8, width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', border: '1.5px solid var(--card)' }} />}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{j.label}</span>
                </Link>
              ))}
            </div>
          </section>

          <InstallAppCard variant="banner" />
        </div>
      </PullToRefresh>
      </div>
      <BottomNav />

      {showShortcutPicker && (
        <ShortcutPickerSheet
          initial={shortcutPaths}
          onReset={resetHomeShortcuts}
          onSave={(list) => {
            setShortcutPaths(saveHomeShortcuts(list));
            setShowShortcutPicker(false);
          }}
          onClose={() => setShowShortcutPicker(false)}
        />
      )}

      {showOnboarding && (
        <OnboardingTour
          onFinish={() => {
            markOnboardingSeen();
            setShowOnboarding(false);
          }}
        />
      )}

      {showRatingPrompt && (
        <RatingPromptModal
          onSubmit={({ stars, text }) => {
            markRatingPromptShown();
            if (user) submitFeedback(user.uid, { stars, text });
          }}
          onLater={() => {
            markRatingPromptShown();
            setShowRatingPrompt(false);
          }}
          onNever={() => {
            dismissRatingPromptForever();
            setShowRatingPrompt(false);
          }}
        />
      )}

      {showNpsPrompt && (
        <NPSPromptModal
          onSubmit={(score) => {
            markNpsPromptShown();
            if (user) submitNpsResponse(user.uid, score);
          }}
          onLater={() => {
            markNpsPromptShown();
            setShowNpsPrompt(false);
          }}
          onNever={() => {
            dismissNpsPromptForever();
            setShowNpsPrompt(false);
          }}
        />
      )}

      {showChurnSurvey && (
        <ChurnSurveyModal
          onSubmit={(reason) => {
            markChurnSurveyShown();
            if (user) submitChurnSurveyResponse(user.uid, reason, daysAway);
          }}
          onLater={() => {
            markChurnSurveyShown();
            setShowChurnSurvey(false);
          }}
          onNever={() => {
            dismissChurnSurveyForever();
            setShowChurnSurvey(false);
          }}
        />
      )}
    </div>
  );
}
