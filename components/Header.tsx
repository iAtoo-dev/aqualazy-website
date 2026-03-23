'use client';

import { useEffect, useRef, useState } from 'react';

const NAV_ITEMS = [
  { label: 'Concept',        href: '#technologie' },
  { label: 'Avantages',      href: '#avantages' },
  { label: 'Fonctionnement', href: '#intelligence' },
  { label: 'Expérience',     href: '#temoignages' },
];

export default function Header() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeSection, setActive] = useState('');
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Intersection observer for active nav item
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
          : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={() => handleNav('#hero')}
          className="flex items-center gap-3 group"
        >
          {/* Water drop SVG logo */}
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7ED6FF] to-[#A5F1FF] opacity-20 group-hover:opacity-40 blur-md transition-opacity duration-300" />
            <svg viewBox="0 0 36 36" fill="none" className="w-full h-full relative z-10">
              <defs>
                <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A5F1FF" />
                  <stop offset="100%" stopColor="#7ED6FF" />
                </linearGradient>
              </defs>
              <path
                d="M18 3 C18 3, 8 16, 8 22 C8 28.627 12.477 33 18 33 C23.523 33 28 28.627 28 22 C28 16 18 3 18 3Z"
                fill="url(#dropGrad)"
                opacity="0.9"
              />
              <path
                d="M14 22 C13 19, 15 16, 18 15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          </div>
          <span
            className="heading-display text-xl tracking-tight"
            style={{ fontFamily: 'Satoshi, DM Sans, system-ui, sans-serif', fontWeight: 900 }}
          >
            <span className="text-white">AQUA</span>
            <span className="text-aqua-gradient">LAZY</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full
                  ${isActive
                    ? 'text-[#A5F1FF]'
                    : 'text-white/70 hover:text-white'
                  }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-white/6 border border-[rgba(126,214,255,0.2)]" />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNav('#contact')}
            className="btn-aqua px-5 py-2.5 text-sm font-semibold"
          >
            Commencer l&apos;expérience
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-6 py-4 flex flex-col gap-2 glass-light mt-2 mx-4 rounded-2xl">
          {NAV_ITEMS.map(item => (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className="text-white/80 hover:text-white py-2.5 text-base font-medium text-left border-b border-white/10 last:border-0 transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('#contact')}
            className="btn-aqua mt-2 py-3 text-sm font-semibold w-full"
          >
            Commencer l&apos;expérience
          </button>
        </nav>
      </div>
    </header>
  );
}
