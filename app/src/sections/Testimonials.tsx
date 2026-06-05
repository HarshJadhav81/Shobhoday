import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Rahul Khanna',
    initials: 'RK',
    rating: 5,
    text: 'I got my wedding sherwani from Navjeevan Creation and it was absolutely stunning. The craftsmanship, the fit, the attention to detail \u2014 everything was perfect. My family was blown away!',
    occasion: 'Wedding Sherwani',
    date: 'December 2024',
  },
  {
    name: 'Amit Patil',
    initials: 'AP',
    rating: 5,
    text: 'Been coming here for 15 years for all my formal wear. The quality has always been consistent and the staff knows exactly what I need. Best menswear store in Jalgaon, hands down.',
    occasion: 'Office Formals',
    date: 'November 2024',
  },
  {
    name: 'Sandeep Mehta',
    initials: 'SM',
    rating: 5,
    text: 'Booked a fitting for my reception outfit. The team was incredibly helpful \u2014 they suggested styles I would never have considered and the final look was spectacular. Highly recommend!',
    occasion: 'Reception Wear',
    date: 'October 2024',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const next = useCallback(() => {
    goTo((currentIndex + 1) % testimonials.length);
  }, [currentIndex, goTo]);

  const prev = useCallback(() => {
    goTo((currentIndex - 1 + testimonials.length) % testimonials.length);
  }, [currentIndex, goTo]);

  // Auto-advance
  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  // Reset timer on manual navigation
  const handleManualNav = (fn: () => void) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    fn();
    intervalRef.current = setInterval(next, 5000);
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.testimonial-title'), {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(el.querySelector('.testimonial-card'), {
        x: 40,
        opacity: 0,
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

  const current = testimonials[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="bg-beige gold-dot-pattern py-20 md:py-32"
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <h2 className="testimonial-title font-display text-charcoal text-4xl md:text-6xl lg:text-[64px] leading-tight tracking-tight text-center mb-12">
          What Our Customers Say
        </h2>

        <div className="max-w-[700px] mx-auto relative">
          {/* Testimonial Card */}
          <div className="testimonial-card bg-ivory p-8 md:p-12 shadow-card">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center">
                <span className="font-display text-charcoal text-xl">
                  {current.initials}
                </span>
              </div>
              <div>
                <div className="font-body text-lg font-semibold text-charcoal">
                  {current.name}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= current.rating
                          ? 'fill-gold text-gold'
                          : 'text-slate/30'
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="font-body text-lg text-charcoal/85 leading-relaxed italic mb-6">
              "{current.text}"
            </p>

            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-gold border border-gold px-3 py-1.5">
                {current.occasion}
              </span>
              <span className="font-body text-[13px] text-slate">
                {current.date}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => handleManualNav(prev)}
              className="w-10 h-10 border border-charcoal/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleManualNav(() => goTo(i))}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-gold' : 'bg-slate/30'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => handleManualNav(next)}
              className="w-10 h-10 border border-charcoal/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
