import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

const navLinks = [
  { label: 'Home', href: '#home' },
  {
    label: 'Collections',
    href: '#collections',
    megaMenu: true,
    columns: [
      {
        title: 'Ethnic Wear',
        items: ['Sherwanis', 'Kurta-Pajama', 'Dhoti Sets', 'Indo-Western', 'Nehru Jackets'],
      },
      {
        title: 'Formal Wear',
        items: ['Business Suits', 'Blazers', 'Trousers', 'Shirts', 'Ties & Accessories'],
      },
      {
        title: 'Wedding',
        items: ['Groom Sherwanis', 'Wedding Suits', 'Baraat Outfits', 'Reception Wear'],
      },
      {
        title: 'Casual Wear',
        items: ['T-Shirts', 'Polo Shirts', 'Casual Shirts', 'Denim', 'Chinos'],
      },
      {
        title: 'Traditional',
        items: ['Pathani Suits', 'Kurtas', 'Festival Wear'],
      },
    ],
  },
  { label: 'New Arrivals', href: '#new-arrivals' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      const items = mobileMenuRef.current.querySelectorAll('.mobile-nav-link');
      gsap.fromTo(
        items,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-400 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-nav'
            : 'bg-transparent'
        }`}
        style={{ top: isScrolled ? 0 : 40 }}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#home" className="flex flex-col items-start">
            <span
              className={`font-display text-2xl tracking-tight transition-colors duration-400 ${
                isScrolled ? 'text-charcoal' : 'text-ivory'
              }`}
            >
              Shubhoday
            </span>
            <span
              className={`font-body text-[9px] tracking-[0.3em] uppercase transition-colors duration-400 ${
                isScrolled ? 'text-charcoal/60' : 'text-ivory/60'
              }`}
            >
              Navjeevan Creation
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.megaMenu && setMegaMenuOpen(true)}
                onMouseLeave={() => link.megaMenu && setMegaMenuOpen(false)}
              >
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`font-body text-sm font-medium tracking-wide flex items-center gap-1 transition-colors duration-300 link-underline ${
                    isScrolled ? 'text-charcoal' : 'text-ivory'
                  }`}
                >
                  {link.label}
                  {link.megaMenu && <ChevronDown size={12} />}
                </a>

                {/* Mega Menu */}
                {link.megaMenu && megaMenuOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                    onMouseEnter={() => setMegaMenuOpen(true)}
                    onMouseLeave={() => { setMegaMenuOpen(false); setHoveredCategory(null); }}
                  >
                    <div className="bg-white shadow-2xl border-t-2 border-gold p-8 flex gap-12 min-w-[900px]">
                      {/* Text Columns */}
                      <div className="grid grid-cols-5 gap-8 flex-1">
                        {link.columns?.map((col) => (
                          <div key={col.title}>
                            <h4 className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-charcoal mb-4">
                              {col.title}
                            </h4>
                            <ul className="space-y-2">
                              {col.items.map((item) => {
                                const slug = item.toLowerCase().replace(/ & /g, '_').replace(/-/g, '_').replace(/ /g, '_');
                                return (
                                  <li key={item}>
                                    <Link
                                      to={`/shop/${slug}`}
                                      onMouseEnter={() => setHoveredCategory(slug)}
                                      onClick={() => { setMegaMenuOpen(false); setHoveredCategory(null); }}
                                      className="font-body text-sm text-slate hover:text-gold transition-colors block py-1"
                                    >
                                      {item}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Dynamic Image Preview Panel */}
                      <div className="w-[280px] bg-ivory rounded-lg overflow-hidden relative group shrink-0">
                        <img 
                          src={hoveredCategory ? `/images/${hoveredCategory}.png` : '/images/sherwanis.png'} 
                          alt="Category Preview" 
                          className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-105"
                          key={hoveredCategory || 'default'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <p className="font-display text-2xl text-ivory mb-1 capitalize">
                            {hoveredCategory ? hoveredCategory.replace(/_/g, ' ') : 'Discover More'}
                          </p>
                          <span className="font-body text-xs tracking-widest text-gold uppercase flex items-center gap-2">
                            Explore <span className="text-lg">→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 transition-colors duration-300 ${
                isScrolled ? 'text-charcoal hover:text-gold' : 'text-ivory hover:text-gold'
              }`}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button
              className={`hidden sm:block p-2 transition-colors duration-300 relative ${
                isScrolled ? 'text-charcoal hover:text-gold' : 'text-ivory hover:text-gold'
              }`}
              aria-label="Wishlist"
            >
              <Heart size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <button
              className={`hidden sm:block p-2 transition-colors duration-300 ${
                isScrolled ? 'text-charcoal hover:text-gold' : 'text-ivory hover:text-gold'
              }`}
              aria-label="Account"
            >
              <User size={20} />
            </button>

            <button
              className={`hidden sm:block p-2 transition-colors duration-300 relative ${
                isScrolled ? 'text-charcoal hover:text-gold' : 'text-ivory hover:text-gold'
              }`}
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors duration-300 ${
                isScrolled ? 'text-charcoal' : 'text-ivory'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-charcoal pt-24 px-6 lg:hidden">
          <div ref={mobileMenuRef} className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="mobile-nav-link font-display text-3xl text-ivory hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[101] bg-charcoal/95 flex items-start justify-center pt-32">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 text-ivory hover:text-gold transition-colors"
            aria-label="Close search"
          >
            <X size={28} />
          </button>
          <div className="w-full max-w-2xl px-6">
            <input
              type="text"
              placeholder="Search products, categories..."
              autoFocus
              className="w-full bg-transparent border-b border-ivory/30 text-ivory font-body text-2xl py-4 outline-none placeholder:text-ivory/40 focus:border-gold transition-colors"
            />
          </div>
        </div>
      )}
    </>
  );
}
