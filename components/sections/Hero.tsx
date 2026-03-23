'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import HeroRipple from '@/components/HeroRipple';

/* Floating light particle */
function Particle({ style }: { style: React.CSSProperties }) {
  return <div className="particle" style={style} />;
}

const PARTICLES = [
  { width: 4, height: 4, top: '15%', left: '10%', '--duration': '9s', '--delay': '0s' },
  { width: 6, height: 6, top: '25%', left: '75%', '--duration': '7s', '--delay': '1.5s' },
  { width: 3, height: 3, top: '60%', left: '20%', '--duration': '11s', '--delay': '0.8s' },
  { width: 5, height: 5, top: '45%', left: '85%', '--duration': '8s', '--delay': '2s' },
  { width: 4, height: 4, top: '70%', left: '50%', '--duration': '10s', '--delay': '1s' },
  { width: 8, height: 8, top: '20%', left: '45%', '--duration': '12s', '--delay': '3s' },
  { width: 3, height: 3, top: '80%', left: '30%', '--duration': '7s', '--delay': '0.5s' },
  { width: 5, height: 5, top: '35%', left: '92%', '--duration': '9s', '--delay': '2.5s' },
] as const;

export default function Hero() {
  const titleRef  = useRef<HTMLHeadingElement>(null);
  const subRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Staggered entrance animation via class toggles
    const els = [titleRef.current, subRef.current, ctaRef.current, badgesRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
      setTimeout(() => {
        if (!el) return;
        el.style.transition = 'opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 300 + i * 160);
    });
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* ── Background photo ──────────────────────────────────────
          Beautiful pool scene. object-position centres on the water
          surface / family area.
      ─────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Image
          src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1920&q=80"
          alt="Famille profitant d'une piscine cristalline"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 65%' }}
        />

        {/* Layer 1 — color-harmony tint
            mix-blend-mode: multiply shifts pool warmth → our deep ocean blue
            without killing the photo detail */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(8, 32, 58, 0.42)',
            mixBlendMode: 'multiply',
          }}
        />

        {/* Layer 2 — atmospheric gradient
            Heavy at top for header legibility, light in the middle to
            reveal pool & villa, gentle vignette at bottom. */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10,37,64,0.80) 0%, rgba(10,37,64,0.30) 35%, rgba(10,37,64,0.05) 58%, rgba(10,37,64,0.50) 100%)',
          }}
        />

        {/* Layer 3 — subtle aqua chromatic veil
            Keeps the pool water harmonised with #7ED6FF / #A5F1FF */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 110% 70% at 50% 62%, rgba(126,214,255,0.10) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* WebGL ripple — cursor & touch interaction, hero only */}
      <HeroRipple />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <Particle
          key={i}
          style={{
            width: p.width,
            height: p.height,
            top: p.top,
            left: p.left,
            // @ts-expect-error CSS custom properties
            '--duration': p['--duration'],
            '--delay': p['--delay'],
          }}
        />
      ))}

      {/* Radial aqua glow behind title */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[2]"
        style={{
          width: 700,
          height: 700,
          background: 'radial-gradient(ellipse at center, rgba(126,214,255,0.12) 0%, transparent 65%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Eyebrow label */}
        <div className="inline-flex items-center gap-2 glass-light rounded-full px-4 py-2 mb-8 text-xs font-semibold tracking-widest text-[#A5F1FF] uppercase">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7ED6FF] animate-pulse" />
          Technologie de piscine nouvelle génération
        </div>

        {/* Hero Title */}
        <h1
          ref={titleRef}
          className="heading-display mb-6"
          style={{
            fontFamily: 'Satoshi, DM Sans, system-ui, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            letterSpacing: '-0.03em',
            lineHeight: '1.03',
          }}
        >
          <span className="block text-white">AQUALAZY</span>
          <span className="block text-shimmer">L&apos;eau parfaite,</span>
          <span className="block text-white">sans effort.</span>
        </h1>

        {/* Sub-headline */}
        <p
          ref={subRef}
          className="body-text text-white/65 max-w-2xl mx-auto mb-10 text-lg leading-relaxed"
        >
          Le premier système entièrement autonome qui maintient votre piscine en parfait état,
          24h/24 — <em className="text-[#A5F1FF] not-italic font-medium">cristalline, équilibrée, silencieuse.</em>{' '}
          Profitez. Nous gérons.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <button
            onClick={() => scrollTo('#contact')}
            className="btn-aqua px-8 py-4 text-base font-bold ripple-container"
          >
            Découvrir mon eau parfaite
          </button>
          <button
            onClick={() => scrollTo('#technologie')}
            className="btn-outline px-8 py-4 text-base"
          >
            Voir la technologie →
          </button>
        </div>

        {/* Trust badges */}
        <div ref={badgesRef} className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm">
          {[
            { icon: '✦', text: 'Installation en 2h' },
            { icon: '✦', text: 'Compatible toutes piscines' },
            { icon: '✦', text: 'Garanti 5 ans' },
            { icon: '✦', text: 'Certifié CE' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#7ED6FF] text-xs">{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-50">
        <span className="text-white/50 text-xs tracking-widest uppercase">Découvrir</span>
        <div className="w-px h-12 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              height: '100%',
              background: 'linear-gradient(180deg, transparent, #7ED6FF, transparent)',
              animation: 'scrollDrop 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

    </section>
  );
}
