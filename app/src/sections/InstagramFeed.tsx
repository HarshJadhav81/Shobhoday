import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Heart, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const images = [
  { src: '/images/instagram-1.jpg', likes: 234, comments: 18 },
  { src: '/images/instagram-2.jpg', likes: 456, comments: 32 },
  { src: '/images/instagram-3.jpg', likes: 189, comments: 12 },
  { src: '/images/instagram-4.jpg', likes: 567, comments: 45 },
  { src: '/images/instagram-5.jpg', likes: 892, comments: 67 },
  { src: '/images/instagram-6.jpg', likes: 345, comments: 23 },
];

export default function InstagramFeed() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll('.insta-item');
      gsap.from(items, {
        scale: 0.9,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
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
    <section ref={sectionRef} className="bg-ivory py-20 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="font-display text-charcoal text-4xl md:text-5xl leading-tight tracking-tight mb-2">
            Follow the Style
          </h2>
          <a
            href="https://instagram.com/navjeevancreation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-gold hover:underline"
          >
            <Instagram size={16} />
            @navjeevancreation
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {images.map((img, i) => (
            <a
              key={i}
              href="https://instagram.com/navjeevancreation"
              target="_blank"
              rel="noopener noreferrer"
              className="insta-item group relative aspect-square overflow-hidden"
            >
              <img
                src={img.src}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/60 transition-all duration-400 flex flex-col items-center justify-center">
                <Instagram
                  size={24}
                  className="text-ivory opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 mb-3"
                />
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-75">
                  <span className="flex items-center gap-1.5 text-ivory font-body text-sm">
                    <Heart size={14} className="fill-ivory" />
                    {img.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-ivory font-body text-sm">
                    <MessageCircle size={14} className="fill-ivory" />
                    {img.comments}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href="https://instagram.com/navjeevancreation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm font-medium uppercase tracking-widest text-gold border-2 border-gold px-8 py-3 hover:bg-gold hover:text-charcoal transition-all duration-300"
          >
            <Instagram size={16} />
            Follow Us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
