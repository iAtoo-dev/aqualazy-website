'use client';

import { useEffect, useRef } from 'react';
import ProductViewer3D from '@/components/ProductViewer3D';

const FEATURES = [
  {
    icon: '◎',
    title: 'Analyse physico-chimique en temps réel',
    desc: 'Capteurs de précision laboratoire intégrés — pH, chlore, ORP, température — mesures toutes les 30 secondes.',
  },
  {
    icon: '⬡',
    title: 'Dosage électronique ultra-précis',
    desc: 'Injection micropéristaltique avec précision ±0,02 mL. Ni surdosage, ni carence. Jamais.',
  },
  {
    icon: '◈',
    title: 'Intelligence prédictive locale',
    desc: 'Algorithme embarqué qui anticipe la charge bactériologique selon météo, utilisation et historique.',
  },
  {
    icon: '◉',
    title: 'Connectivity & cloud monitoring',
    desc: "Rapports hebdomadaires. Alertes push en cas d'anomalie. Accès complet depuis l'app AquaLazy.",
  },
];

export default function Technology() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef   = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const items = itemsRef.current;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="technologie"
      ref={sectionRef}
      className="relative z-10 py-32 px-6 overflow-hidden"
    >
      {/* Background layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(10,37,64,0.92) 0%, rgba(13,48,96,0.85) 50%, rgba(10,37,64,0.92) 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Section eyebrow */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#7ED6FF]" />
          <span className="text-[#7ED6FF] text-xs font-semibold tracking-widest uppercase">
            Technologie
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left – 3D product viewer */}
          <div
            ref={el => { if (el) itemsRef.current[0] = el; }}
            className="relative"
            style={{ opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1s ease, transform 1s ease' }}
          >
            {/* Product viewer container */}
            <div
              className="relative rounded-3xl overflow-hidden glass-card"
              style={{
                height: 520,
                boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(126,214,255,0.12)',
              }}
            >
              <ProductViewer3D />

              {/* Overlay info chips */}
              <div className="absolute bottom-5 left-5 right-5 flex justify-between">
                <div className="glass-light rounded-xl px-3 py-2 text-xs text-white/70">
                  <span className="text-[#7ED6FF] font-semibold">pH</span> 7.2 ±0.02
                </div>
                <div className="glass-light rounded-xl px-3 py-2 text-xs text-white/70">
                  <span className="text-[#7ED6FF] font-semibold">Cl</span> 0.8 mg/L
                </div>
                <div className="glass-light rounded-xl px-3 py-2 text-xs text-white/70">
                  <span className="text-[#7ED6FF] font-semibold">ORP</span> 740 mV
                </div>
              </div>

              {/* Status badge */}
              <div className="absolute top-5 right-5 flex items-center gap-2 glass-light rounded-full px-3 py-1.5 text-xs text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Actif · Optimal
              </div>
            </div>

            {/* Ambient glow */}
            <div
              className="absolute -inset-10 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(126,214,255,0.06) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
          </div>

          {/* Right – Text + Features */}
          <div
            ref={el => { if (el) itemsRef.current[1] = el; }}
            style={{ opacity: 0, transform: 'translateY(40px)', transition: 'opacity 1s 0.2s ease, transform 1s 0.2s ease' }}
          >
            <h2
              className="heading-section mb-6 text-white"
              style={{
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.12,
              }}
            >
              La technologie{' '}
              <span className="text-aqua-gradient">invisible</span>{' '}
              qui transforme votre eau.
            </h2>

            <p className="body-text text-white/60 mb-10 text-base leading-relaxed max-w-lg">
              AQUALAZY se connecte discrètement à votre circuit hydraulique. Aucune intervention
              manuelle. Aucun produit à manipuler. Une eau impeccable, chaque matin.
            </p>

            <div className="space-y-5">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  ref={el => { if (el) itemsRef.current[2 + i] = el; }}
                  className="group flex gap-4 p-4 rounded-2xl glass-card card-lift cursor-default"
                  style={{
                    opacity: 0,
                    transform: 'translateY(24px)',
                    transition: `opacity 0.8s ${0.3 + i * 0.1}s ease, transform 0.8s ${0.3 + i * 0.1}s ease`,
                  }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#7ED6FF]/20 to-[#A5F1FF]/10 flex items-center justify-center text-[#7ED6FF] text-lg group-hover:scale-110 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1" style={{ fontFamily: 'Satoshi, DM Sans, sans-serif' }}>
                      {f.title}
                    </h3>
                    <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Spec pills */}
            <div className="flex flex-wrap gap-2 mt-8">
              {['IP68 · Étanche', 'Wi-Fi 6', 'BLE 5.2', 'UL Certifié', '220V / 24V DC'].map(spec => (
                <span
                  key={spec}
                  className="text-xs text-[#A5F1FF]/80 border border-[#7ED6FF]/20 rounded-full px-3 py-1 font-medium tracking-wide"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
