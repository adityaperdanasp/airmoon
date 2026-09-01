import { useNavigate } from 'react-router-dom';
import { IconBack } from './icons';

// A photo banner replacing the plain TopBar on a handful of content
// pages (Arah Kiblat, Jadwal Sholat, Cari Masjid, Zakat, ...) — per an
// explicit ask to bring in the founder's own Islamic-architecture
// photography rather than leaving these pages as plain text headers.
// Back button + title are overlaid directly on the photo instead of
// using the shared TopBar, so this fully replaces it (don't render both
// on the same page).
export default function PageHeaderPhoto({ title, photo, subtitle, showBack = true, right }) {
  const navigate = useNavigate();
  return (
    <div style={{ position: 'relative', height: 130, borderRadius: 22, overflow: 'hidden' }}>
      <img
        src={photo}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,20,15,0.1) 0%, rgba(10,20,15,0.62) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '14px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Kembali"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.22)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <IconBack />
            </button>
          )}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>{title}</h1>
            {subtitle && <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.8)', marginTop: 1 }}>{subtitle}</div>}
          </div>
        </div>
        {right}
      </div>
    </div>
  );
}
