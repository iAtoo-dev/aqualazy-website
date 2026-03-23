'use client';

const RINGS = [
  { r: 42,  delay: '0s',    dur: '3s'  },
  { r: 62,  delay: '0.5s',  dur: '3.2s' },
  { r: 82,  delay: '1s',    dur: '3.4s' },
  { r: 102, delay: '1.5s',  dur: '3.6s' },
  { r: 122, delay: '2s',    dur: '3.8s' },
  { r: 142, delay: '2.5s',  dur: '4s'  },
];

export default function PulsingWaves() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: 420 }}>
      <svg viewBox="0 0 300 300" width="420" height="420" className="overflow-visible">
        <defs>
          <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A5F1FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7ED6FF" stopOpacity="0.3" />
          </radialGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
          <style>{`
            @keyframes ringPulse {
              0%   { opacity: 0.15; transform: scale(0.92); }
              50%  { opacity: 0.7;  transform: scale(1.04); }
              100% { opacity: 0.15; transform: scale(0.92); }
            }
            @keyframes ringPulse2 {
              0%   { opacity: 0.08; transform: scale(0.95); }
              50%  { opacity: 0.45; transform: scale(1.02); }
              100% { opacity: 0.08; transform: scale(0.95); }
            }
            .ring-pulse {
              transform-origin: 150px 150px;
              animation: ringPulse var(--dur, 3s) ease-in-out var(--delay, 0s) infinite;
            }
            .ring-pulse-2 {
              transform-origin: 150px 150px;
              animation: ringPulse2 var(--dur, 3s) ease-in-out calc(var(--delay, 0s) + 0.25s) infinite;
            }
          `}</style>
        </defs>

        {/* Outer ambient glow */}
        <circle cx="150" cy="150" r="148" fill="none" stroke="rgba(126,214,255,0.04)" strokeWidth="40" />

        {/* Pulsing rings */}
        {RINGS.map((ring, i) => (
          <g key={i}>
            <circle
              className="ring-pulse"
              cx="150" cy="150" r={ring.r}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth={i === 0 ? 2.5 : 1.5}
              // @ts-expect-error CSS custom properties
              style={{ '--dur': ring.dur, '--delay': ring.delay }}
            />
            <circle
              className="ring-pulse-2"
              cx="150" cy="150" r={ring.r + 4}
              fill="none"
              stroke="#A5F1FF"
              strokeWidth="0.5"
              filter="url(#blur)"
              // @ts-expect-error CSS custom properties
              style={{ '--dur': ring.dur, '--delay': ring.delay }}
            />
          </g>
        ))}

        {/* Center fill */}
        <circle cx="150" cy="150" r="38" fill="rgba(126,214,255,0.06)" />
        <circle cx="150" cy="150" r="28" fill="rgba(126,214,255,0.08)" />
      </svg>
    </div>
  );
}
