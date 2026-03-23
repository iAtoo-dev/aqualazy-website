'use client';

import { useEffect, useRef, useState } from 'react';

const TESTIMONIALS = [
  {
    name: 'Sophie Marchand',
    role: 'Propriétaire villa, Côte d\'Azur',
    avatar: 'SM',
    avatarBg: 'from-[#7ED6FF] to-[#A5F1FF]',
    quote: 'Je ne touche plus jamais à ma piscine depuis AQUALAZY. L\'eau est d\'une clarté absolue, même après une soirée avec 20 personnes. C\'est proprement magique.',
    stars: 5,
    badge: 'Utilisateur depuis 18 mois',
  },
  {
    name: 'Jean-Baptiste Loreau',
    role: 'Architecte, Bassin d\'Arcachon',
    avatar: 'JL',
    avatarBg: 'from-[#A5F1FF] to-[#7ED6FF]',
    quote: 'La qualité de l\'eau surpasse celle de tous les hôtels que je fréquente. Mon installateur était sceptique — maintenant il en recommande un à chacun de ses clients.',
    stars: 5,
    badge: 'Vérifié · Confiance garantie',
  },
  {
    name: 'Isabelle Petit',
    role: 'Maman de 3 enfants, Lyon',
    avatar: 'IP',
    avatarBg: 'from-[#D4F6FF] to-[#A5F1FF]',
    quote: 'Mes enfants ont la peau sensible. Avant, le chlore leur irritait les yeux et la peau. Avec AQUALAZY, fini les problèmes — et l\'eau est encore plus propre. Incroyable.',
    stars: 5,
    badge: 'Famille recommandée',
  },
  {
    name: 'Renaud & Claire Dupuis',
    role: 'Résidence secondaire, Luberon',
    avatar: 'RD',
    avatarBg: 'from-[#7ED6FF] to-[#D4F6FF]',
    quote: 'Nous arrivons le vendredi soir. La piscine est impeccable, comme si elle venait d\'être nettoyée. On n\'a plus à anticiper l\'entretien avant chaque week-end. Libérateur.',
    stars: 5,
    badge: 'Résidence secondaire',
  },
  {
    name: 'Thomas Aubert',
    role: 'Chef étoilé, Provence',
    avatar: 'TA',
    avatarBg: 'from-[#A5F1FF] to-[#D4F6FF]',
    quote: 'En cuisine, on parle de précision. AQUALAZY applique les mêmes standards à l\'eau de ma piscine. J\'apprécie cette rigueur. Et mes invités adorent nager.',
    stars: 5,
    badge: 'Utilisateur premium',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 16 16" className="w-4 h-4" fill="#7ED6FF">
          <path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.5l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t, index, active }: {
  t: typeof TESTIMONIALS[0];
  index: number;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    e.currentTarget.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    setHovered(false);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="relative rounded-3xl p-7 cursor-default"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
        transition: `all 0.8s ${index * 0.1}s cubic-bezier(0.4,0,0.2,1)`,
        background: 'rgba(10,37,64,0.6)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${hovered ? 'rgba(126,214,255,0.3)' : 'rgba(126,214,255,0.12)'}`,
        boxShadow: hovered
          ? '0 30px 70px rgba(0,0,0,0.45), 0 0 30px rgba(126,214,255,0.15)'
          : '0 10px 40px rgba(0,0,0,0.25)',
        transformStyle: 'preserve-3d',
        transitionProperty: 'opacity, transform, box-shadow, border-color',
      }}
    >
      {/* Quote mark */}
      <div
        className="absolute top-5 right-6 text-6xl font-black text-[#7ED6FF]/8 select-none pointer-events-none"
        style={{ fontFamily: 'Georgia, serif', lineHeight: 1 }}
        aria-hidden
      >
        "
      </div>

      <StarRating count={t.stars} />

      <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author row */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center`}
        >
          <span className="text-[#0A2540] text-xs font-black">{t.avatar}</span>
        </div>
        <div>
          <div
            className="text-white text-sm font-semibold"
            style={{ fontFamily: 'Satoshi, DM Sans, sans-serif' }}
          >
            {t.name}
          </div>
          <div className="text-white/45 text-xs">{t.role}</div>
        </div>

        <div className="ml-auto">
          <span className="text-[#7ED6FF]/70 text-xs border border-[#7ED6FF]/20 rounded-full px-2.5 py-1">
            {t.badge}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="temoignages"
      ref={sectionRef}
      className="relative z-10 py-32 px-6"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(10,37,64,0.88) 0%, rgba(13,48,96,0.82) 50%, rgba(10,37,64,0.88) 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#7ED6FF]/40" />
            <span className="text-[#7ED6FF] text-xs font-semibold tracking-widest uppercase">
              Témoignages
            </span>
            <div className="w-8 h-px bg-[#7ED6FF]/40" />
          </div>

          <h2
            className="text-white mb-4"
            style={{
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1.12,
            }}
          >
            Ils vivent l&apos;expérience{' '}
            <span className="text-aqua-gradient">AquaLazy.</span>
          </h2>

          <p className="text-white/50 max-w-md mx-auto text-base">
            Plus de 2 400 familles ont déjà transformé leur rapport à la piscine.
          </p>

          {/* Global rating */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} viewBox="0 0 16 16" className="w-5 h-5" fill="#7ED6FF">
                  <path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.5l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1z" />
                </svg>
              ))}
            </div>
            <span className="text-white font-bold text-lg" style={{ fontFamily: 'Satoshi, DM Sans, sans-serif' }}>4.97</span>
            <span className="text-white/40 text-sm">/ 5 · 2 438 avis vérifiés</span>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} active={visible} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-5 max-w-2xl mx-auto lg:max-w-none lg:grid-cols-2">
          {TESTIMONIALS.slice(3).map((t, i) => (
            <TestimonialCard key={i} t={t} index={i + 3} active={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
