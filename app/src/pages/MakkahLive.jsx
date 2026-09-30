import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';

// Video id verified via web search (not guessed) — the currently-live
// video from the official KSA Qur'an TV channel (2.75M subscribers,
// youtube.com/channel/UCos52azQNBgW63_9uDJoPDA), resolved by navigating
// that channel's own /live redirect rather than trusting a random search
// result — several other "24/7 Makkah live" search hits were checked
// the same way (2026-10-01) and turned out to already be dead
// ("Video unavailable") despite reading like real, current streams.
// This is the real failure mode, not a one-off: a broadcaster's live
// video id rotates whenever they end/restart their stream, so this id
// WILL go stale again eventually — re-verify via the channel's /live
// URL (not a fresh search) when that happens, rather than swapping in
// another search result that might already be dead too. A live
// re-embed via youtube.com/embed/live_stream?channel=<id> was tried
// first specifically to avoid this rot, but tested as "video
// unavailable" in a real iframe — YouTube doesn't support that path
// for this channel, so a fixed id is the only working option for now.
const YOUTUBE_ID = 'eC4LfEVxvKg';

export default function MakkahLive() {
  const { t } = useLang();
  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Makkah Live" />

        <div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '16 / 9', background: '#000' }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=0`}
            title="Makkah Live — Masjid al-Haram"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 800 }}>{t('siaran_langsung')}</span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{t('makkah_location')}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--cream)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--gold-ink-dark)' }}>
            {t('makkah_info')}
          </span>
        </div>
      </div>
    </div>
  );
}
