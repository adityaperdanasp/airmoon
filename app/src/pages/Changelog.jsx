import { useEffect, useState } from 'react';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import { CHANGELOG } from '../data/changelog';
import { markChangelogSeen } from '../lib/changelogSeen';
import { useAuth } from '../context/AuthContext';
import { watchChangelogReaction, watchMyChangelogVote, toggleHelpful, toggleNotHelpful } from '../lib/changelogReactions';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// [PM 2026-09-12] "Yang Baru" only ever broadcast one-way — no way for a
// user to say whether a shipped feature actually landed for them. Same
// small reaction row every entry gets.
function ReactionRow({ version }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ helpfulCount: 0, notHelpfulCount: 0 });
  const [helpful, setHelpful] = useState(false);
  const [notHelpful, setNotHelpful] = useState(false);

  useEffect(() => watchChangelogReaction(version, setCounts), [version]);
  useEffect(() => watchMyChangelogVote(version, user?.uid, 'helpfulVotes', setHelpful), [version, user?.uid]);
  useEffect(() => watchMyChangelogVote(version, user?.uid, 'notHelpfulVotes', setNotHelpful), [version, user?.uid]);

  function vote(kind) {
    if (!user) return;
    if (kind === 'helpful') toggleHelpful(version, user.uid);
    else toggleNotHelpful(version, user.uid);
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={() => vote('helpful')}
        disabled={!user}
        aria-pressed={helpful}
        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, border: helpful ? 'none' : '1px solid var(--border)', background: helpful ? 'var(--primary)' : 'transparent', color: helpful ? 'var(--on-primary)' : 'var(--muted)', fontSize: 11, fontWeight: 700, cursor: user ? 'pointer' : 'default' }}
      >
        👍 {counts.helpfulCount || 0}
      </button>
      <button
        onClick={() => vote('notHelpful')}
        disabled={!user}
        aria-pressed={notHelpful}
        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, border: notHelpful ? 'none' : '1px solid var(--border)', background: notHelpful ? 'var(--danger)' : 'transparent', color: notHelpful ? 'var(--on-danger)' : 'var(--muted)', fontSize: 11, fontWeight: 700, cursor: user ? 'pointer' : 'default' }}
      >
        👎 {counts.notHelpfulCount || 0}
      </button>
    </div>
  );
}

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
              <ReactionRow version={entry.version} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
