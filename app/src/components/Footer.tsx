import { Instagram, Facebook, Youtube, MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  shop: ['All Products', 'New Arrivals', 'Ethnic Wear', 'Formal Wear', 'Wedding Collection', 'Casual Wear', 'Sale'],
  customerCare: ['Contact Us', 'FAQs', 'Shipping Policy', 'Return & Exchange', 'Size Guide', 'Store Locator'],
  company: ['About Us', 'Blog', 'Careers', 'Bulk Orders'],
  connect: [
    { label: 'WhatsApp Chat', href: 'https://wa.me/919876543210' },
    { label: 'Call Now', href: 'tel:+919876543210' },
    { label: 'Store Directions', href: '#' },
  ],
};

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cols = el.querySelectorAll('.footer-col');
      gsap.from(cols, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-charcoal text-ivory">
      <div className="max-w-[1440px] mx-auto px-6 pt-20 pb-10">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1 footer-col">
            <div className="font-display text-2xl tracking-tight mb-2">Shubhoday</div>
            <div className="font-body text-[10px] tracking-[0.3em] uppercase text-ivory/60 mb-4">
              Navjeevan Creation
            </div>
            <p className="font-body text-sm text-ivory/60 leading-relaxed max-w-[320px]">
              "Wear the Legacy. Own the Moment."<br />
              Premium men's ethnic, formal & wedding wear since 1985.
            </p>
          </div>

          {/* Shop */}
          <div className="footer-col">
            <h4 className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-ivory mb-6">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-sm text-ivory/60 hover:text-ivory transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="footer-col">
            <h4 className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-ivory mb-6">
              Customer Care
            </h4>
            <ul className="space-y-3">
              {footerLinks.customerCare.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-sm text-ivory/60 hover:text-ivory transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4 className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-ivory mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-body text-sm text-ivory/60 hover:text-ivory transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="footer-col">
            <h4 className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-ivory mb-6">
              Connect
            </h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="font-body text-sm text-ivory/60 hover:text-ivory transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-ivory/30 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-ivory/30 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-ivory/30 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-ivory/30 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="Google Maps"
              >
                <MapPin size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-ivory/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-ivory/50">
            &copy; 2025 Navjeevan Creation |{' '}
            <a href="#" className="hover:text-ivory transition-colors">Privacy Policy</a> |{' '}
            <a href="#" className="hover:text-ivory transition-colors">Terms</a>
          </p>
          <p className="font-body text-[13px] text-ivory/50">
            Made with pride in Jalgaon
          </p>
        </div>
      </div>

    </footer>
  );
}
