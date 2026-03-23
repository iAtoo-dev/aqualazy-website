'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [gone, setGone] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade-out after water drop animation (1.8s)
    const t1 = setTimeout(() => setFading(true), 1900);
    // Remove from DOM after transition ends
    const t2 = setTimeout(() => setGone(true), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;

  return (
    <div
      id="loading-screen"
      className={fading ? 'fade-out' : ''}
      aria-hidden
    >
      <div className="flex flex-col items-center gap-6">
        <div className="water-drop" />
        <span
          className="text-white/40 text-xs tracking-widest uppercase"
          style={{ fontFamily: 'Satoshi, DM Sans, sans-serif', opacity: fading ? 0 : 1, transition: 'opacity 0.5s' }}
        >
          AQUALAZY
        </span>
      </div>
    </div>
  );
}
