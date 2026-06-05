import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { number: '10,000+', label: 'Happy Customers' },
  { number: '40+', label: 'Years of Excellence' },
  { number: '1,000+', label: 'Styles Available' },
];

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    const imageEl = imageRef.current;
    if (!el || !imageEl) return;

    const ctx = gsap.context(() => {
      // Image parallax
      gsap.fromTo(
        imageEl.querySelector('img'),
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // Image slide in
      gsap.from(imageEl, {
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Text content stagger
      const textElements = el.querySelectorAll('.story-animate');
      gsap.from(textElements, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="bg-ivory py-20 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px]">
          {/* Left - Image with Parallax */}
          <div ref={imageRef} className="relative overflow-hidden min-h-[400px] lg:min-h-full">
            <img
              src="/images/brand-store-interior.jpg"
              alt="Navjeevan Creation Store Interior"
              className="absolute inset-0 w-full h-full object-cover scale-110"
              loading="lazy"
            />
          </div>

          {/* Right - Content */}
          <div className="flex items-center py-12 lg:py-0 lg:pl-16">
            <div className="max-w-[520px]">
              <div className="story-animate section-eyebrow mb-4">
                Since 1985
              </div>

              <h2 className="story-animate font-display text-charcoal text-3xl md:text-4xl lg:text-[48px] leading-tight tracking-tight mb-6">
                40 Years of Dressing Jalgaon's Finest
              </h2>

              <div className="story-animate space-y-4 mb-8">
                <p className="font-body text-charcoal/80 leading-relaxed">
                  Founded in 1985 by Shri Rameshchandji Navandar, Navjeevan Creation
                  began as a small tailoring shop in the heart of Jalgaon. With an
                  unwavering commitment to quality craftsmanship and personalized service,
                  we have grown into the region's most trusted destination for premium
                  men's ethnic and formal wear.
                </p>
                <p className="font-body text-charcoal/80 leading-relaxed">
                  Every garment that bears our name is a testament to four decades of
                  expertise. Our master craftsmen blend traditional techniques with
                  contemporary designs, creating pieces that honor heritage while
                  embracing modern elegance.
                </p>
                <p className="font-body text-charcoal/80 leading-relaxed">
                  From wedding sherwanis that make grooms feel like royalty to
                  impeccably tailored business suits, we believe that every man deserves
                  to look his absolute best on every occasion that matters.
                </p>
              </div>

              {/* Stats */}
              <div className="story-animate flex flex-wrap gap-8 mb-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-gold text-3xl md:text-4xl">
                      {stat.number}
                    </div>
                    <div className="font-body text-slate text-sm mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="#"
                className="story-animate inline-flex items-center gap-2 font-body text-sm font-medium text-charcoal link-underline group"
              >
                Our Full Story
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
