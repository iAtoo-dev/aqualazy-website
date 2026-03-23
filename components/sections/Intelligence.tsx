'use client';

import { useEffect, useRef, useState } from 'react';
import PulsingWaves from '@/components/PulsingWaves';

const STEPS = [
  {
    num: '01',
    title: 'Analyse nocturne',
    desc: 'Pendant que vous dormez, AQUALAZY effectue son bilan complet. Mesures multiplex, calibration des capteurs, évaluation de la qualité.',
    time: '23h00 – 00h30',
  },
  {
    num: '02',
    title: 'Calcul prédictif',
    desc: 'L\'algorithme croise météo du lendemain, prévision d\'utilisation et historique. Il calcule exactement ce dont votre eau aura besoin.',
    time: '00h30 – 01h00',
  },
  {
    num: '03',
    title: 'Dosage ciblé',
    desc: 'Injection ultra-précise des réactifs nécessaires, aux concentrations exactes, aux moments optimaux du cycle de filtration.',
    time: '01h00 – 03h00',
  },
  {
    num: '04',
    title: 'Rapport & validation',
    desc: 'Rapport disponible à 7h dans votre app. Eau validée. Piscine prête. Votre journée commence avec une eau d\'exception.',
    time: 'Dès 07h00',
  },
];

export default function Intelligence() {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(STEPS.length).fill(false));
  const [titleVisible, setTitleVisible] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const i = itemRefs.current.indexOf(entry.target as HTMLDivElement);
          if (i !== -1 && entry.isIntersecting) {
            setVisibleItems(prev => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    itemRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="intelligence" className="relative z-10 py-32 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(10,37,64,0.9) 0%, rgba(13,48,96,0.85) 50%, rgba(10,37,64,0.9) 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left – Numbered steps */}
          <div>
            {/* Header */}
            <div
              ref={titleRef}
              style={{
                opacity: titleVisible ? 1 : 0,
                transform: titleVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.9s ease, transform 0.9s ease',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[#7ED6FF]/40" />
                <span className="text-[#7ED6FF] text-xs font-semibold tracking-widest uppercase">
                  Fonctionnement
                </span>
              </div>

              <h2
                className="text-white mb-6"
                style={{
                  fontFamily: 'Helvetica Neue, Arial, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.12,
                }}
              >
                L&apos;intelligence{' '}
                <span className="text-aqua-gradient">nocturne.</span>
              </h2>

              <p className="body-text text-white/55 mb-12 max-w-md text-base">
                Chaque nuit, un cycle invisible d&apos;optimisation garantit
                que vous plongez dans une eau parfaite dès le lendemain matin.
              </p>
            </div>

            {/* Steps */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[22px] top-4 bottom-4 w-px bg-gradient-to-b from-[#7ED6FF]/40 via-[#7ED6FF]/20 to-transparent" />

              <div className="space-y-8">
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    ref={el => { itemRefs.current[i] = el; }}
                    className="relative flex gap-5"
                    style={{
                      opacity: visibleItems[i] ? 1 : 0,
                      transform: visibleItems[i] ? 'translateX(0)' : 'translateX(-20px)',
                      transition: `opacity 0.8s ${i * 0.15}s ease, transform 0.8s ${i * 0.15}s ease`,
                    }}
                  >
                    {/* Number badge */}
                    <div className="flex-shrink-0 w-11 h-11 rounded-full glass-card flex items-center justify-center relative z-10">
                      <span
                        className="text-xs font-black text-aqua-gradient"
                        style={{ fontFamily: 'Satoshi, DM Sans, sans-serif' }}
                      >
                        {step.num}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="pt-1.5">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3
                          className="text-white font-bold text-base"
                          style={{ fontFamily: 'Satoshi, DM Sans, sans-serif' }}
                        >
                          {step.title}
                        </h3>
                        <span className="text-[#7ED6FF]/60 text-xs font-mono">{step.time}</span>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right – Pulsing concentric water rings */}
          <div className="flex items-center justify-center">
            <div className="relative" style={{ width: 420, height: 420 }}>
              <PulsingWaves />

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className="text-5xl font-black text-aqua-gradient mb-2"
                  style={{ fontFamily: 'Satoshi, DM Sans, sans-serif', letterSpacing: '-0.03em' }}
                >
                  24/7
                </div>
                <div className="text-white/60 text-sm text-center leading-tight">
                  Surveillance<br />continue
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
