'use client';

import { useEffect, useRef, useState } from 'react';

const TRUST_BADGES = [
  { icon: '🔒', label: 'Données sécurisées', sub: 'RGPD conforme' },
  { icon: '⭐', label: '4.97 / 5', sub: '2 438 avis' },
  { icon: '🔧', label: 'Installation comprise', sub: 'À domicile' },
  { icon: '💳', label: 'Sans engagement', sub: 'Résiliable 24h' },
];

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
    type: '',
    message: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10 py-32 px-6 overflow-hidden"
    >
      {/* Deep teal water background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(10,37,64,0.97) 0%, rgba(13,48,96,0.95) 45%, rgba(10,37,64,0.97) 100%)',
        }}
      />

      {/* Decorative concentric glow */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(ellipse at center, rgba(126,214,255,0.08) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left – Copy */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#7ED6FF]/40" />
              <span className="text-[#7ED6FF] text-xs font-semibold tracking-widest uppercase">
                Commencer
              </span>
            </div>

            <h2
              className="text-white mb-6"
              style={{
                fontFamily: 'Helvetica Neue, Arial, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
              }}
            >
              Votre piscine mérite{' '}
              <span className="text-aqua-gradient">la perfection.</span>
            </h2>

            <p className="body-text text-white/55 mb-10 text-base max-w-lg leading-relaxed">
              Demandez votre démonstration gratuite. Nos experts vous présentent AQUALAZY
              chez vous, analysent votre installation et vous proposent une solution sur-mesure.
              <span className="block mt-3 text-[#A5F1FF]/80 font-medium">
                Sans frais. Sans engagement. En 48h.
              </span>
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {TRUST_BADGES.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 glass-card rounded-2xl px-4 py-3"
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.8s ${0.3 + i * 0.1}s ease`,
                  }}
                >
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <div className="text-white text-xs font-semibold">{b.label}</div>
                    <div className="text-white/40 text-xs">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Form */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.9s 0.2s ease, transform 0.9s 0.2s ease',
            }}
          >
            <div
              className="rounded-3xl p-8 lg:p-10"
              style={{
                background: 'rgba(13,48,96,0.4)',
                backdropFilter: 'blur(28px)',
                border: '1px solid rgba(126,214,255,0.15)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
              }}
            >
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7ED6FF] to-[#A5F1FF] flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-[#0A2540]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3
                    className="text-white text-2xl font-bold mb-2"
                    style={{ fontFamily: 'Satoshi, DM Sans, sans-serif' }}
                  >
                    Demande envoyée !
                  </h3>
                  <p className="text-white/55 text-sm">
                    Notre équipe vous contacte sous 24h pour organiser votre démonstration.
                  </p>
                </div>
              ) : (
                <>
                  <h3
                    className="text-white font-bold text-xl mb-1"
                    style={{ fontFamily: 'Satoshi, DM Sans, sans-serif', letterSpacing: '-0.02em' }}
                  >
                    Démonstration gratuite
                  </h3>
                  <p className="text-white/45 text-sm mb-7">
                    Réponse garantie sous 48h · Sans engagement
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/50 text-xs mb-1.5 font-medium">Prénom *</label>
                        <input
                          type="text"
                          required
                          placeholder="Sophie"
                          className="input-aqua"
                          value={form.prenom}
                          onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs mb-1.5 font-medium">Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="vous@email.fr"
                          className="input-aqua"
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/50 text-xs mb-1.5 font-medium">Téléphone</label>
                      <input
                        type="tel"
                        placeholder="+33 6 00 00 00 00"
                        className="input-aqua"
                        value={form.telephone}
                        onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/50 text-xs mb-1.5 font-medium">Ville</label>
                        <input
                          type="text"
                          placeholder="Nice"
                          className="input-aqua"
                          value={form.ville}
                          onChange={e => setForm(f => ({ ...f, ville: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs mb-1.5 font-medium">Type de piscine</label>
                        <select
                          className="input-aqua"
                          value={form.type}
                          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                          style={{ background: 'rgba(255,255,255,0.05)', color: form.type ? 'white' : 'rgba(165,241,255,0.4)' }}
                        >
                          <option value="" disabled>Choisir...</option>
                          <option value="outdoor" style={{ background: '#0A2540' }}>Extérieure</option>
                          <option value="indoor" style={{ background: '#0A2540' }}>Intérieure</option>
                          <option value="spa" style={{ background: '#0A2540' }}>Spa / Jacuzzi</option>
                          <option value="hotel" style={{ background: '#0A2540' }}>Hôtel / Resort</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/50 text-xs mb-1.5 font-medium">Message (optionnel)</label>
                      <textarea
                        rows={3}
                        placeholder="Volume de la piscine, questions particulières..."
                        className="input-aqua resize-none"
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-aqua w-full py-4 text-base font-bold relative overflow-hidden"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-[#0A2540]/30 border-t-[#0A2540] rounded-full animate-spin" />
                          Envoi en cours...
                        </span>
                      ) : (
                        'Demander ma démonstration gratuite →'
                      )}
                    </button>

                    <p className="text-center text-white/30 text-xs">
                      En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
                      Aucune carte bancaire requise.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
