import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const heroImages = [
  { src: '/images/hero-carousel-1.jpg', label: 'Sherwani' },
  { src: '/images/hero-carousel-2.jpg', label: 'Wedding' },
  { src: '/images/hero-carousel-3.jpg', label: 'Formal Suits' },
  { src: '/images/hero-carousel-4.jpg', label: 'Kurta Sets' },
  { src: '/images/hero-carousel-5.jpg', label: 'Tuxedo' },
  { src: '/images/hero-carousel-6.jpg', label: 'Indo-Western' },
  { src: '/images/hero-carousel-7.jpg', label: 'Wedding' },
  { src: '/images/hero-carousel-8.jpg', label: 'Summer' },
  // Repeat to fill 20 cards
  { src: '/images/hero-carousel-1.jpg', label: 'Ethnic' },
  { src: '/images/hero-carousel-3.jpg', label: 'Suits' },
  { src: '/images/hero-carousel-5.jpg', label: 'Black Tie' },
  { src: '/images/hero-carousel-7.jpg', label: 'Groom' },
  { src: '/images/hero-carousel-2.jpg', label: 'Reception' },
  { src: '/images/hero-carousel-4.jpg', label: 'Traditional' },
  { src: '/images/hero-carousel-6.jpg', label: 'Jacket' },
  { src: '/images/hero-carousel-8.jpg', label: 'Casual' },
  { src: '/images/hero-carousel-1.jpg', label: 'Heritage' },
  { src: '/images/hero-carousel-3.jpg', label: 'Elegant' },
  { src: '/images/hero-carousel-5.jpg', label: 'Premium' },
];

const CARD_COUNT = 20;
const RADIUS = 900;
const ROTATION_STEP = 360 / CARD_COUNT;

export default function HeroCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    const inner = innerRef.current;
    if (!carousel || !inner) return;

    const cards = inner.querySelectorAll<HTMLElement>('.carousel-card');
    const cardImages = inner.querySelectorAll<HTMLElement>('.card-image img');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: carousel,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1.5,
        },
      });

      // Main carousel rotation
      tl.fromTo(
        inner,
        { rotationY: 0, rotationZ: 3, rotationX: 3 },
        { rotationY: -180, rotationZ: -3, rotationX: -3, ease: 'none' },
        0
      );

      // Individual card scale/brightness
      cards.forEach((card, i) => {
        const angle = i * ROTATION_STEP;
        const isFrontHalf = angle <= 180;

        tl.fromTo(
          card,
          {
            scale: isFrontHalf ? 1.2 : 0.7,
            filter: isFrontHalf ? 'brightness(1.2)' : 'brightness(0.4)',
          },
          {
            scale: isFrontHalf ? 0.7 : 1.2,
            filter: isFrontHalf ? 'brightness(0.4)' : 'brightness(1.2)',
            ease: 'none',
          },
          0
        );
      });

      // Inner image parallax
      cardImages.forEach((img) => {
        tl.fromTo(
          img,
          { yPercent: 40 },
          { yPercent: -40, ease: 'none' },
          0
        );
      });

      // Hero text entrance animation
      if (textRef.current) {
        const textElements = textRef.current.querySelectorAll('.hero-animate');
        gsap.fromTo(
          textElements,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.5,
          }
        );
      }
    }, carousel);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="relative">
      {/* 3D Carousel Container */}
      <div
        ref={carouselRef}
        id="hero-carousel"
        style={{
          perspective: '900px',
          perspectiveOrigin: '50% 50%',
          width: '100vw',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: '#1A1A1A',
        }}
      >
        {/* Grain overlay */}
        <div className="grain-overlay" />

        {/* Carousel Inner */}
        <div
          ref={innerRef}
          id="carousel-inner"
          style={{
            transformStyle: 'preserve-3d',
            width: '100%',
            height: '100%',
          }}
        >
          {heroImages.map((img, i) => {
            const angle = i * ROTATION_STEP;
            return (
              <div
                key={i}
                className="carousel-card"
                style={{
                  width: '280px',
                  height: '380px',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-190px',
                  marginLeft: '-140px',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, filter',
                  transform: `translateZ(-${RADIUS}px) rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                }}
              >
                <div
                  className="card-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                    position: 'relative',
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      willChange: 'transform',
                    }}
                    loading={i < 8 ? 'eager' : 'lazy'}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '24px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: '20px',
                        color: '#FAF7F2',
                      }}
                    >
                      {img.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hero Text Overlay */}
        <div
          ref={textRef}
          className="absolute bottom-16 left-6 md:left-10 z-10 max-w-[600px]"
        >
          <div className="hero-animate section-eyebrow mb-4">
            EST. 1985 &mdash; JALGAON, MAHARASHTRA
          </div>
          <h1 className="hero-animate font-display text-ivory text-5xl md:text-7xl lg:text-[96px] leading-none tracking-tight mb-4">
            Wear the Legacy.
          </h1>
          <p className="hero-animate font-body text-ivory/80 text-base md:text-xl mb-8 max-w-[480px]">
            Premium Men's Ethnic, Formal &amp; Wedding Collection
          </p>
          <div className="hero-animate flex flex-wrap gap-4">
            <a href="#collections" className="btn-primary">
              Explore Collections
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Book a Fitting
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown
            size={24}
            className="text-ivory animate-bounce-chevron"
          />
        </div>
      </div>
    </section>
  );
}
