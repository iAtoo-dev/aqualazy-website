'use client';

export default function Footer() {
  return (
    <footer className="relative z-10 py-12 px-6 border-t border-white/6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(10,37,64,0.95)' }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8">
                <defs>
                  <linearGradient id="footDrop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A5F1FF" />
                    <stop offset="100%" stopColor="#7ED6FF" />
                  </linearGradient>
                </defs>
                <path
                  d="M18 3 C18 3, 8 16, 8 22 C8 28.627 12.477 33 18 33 C23.523 33 28 28.627 28 22 C28 16 18 3 18 3Z"
                  fill="url(#footDrop)"
                  opacity="0.85"
                />
              </svg>
              <span
                className="text-lg font-black"
                style={{ fontFamily: 'Satoshi, DM Sans, sans-serif', letterSpacing: '-0.02em' }}
              >
                <span className="text-white">AQUA</span>
                <span className="text-aqua-gradient">LAZY</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-5">
              Le système autonome de traitement de l&apos;eau de piscine qui redéfinit
              l&apos;expérience de la baignade.
            </p>
            <div className="flex gap-3">
              {['Instagram', 'LinkedIn', 'YouTube'].map(s => (
                <button
                  key={s}
                  className="w-8 h-8 rounded-full glass-light text-white/50 hover:text-white hover:border-[#7ED6FF]/40 transition-all text-xs font-medium"
                >
                  {s[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Produit */}
          <div>
            <h4
              className="text-white text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ fontFamily: 'Satoshi, DM Sans, sans-serif' }}
            >
              Produit
            </h4>
            <ul className="space-y-2.5 text-white/40 text-sm">
              {['Technologie', 'Installation', 'App mobile', 'Tarifs', 'Partenaires'].map(l => (
                <li key={l}>
                  <a href="#" className="hover:text-white/70 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className="text-white text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ fontFamily: 'Satoshi, DM Sans, sans-serif' }}
            >
              Support
            </h4>
            <ul className="space-y-2.5 text-white/40 text-sm">
              {['Centre d\'aide', 'FAQ', 'Garantie', 'Contact', 'Mentions légales'].map(l => (
                <li key={l}>
                  <a href="#" className="hover:text-white/70 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © 2026 AQUALAZY SAS — Tous droits réservés · France
          </p>
          <div className="flex gap-5 text-white/25 text-xs">
            <a href="#" className="hover:text-white/50 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white/50 transition-colors">CGV</a>
            <a href="#" className="hover:text-white/50 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
