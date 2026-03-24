'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────
   TECHNOLOGY — EXPLODED VIEW SCROLL SCRUBBER
   · 181 JPEG frames preloaded into Image[] array
   · Canvas draws current frame based on scroll progress
   · mix-blend-mode: screen → black bg becomes transparent,
     product floats above the ocean gradient of the site
   · 4 feature callouts anchored to frame-range windows
   · Vertical progress pill, frame counter, spec chips
───────────────────────────────────────────────────────────── */

const TOTAL = 181;
const SCROLL_MULTIPLIER = 5; // section height = 5 × 100vh

const frame = (i: number) =>
  `/frames-jpg/frame-${String(i).padStart(3, '0')}.jpg`;

interface Callout {
  title: string;
  desc: string;
  detail: string;
  side: 'left' | 'right';
  vPos: string; // top %
  start: number; // 0-1 scroll progress
  end: number;
}

const CALLOUTS: Callout[] = [
  {
    title: 'Capteurs physico-chimiques',
    desc: 'pH · Chlore libre · ORP · Température',
    detail: 'Précision laboratoire — mesure toutes les 30 s',
    side: 'left',
    vPos: '28%',
    start: 0.05,
    end: 0.32,
  },
  {
    title: 'Dosage micropéristaltique',
    desc: 'Injection ±0,02 mL · Zéro contact',
    detail: 'Ni surdosage, ni carence — jamais',
    side: 'right',
    vPos: '42%',
    start: 0.28,
    end: 0.55,
  },
  {
    title: 'Unité de contrôle IA',
    desc: 'Algorithme prédictif embarqué',
    detail: 'Anticipe la charge bactériologique en temps réel',
    side: 'left',
    vPos: '55%',
    start: 0.52,
    end: 0.78,
  },
  {
    title: 'Connectivité Wi-Fi 6 · BLE 5.2',
    desc: 'App AquaLazy · Alertes push',
    detail: 'Monitoring cloud sécurisé AES-256',
    side: 'right',
    vPos: '32%',
    start: 0.72,
    end: 1.0,
  },
];

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function TechnologyExploded() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const imagesRef     = useRef<HTMLImageElement[]>([]);
  const loadedRef     = useRef<boolean[]>(new Array(TOTAL).fill(false));
  const progressRef   = useRef(0);
  const rafRef        = useRef(0);
  const lastFrameRef  = useRef(-1);

  const [progress, setProgress]       = useState(0);
  const [loadCount, setLoadCount]     = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [inView, setInView]           = useState(false);

  /* ── Preload all frames ───────────────────────────────────── */
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 0; i < TOTAL; i++) {
      const img = new Image();
      img.onload = () => {
        loadedRef.current[i] = true;
        loaded++;
        setLoadCount(loaded);
      };
      // Stagger batches of 20 to avoid flooding the network
      img.src = frame(i + 1);
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  /* ── Draw frame to canvas ─────────────────────────────────── */
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = imagesRef.current[idx];
    if (!img || !loadedRef.current[idx]) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const ar = 960 / 540; // frame aspect ratio
    const ca = cw / ch;

    // Object-fit: contain (letterbox/pillarbox)
    let dw, dh, dx, dy;
    if (ca > ar) {
      dh = ch; dw = ch * ar;
      dx = (cw - dw) / 2; dy = 0;
    } else {
      dw = cw; dh = cw / ar;
      dx = 0; dy = (ch - dh) / 2;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    lastFrameRef.current = idx;
  }, []);

  /* ── Resize canvas ────────────────────────────────────────── */
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    setCanvasReady(true);
    drawFrame(lastFrameRef.current < 0 ? 0 : lastFrameRef.current);
  }, [drawFrame]);

  /* ── Scroll handler — show fixed viewer only when inside section ─── */
  useEffect(() => {
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function onScroll() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollableH = section.offsetHeight - window.innerHeight;

      // Active only when section top has passed viewport top AND
      // section bottom is still below viewport top (true sticky zone)
      const active = rect.top <= 0 && rect.bottom > window.innerHeight * 0.1;
      setInView(active);

      if (active) {
        const p = Math.max(0, Math.min(1, -rect.top / scrollableH));
        progressRef.current = p;
        setProgress(p);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // RAF loop — smooth frame stepping
    function loop() {
      const p = progressRef.current;
      const idx = Math.min(TOTAL - 1, Math.round(p * (TOTAL - 1)));
      if (idx !== lastFrameRef.current) drawFrame(idx);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [resize, drawFrame]);

  const loadFraction = loadCount / TOTAL;
  const currentFrame = Math.round(progress * (TOTAL - 1)) + 1;

  /* ── Callout visibility helpers ───────────────────────────── */
  function calloutOpacity(c: Callout): number {
    const fadeLen = 0.04;
    if (progress < c.start || progress > c.end) return 0;
    if (progress < c.start + fadeLen) return (progress - c.start) / fadeLen;
    if (progress > c.end - fadeLen) return (c.end - progress) / fadeLen;
    return 1;
  }
  function calloutTranslate(c: Callout): string {
    const op = calloutOpacity(c);
    const dir = c.side === 'left' ? -1 : 1;
    const x = (1 - op) * dir * 18;
    return `translateX(${x}px)`;
  }

  return (
    <section
      id="technologie"
      ref={sectionRef}
      style={{
        position: 'relative',
        zIndex: 10,
        height: `${SCROLL_MULTIPLIER * 100}vh`,
        background: 'linear-gradient(180deg, #050D1A 0%, #0A2540 50%, #050D1A 100%)',
      }}
    >
      {/* ── Fixed viewer — visible only while section is in viewport ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          zIndex: 10,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #050D1A 0%, #0A2540 50%, #050D1A 100%)',
          opacity: inView ? 1 : 0,
          visibility: inView ? 'visible' : 'hidden',
          pointerEvents: inView ? 'auto' : 'none',
          transition: inView
            ? 'opacity 0.3s ease'
            : 'opacity 0.3s ease, visibility 0s linear 0.3s',
        }}
      >

        {/* ── Canvas — z:0 so overlays (z:10) paint above it ──── */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            opacity: canvasReady ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* ── Radial vignette to feather canvas edges ───────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 45%, rgba(5,13,26,0.65) 100%)',
          }}
        />

        {/* ── Top header ─────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            paddingTop: 52,
            paddingBottom: 28,
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 10,
            background: 'linear-gradient(to bottom, rgba(5,13,26,0.85) 0%, rgba(5,13,26,0.5) 70%, transparent 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, #7ED6FF)' }} />
            <span
              style={{
                color: '#7ED6FF',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
                textShadow: '0 1px 8px rgba(0,0,0,0.8)',
              }}
            >
              Vue Éclatée · Technologie
            </span>
            <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, #7ED6FF)' }} />
          </div>
          <h2
            style={{
              fontFamily: 'Satoshi, DM Sans, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.6rem, 3vw, 2.6rem)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              color: 'white',
              margin: 0,
              textShadow: '0 2px 16px rgba(0,0,0,0.7)',
            }}
          >
            Anatomie d&apos;une{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #7ED6FF 0%, #A5F1FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              révolution silencieuse
            </span>
          </h2>
        </div>

        {/* ── Feature callouts ─────────────────────────────── */}
        {CALLOUTS.map((c, i) => {
          const op  = calloutOpacity(c);
          const tx  = calloutTranslate(c);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                [c.side]: 'clamp(16px, 3vw, 48px)',
                top: c.vPos,
                zIndex: 10,
                pointerEvents: 'none',
                opacity: op,
                transform: tx,
                transition: 'opacity 0.35s ease, transform 0.35s ease',
                maxWidth: 'clamp(160px, 18vw, 260px)',
              }}
            >
              {/* Connector line */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  flexDirection: c.side === 'left' ? 'row' : 'row-reverse',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0, paddingTop: 4 }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#7ED6FF',
                      boxShadow: '0 0 14px rgba(126,214,255,0.9), 0 0 28px rgba(126,214,255,0.4)',
                    }}
                  />
                  <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, #7ED6FF, transparent)', marginTop: 4 }} />
                </div>

                <div
                  style={{
                    textAlign: c.side === 'left' ? 'left' : 'right',
                    background: 'rgba(5,13,26,0.55)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(126,214,255,0.15)',
                    borderRadius: 12,
                    padding: '10px 14px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Satoshi, DM Sans, sans-serif',
                      fontWeight: 700,
                      fontSize: 'clamp(0.75rem, 1.1vw, 0.88rem)',
                      color: 'white',
                      letterSpacing: '-0.01em',
                      marginBottom: 3,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'clamp(0.6rem, 0.8vw, 0.7rem)',
                      color: '#A5F1FF',
                      lineHeight: 1.5,
                      marginBottom: 2,
                      fontWeight: 500,
                    }}
                  >
                    {c.desc}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'clamp(0.55rem, 0.7vw, 0.63rem)',
                      color: 'rgba(165,241,255,0.55)',
                      lineHeight: 1.45,
                    }}
                  >
                    {c.detail}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Vertical progress bar (right edge) ───────────── */}
        <div
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 2,
            height: 140,
            background: 'rgba(126,214,255,0.08)',
            borderRadius: 2,
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '100%',
              height: `${progress * 100}%`,
              background: 'linear-gradient(to bottom, #7ED6FF, #A5F1FF)',
              borderRadius: 2,
              boxShadow: '0 0 8px rgba(126,214,255,0.5)',
              transition: 'height 0.08s linear',
            }}
          />
          {/* Tick marks */}
          {[0.25, 0.5, 0.75].map(t => (
            <div
              key={t}
              style={{
                position: 'absolute',
                left: -4,
                top: `${t * 100}%`,
                width: 10,
                height: 1,
                background: 'rgba(126,214,255,0.2)',
                transform: 'translateY(-50%)',
              }}
            />
          ))}
        </div>

        {/* Frame counter */}
        <div
          style={{
            position: 'absolute',
            right: 30,
            top: '50%',
            transform: 'translateY(-50%) rotate(90deg)',
            transformOrigin: 'center center',
            color: 'rgba(126,214,255,0.3)',
            fontSize: '0.52rem',
            fontFamily: 'monospace',
            letterSpacing: '0.08em',
            zIndex: 10,
            whiteSpace: 'nowrap',
            marginTop: 100,
          }}
        >
          {String(currentFrame).padStart(3, '0')} / {TOTAL}
        </div>

        {/* ── Spec chips (bottom center) ────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
            zIndex: 10,
            opacity: progress > 0.05 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          {['IP68 · Étanche', 'Wi-Fi 6', 'BLE 5.2', 'UL Certifié', '220V / 24V DC'].map(spec => (
            <span
              key={spec}
              style={{
                fontSize: '0.62rem',
                color: 'rgba(165,241,255,0.65)',
                border: '1px solid rgba(126,214,255,0.18)',
                borderRadius: 999,
                padding: '3px 11px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                backdropFilter: 'blur(8px)',
                background: 'rgba(10,37,64,0.35)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {spec}
            </span>
          ))}
        </div>

        {/* ── Scroll hint (fades after scrolling starts) ─────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            zIndex: 10,
            pointerEvents: 'none',
            opacity: progress < 0.03 ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          <span
            style={{
              color: 'rgba(126,214,255,0.45)',
              fontSize: '0.58rem',
              letterSpacing: '0.2em',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
            }}
          >
            SCROLL
          </span>
          <div
            style={{
              width: 1,
              height: 28,
              background: 'linear-gradient(to bottom, rgba(126,214,255,0.5), transparent)',
              animation: 'scrollDrop 1.6s ease-in-out infinite',
            }}
          />
        </div>

        {/* ── Loading overlay ──────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#050D1A',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
            opacity: loadFraction >= 1 ? 0 : 1,
            pointerEvents: loadFraction >= 1 ? 'none' : 'auto',
            transition: 'opacity 0.8s ease',
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '1px solid rgba(126,214,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 28,
              position: 'relative',
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#7ED6FF',
                boxShadow: '0 0 16px rgba(126,214,255,0.8)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: -1,
                borderRadius: '50%',
                border: '1px solid transparent',
                borderTopColor: '#7ED6FF',
                animation: 'spin 1.2s linear infinite',
              }}
            />
          </div>

          <div
            style={{
              color: 'rgba(126,214,255,0.6)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            Vue éclatée en cours
          </div>

          {/* Progress track */}
          <div
            style={{
              width: 180,
              height: 1,
              background: 'rgba(126,214,255,0.1)',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${loadFraction * 100}%`,
                height: '100%',
                background: 'linear-gradient(to right, #7ED6FF, #A5F1FF)',
                transition: 'width 0.15s ease',
              }}
            />
          </div>

          <div
            style={{
              color: 'rgba(165,241,255,0.35)',
              fontSize: '0.58rem',
              fontFamily: 'monospace',
              marginTop: 8,
              letterSpacing: '0.06em',
            }}
          >
            {Math.round(loadFraction * 100)}%
          </div>
        </div>

      </div>
    </section>
  );
}
