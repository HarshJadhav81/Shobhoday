import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const looks = [
  {
    image: '/images/lookbook-1.jpg',
    title: 'The Royal Groom',
    description: 'Make your wedding day unforgettable with our premium groom collection.',
    products: ['Red Sherwani', 'Gold Mojari', 'Dupatta'],
  },
  {
    image: '/images/lookbook-2.jpg',
    title: 'Wedding Reception',
    description: 'Elegant formalwear for the modern gentleman at any celebration.',
    products: ['Navy Suit', 'Silk Tie', 'Pocket Square'],
  },
  {
    image: '/images/lookbook-3.jpg',
    title: 'Festival Ready',
    description: 'Embrace tradition with our curated festival wear collection.',
    products: ['Cream Kurta', 'Churidar', 'Nehru Jacket'],
  },
];

export default function Lookbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedLook, setSelectedLook] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll('.lookbook-card');
      gsap.from(cards, {
        scale: 0.95,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="lookbook" className="bg-charcoal py-20 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="font-display text-ivory text-4xl md:text-6xl lg:text-[64px] leading-tight tracking-tight">
            The Look
          </h2>
          <p className="font-body text-ivory/60 text-lg mt-3">
            Season's Edit &mdash; Styled for You
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {looks.map((look, i) => (
            <div
              key={i}
              className="lookbook-card group relative aspect-[3/4] overflow-hidden cursor-pointer"
              onClick={() => setSelectedLook(i)}
            >
              <img
                src={look.image}
                alt={look.title}
                className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/70 transition-all duration-400 flex flex-col items-center justify-center p-6">
                <h3 className="font-accent text-ivory text-2xl md:text-[28px] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-400 mb-4">
                  Shop This Look
                </h3>
                <div className="flex flex-wrap justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-400 delay-100">
                  {look.products.map((product) => (
                    <span
                      key={product}
                      className="font-body text-xs text-ivory border border-gold px-3 py-1.5"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedLook !== null && (
        <div
          className="fixed inset-0 z-[200] bg-charcoal/95 flex items-center justify-center p-6"
          onClick={() => setSelectedLook(null)}
        >
          <button
            className="absolute top-6 right-6 text-ivory hover:text-gold transition-colors"
            onClick={() => setSelectedLook(null)}
            aria-label="Close modal"
          >
            <X size={28} />
          </button>

          <div
            className="bg-ivory max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[3/4] md:aspect-auto">
              <img
                src={looks[selectedLook].image}
                alt={looks[selectedLook].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <h3 className="font-display text-charcoal text-3xl mb-3">
                {looks[selectedLook].title}
              </h3>
              <p className="font-body text-charcoal/70 mb-6">
                {looks[selectedLook].description}
              </p>
              <h4 className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-charcoal mb-3">
                Featured Products
              </h4>
              <ul className="space-y-2 mb-6">
                {looks[selectedLook].products.map((product) => (
                  <li
                    key={product}
                    className="font-body text-sm text-slate flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    {product}
                  </li>
                ))}
              </ul>
              <a
                href="#collections"
                className="btn-primary inline-flex items-center gap-2 self-start"
                onClick={() => setSelectedLook(null)}
              >
                Shop This Look
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
