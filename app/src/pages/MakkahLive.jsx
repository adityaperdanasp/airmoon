import TopBar from '../components/TopBar';

// Video id verified via web search (not guessed) — a public 24/7 Kaaba/
// Masjid al-Haram live stream. Swap for the founder's preferred official
// channel embed if there's a specific licensing/partnership preference.
const YOUTUBE_ID = 'gReqANyDHCE';

export default function MakkahLive() {
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
          <span style={{ fontSize: 15, fontWeight: 800 }}>Siaran Langsung Masjidil Haram</span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Makkah, Arab Saudi</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--cream)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--gold-ink-dark)' }}>
            Siaran ditampilkan lewat embed YouTube publik. Ganti dengan channel resmi pilihan kamu kalau ada kerja sama khusus.
          </span>
        </div>
      </div>
    </div>
  );
}
