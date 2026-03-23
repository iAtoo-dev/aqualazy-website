'use client';

import { useEffect, useRef, useState } from 'react';

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <defs>
          <linearGradient id="f1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5F1FF" />
            <stop offset="100%" stopColor="#7ED6FF" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" stroke="url(#f1)" strokeWidth="1.5" fill="none" opacity="0.3" />
        <path d="M24 12 C18 12 14 17 14 22 C14 28 18 32 24 34 C30 32 34 28 34 22 C34 17 30 12 24 12Z" fill="url(#f1)" opacity="0.8" />
        <path d="M20 22 L23 25 L28 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Eau certifiée baignade',
    subtitle: 'Normes EN 16713',
    desc: 'Paramètres maintenus dans les seuils OMS. Conformité permanente, automatiquement vérifiée et loggée.',
    stat: '100%',
    statLabel: 'conformité réglementaire',
    color: 'from-[#7ED6FF]/15 to-[#0D3060]/60',
    glow: 'rgba(126,214,255,0.25)',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <defs>
          <linearGradient id="f2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5F1FF" />
            <stop offset="100%" stopColor="#7ED6FF" />
          </linearGradient>
        </defs>
        <path d="M12 36 L20 20 L28 28 L36 12" stroke="url(#f2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="36" cy="12" r="3" fill="url(#f2)" />
        <path d="M8 40 L40 40" stroke="url(#f2)" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
    title: 'Économies garanties',
    subtitle: 'Jusqu\'à −68% de réactifs',
    desc: 'Dosage prédictif à la micro-goutte. Zéro gaspillage, zéro surdosage. Votre piscine coûte moins cher à entretenir.',
    stat: '−68%',
    statLabel: 'de consommation chimique',
    color: 'from-[#A5F1FF]/12 to-[#0A2540]/70',
    glow: 'rgba(165,241,255,0.2)',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <defs>
          <linearGradient id="f3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5F1FF" />
            <stop offset="100%" stopColor="#7ED6FF" />
          </linearGradient>
        </defs>
        <path d="M24 8 L28 16 L38 17 L31 24 L33 34 L24 30 L15 34 L17 24 L10 17 L20 16 Z" stroke="url(#f3)" strokeWidth="1.5" fill="url(#f3)" fillOpacity="0.15" strokeLinejoin="round" />
        <circle cx="24" cy="22" r="4" fill="url(#f3)" opacity="0.9" />
      </svg>
    ),
    title: 'Qualité hôtel 5 étoiles',
    subtitle: 'Standard palace international',
    desc: 'La même eau cristalline que les meilleurs resorts du monde. Chez vous, tous les jours, automatiquement.',
    stat: '5★',
    statLabel: 'niveau de qualité d\'eau',
    color: 'from-[#7ED6FF]/10 to-[#0D3060]/65',
    glow: 'rgba(126,214,255,0.18)',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <defs>
          <linearGradient id="f4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5F1FF" />
            <stop offset="100%" stopColor="#7ED6FF" />
          </linearGradient>
        </defs>
        <rect x="16" y="10" width="16" height="20" rx="8" stroke="url(#f4)" strokeWidth="1.5" fill="url(#f4)" fillOpacity="0.1" />
        <path d="M20 30 L20 38 M28 30 L28 38 M16 38 L32 38" stroke="url(#f4)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="22" r="3" fill="url(#f4)" opacity="0.8" />
      </svg>
    ),
    title: 'Zéro contact chimique',
    subtitle: 'Sécurité famille & enfants',
    desc: 'Produits stockés dans un module hermétiquement scellé. Aucune manipulation manuelle de chlore ou d\'acide.',
    stat: '0×',
    statLabel: 'contact avec les produits',
    color: 'from-[#A5F1FF]/12 to-[#0A2540]/60',
    glow: 'rgba(165,241,255,0.22)',
  },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    e.currentTarget.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px) scale(1.01)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="group relative rounded-3xl overflow-hidden cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.9s ${index * 0.12}s ease, transform 0.9s ${index * 0.12}s ease, box-shadow 0.4s ease`,
        boxShadow: hovered
          ? `0 30px 80px rgba(0,0,0,0.45), 0 0 40px ${feature.glow}`
          : '0 8px 32px rgba(0,0,0,0.25)',
        background: `linear-gradient(145deg, ${feature.color})`,
        border: `1px solid ${hovered ? 'rgba(126,214,255,0.3)' : 'rgba(126,214,255,0.1)'}`,
        transformStyle: 'preserve-3d',
        transitionProperty: 'opacity, transform, box-shadow, border-color',
      }}
    >
      {/* Card background shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(126,214,255,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="p-8 relative z-10">
        {/* Icon */}
        <div className="mb-6 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-400">
          {feature.icon}
        </div>

        {/* Title */}
        <div className="mb-1">
          <span className="text-[#A5F1FF] text-xs font-semibold tracking-widest uppercase">
            {feature.subtitle}
          </span>
        </div>
        <h3
          className="text-white font-bold text-xl mb-3 leading-tight"
          style={{ fontFamily: 'Satoshi, DM Sans, sans-serif', letterSpacing: '-0.015em' }}
        >
          {feature.title}
        </h3>
        <p className="text-white/55 text-sm leading-relaxed">{feature.desc}</p>

        {/* Stat */}
        <div className="mt-6 pt-5 border-t border-white/8">
          <div
            className="text-4xl font-black text-aqua-gradient"
            style={{ fontFamily: 'Satoshi, DM Sans, sans-serif', letterSpacing: '-0.03em' }}
          >
            {feature.stat}
          </div>
          <div className="text-white/40 text-xs mt-1">{feature.statLabel}</div>
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setTitleVisible(true);
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="avantages" className="relative z-10 py-32 px-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(10,37,64,0.88) 0%, rgba(10,37,64,0.75) 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div
          ref={titleRef}
          className="text-center mb-20"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#7ED6FF]/40" />
            <span className="text-[#7ED6FF] text-xs font-semibold tracking-widest uppercase">
              L&apos;excellence
            </span>
            <div className="w-8 h-px bg-[#7ED6FF]/40" />
          </div>

          <h2
            className="text-white mb-5"
            style={{
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            L&apos;excellence dans{' '}
            <span className="text-aqua-gradient">chaque goutte.</span>
          </h2>

          <p className="body-text text-white/55 max-w-xl mx-auto text-base">
            Quatre piliers qui redéfinissent ce que signifie posséder une piscine parfaite.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
          ))}
        </div>

        {/* Bottom marquee */}
        <div className="mt-20 overflow-hidden">
          <div className="marquee-track">
            {[...Array(2)].map((_, k) =>
              ['Eau cristalline · ', 'Dosage automatique · ', 'Économies réelles · ', 'Famille protégée · ', 'Intelligence artificielle · ', 'Zéro contrainte · ', 'Qualité palace · ', 'Garanti 5 ans · '].map((label, i) => (
                <span
                  key={`${k}-${i}`}
                  className="text-white/20 text-sm font-semibold tracking-widest uppercase"
                  style={{ fontFamily: 'Satoshi, DM Sans, sans-serif' }}
                >
                  {label}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
