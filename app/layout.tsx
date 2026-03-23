import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AQUALAZY – L\'eau parfaite, sans effort',
  description: 'Le système autonome de traitement de l\'eau de piscine. Technologie invisible, eau cristalline, zéro contrainte. Vivez l\'expérience de la piscine parfaite.',
  keywords: 'piscine, traitement eau, automatique, AQUALAZY, eau cristalline, système autonome',
  openGraph: {
    title: 'AQUALAZY – L\'eau parfaite, sans effort',
    description: 'Le système autonome de traitement de l\'eau de piscine. Technologie invisible, eau cristalline.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AQUALAZY – L\'eau parfaite, sans effort',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <head>
        {/* Satoshi Font */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0A2540" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
