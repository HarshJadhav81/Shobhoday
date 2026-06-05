import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        onComplete();
        // Refresh ScrollTrigger after loader completes
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      },
    });

    tl.set(overlayRef.current, { display: 'flex' })
      .fromTo(
        logoRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
      .to(logoRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        delay: 0.6,
      })
      .to(overlayRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
      });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-charcoal flex items-center justify-center"
      style={{ display: 'flex' }}
    >
      <div ref={logoRef} className="text-center">
        <div className="font-display text-ivory text-4xl md:text-5xl tracking-tight">
          Shubhoday
        </div>
        <div className="font-body text-gold text-[10px] tracking-[0.3em] uppercase mt-2">
          Navjeevan Creation
        </div>
      </div>
    </div>
  );
}
