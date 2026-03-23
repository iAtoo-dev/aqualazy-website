'use client';

import { useEffect, useRef } from 'react';

export default function CursorRipple() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId: number;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    dot.style.display  = 'block';
    ring.style.display = 'block';

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      rafId = requestAnimationFrame(animate);
    };

    const onEnterLink = () => {
      if (!dot || !ring) return;
      dot.style.width  = '6px';
      dot.style.height = '6px';
      ring.style.width  = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'rgba(126,214,255,0.7)';
    };

    const onLeaveLink = () => {
      if (!dot || !ring) return;
      dot.style.width  = '10px';
      dot.style.height = '10px';
      ring.style.width  = '40px';
      ring.style.height = '40px';
      ring.style.borderColor = 'rgba(126,214,255,0.4)';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    const links = document.querySelectorAll('a, button, [role="button"]');
    links.forEach(l => {
      l.addEventListener('mouseenter', onEnterLink);
      l.addEventListener('mouseleave', onLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-ripple"
        style={{ display: 'none' }}
        aria-hidden
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{ display: 'none' }}
        aria-hidden
      />
    </>
  );
}
