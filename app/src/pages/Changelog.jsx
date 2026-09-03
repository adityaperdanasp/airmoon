import { useEffect } from 'react';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import { CHANGELOG } from '../data/changelog';
import { markChangelogSeen } from '../lib/changelogSeen';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// "Yang Baru" — dozens of features have shipped with no way for a
// returning user to find out short of stumbling onto them. See
// data/changelog.js for what's curated in here and how to add to it.
export default function Changelog() {
  useEffect(() => {
    markChangelogSeen();
  }, []);

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Yang Baru" photo={PAGE_PHOTOS.changelog} subtitle="Pembaruan airmoon" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {CHANGELOG.map((entry) => (
            <div key={entry.version} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {dateFmt.format(new Date(entry.date))}
                </span>
                <span style={{ fontSize: 14.5, fontWeight: 800 }}>{entry.title}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {entry.items.map((item, i) => (
                  <li key={i} style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--muted)' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
