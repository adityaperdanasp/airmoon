import { useRef, useState } from 'react';

const THRESHOLD = 60; // px pulled before releasing triggers a refresh
const MAX_PULL = 80;

// A native-feeling pull-to-refresh gesture — none of this app's main list
// pages (Home, SurahList, Doa) had one, despite it being a near-universal
// mobile expectation. Touch-only on purpose (no mouse drag equivalent):
// this is specifically the phone gesture, not a desktop affordance.
//
// Only arms when the page is already scrolled to the very top
// (window.scrollY === 0) at touchstart — otherwise an ordinary downward
// scroll gesture partway down the page would get misread as a pull.
export default function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const active = useRef(false);

  function handleTouchStart(e) {
    if (refreshing || window.scrollY > 0) return;
    startY.current = e.touches[0].clientY;
    active.current = true;
  }

  function handleTouchMove(e) {
    if (!active.current) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) {
      setPullDistance(0);
      return;
    }
    // Diminishing return past the threshold — pulling further doesn't
    // just keep growing the indicator linearly forever, same rubber-band
    // feel as the OS's own overscroll.
    setPullDistance(Math.min(dy * 0.5, MAX_PULL));
  }

  async function handleTouchEnd() {
    if (!active.current) return;
    active.current = false;
    if (pullDistance >= THRESHOLD) {
      setRefreshing(true);
      setPullDistance(48);
      try {
        await onRefresh?.();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }

  const showIndicator = pullDistance > 0 || refreshing;

  return (
    // display:contents so this wrapper doesn't participate in the parent's
    // own flex layout at all — its children (the indicator + whatever page
    // content is passed in) lay out exactly as if this component weren't
    // there, meaning it drops into .screen-content's flex-column/gap
    // layout without needing to reproduce that layout itself. Touch event
    // handlers still fire normally on a display:contents element.
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ display: 'contents' }}>
      <div
        style={{
          height: refreshing ? 48 : pullDistance,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: refreshing || pullDistance === 0 ? 'height 0.2s ease' : 'none',
        }}
      >
        {showIndicator && (
          <div
            className="spinner"
            style={{
              opacity: refreshing ? 1 : Math.min(pullDistance / THRESHOLD, 1),
              transform: refreshing ? 'none' : `rotate(${pullDistance * 3}deg)`,
            }}
          />
        )}
      </div>
      {children}
    </div>
  );
}
