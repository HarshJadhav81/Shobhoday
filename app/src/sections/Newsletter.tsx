import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        setWhatsappOptIn(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.newsletter-content'), {
        y: 40,
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

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="bg-maroon py-16 md:py-20 relative overflow-hidden"
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(201, 168, 76, 0.3) 10px,
            rgba(201, 168, 76, 0.3) 11px
          )`,
        }}
      />

      <div className="max-w-[640px] mx-auto px-6 relative z-10">
        <div className="newsletter-content text-center">
          <h2 className="font-display text-ivory text-3xl md:text-[40px] leading-tight mb-4">
            Get Early Access to New Collections
          </h2>
          <p className="font-body text-ivory/70 text-base mb-8">
            Join our exclusive list for festival offers, new arrivals &amp; styling tips.
          </p>

          {submitted ? (
            <div className="py-8">
              <div className="font-display text-gold text-2xl mb-2">
                Thank You!
              </div>
              <p className="font-body text-ivory/70">
                You've been added to our exclusive list.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-transparent border-b border-ivory/30 text-ivory font-body text-base py-4 px-0 outline-none placeholder:text-ivory/50 focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="bg-gold text-charcoal font-body text-sm font-medium uppercase tracking-[0.04em] px-8 py-4 hover:brightness-110 transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}

          {/* WhatsApp opt-in */}
          <label className="flex items-center justify-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={whatsappOptIn}
              onChange={(e) => setWhatsappOptIn(e.target.checked)}
              className="w-4 h-4 accent-gold"
            />
            <span className="font-body text-[13px] text-ivory/70">
              Also send me updates on WhatsApp
            </span>
          </label>

          <p className="font-body text-xs text-ivory/50">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
