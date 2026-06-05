import { useState } from 'react';
import PageLoader from '@/components/PageLoader';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroCarousel from '@/sections/HeroCarousel';
import BrandTicker from '@/sections/BrandTicker';
import CategoryGrid from '@/sections/CategoryGrid';
import FeaturedProducts from '@/sections/FeaturedProducts';
import BrandStory from '@/sections/BrandStory';
import Lookbook from '@/sections/Lookbook';
import Testimonials from '@/sections/Testimonials';
import InstagramFeed from '@/sections/InstagramFeed';
import Newsletter from '@/sections/Newsletter';
import Footer from '@/components/Footer';
import { useLenisInit } from '@/hooks/useLenis';

export default function Home() {
  const [loaderComplete, setLoaderComplete] = useState(false);

  // Initialize Lenis smooth scroll
  useLenisInit();

  return (
    <>
      {!loaderComplete && (
        <PageLoader onComplete={() => setLoaderComplete(true)} />
      )}

      {/* Custom Cursor removed */}
      <AnnouncementBar />
      <Navbar />

      <main>
        <HeroCarousel />
        <BrandTicker />
        <CategoryGrid />
        <FeaturedProducts />
        <BrandStory />
        <Lookbook />
        <Testimonials />
        <InstagramFeed />
        <Newsletter />
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
