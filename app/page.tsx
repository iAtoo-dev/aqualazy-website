import Header from '@/components/Header';
import Hero from '@/components/sections/Hero';
import Technology from '@/components/sections/Technology';
import Features from '@/components/sections/Features';
import Intelligence from '@/components/sections/Intelligence';
import Testimonials from '@/components/sections/Testimonials';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import ClientLayer from '@/components/ClientLayer';

export default function Home() {
  return (
    <>
      {/* Loading screen */}
      <LoadingScreen />

      {/* Client-only: Lenis, cursor, water canvas */}
      <ClientLayer />

      {/* All page content sits above the canvas */}
      <div className="relative z-10">
        <Header />

        <main>
          <Hero />
          <Technology />
          <Features />
          <Intelligence />
          <Testimonials />
          <CTA />
        </main>

        <Footer />
      </div>
    </>
  );
}
