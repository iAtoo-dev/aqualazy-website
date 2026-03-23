'use client';

import dynamic from 'next/dynamic';

const WaterBackground = dynamic(() => import('@/components/WaterBackground'), {
  ssr: false,
});

const LenisProvider = dynamic(() => import('@/components/LenisProvider'), {
  ssr: false,
});

const CursorRipple = dynamic(() => import('@/components/CursorRipple'), {
  ssr: false,
});

export default function ClientLayer() {
  return (
    <>
      <LenisProvider />
      <CursorRipple />
      <WaterBackground />
    </>
  );
}
