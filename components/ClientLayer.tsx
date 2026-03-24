'use client';

import dynamic from 'next/dynamic';

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
    </>
  );
}
