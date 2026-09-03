import { useEffect, useState } from 'react';

const COLORS = ['#e8b84b', '#2fa190', '#ffffff', '#0d4d47', '#f0cd7b'];
const COUNT = 40;

function randomParticle(i) {
  return {
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 1.4 + Math.random() * 0.8,
    size: 6 + Math.random() * 6,
    color: COLORS[i % COLORS.length],
    rotate: Math.random() * 360,
  };
}

// A one-shot celebratory particle burst — plain CSS (no canvas/library),
// absolutely positioned over whatever card renders it (that card must be
// position:relative — this is deliberately NOT portalled to document.body,
// it celebrates one specific card, not the whole screen). Self-removes
// via onComplete once every particle's animation has had time to finish.
// Respects prefers-reduced-motion — calls onComplete immediately and
// renders nothing there, matching this app's other animations.
export default function Confetti({ onComplete }) {
  const [particles] = useState(() => Array.from({ length: COUNT }, (_, i) => randomParticle(i)));
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) {
      onComplete?.();
      return;
    }
    const t = setTimeout(() => onComplete?.(), 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onComplete
    // comes from a parent state setter, stable enough for a one-shot timer.
  }, []);

  if (reduceMotion) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
      {particles.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: -10,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            borderRadius: 2,
            transform: `rotate(${p.rotate}deg)`,
            animation: `airmoon-confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes airmoon-confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(160px) rotate(540deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
