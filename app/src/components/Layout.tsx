import { Outlet } from 'react-router';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { useLenisInit } from '../hooks/useLenis';
import { useEffect } from 'react';

export default function Layout() {
  useLenisInit();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Custom Cursor removed */}
      <AnnouncementBar />
      <Navbar transparentOnTop={false} />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
