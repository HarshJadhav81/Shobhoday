import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useQuery } from '@tanstack/react-query';
import { CartService } from '../services/cart.service';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import type { Cart, Product } from '../types';

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

export default function Navbar({ transparentOnTop = true }: { transparentOnTop?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const isSolid = isScrolled || !transparentOnTop;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const searchSuggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Stores
  const { guestId } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  // Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Static Search Mock Data
  const isSearchLoading = false;
  const staticProducts: any[] = [
    { _id: '1', title: 'Casual Signature', slug: 'casual', basePrice: 3500, media: [{ secureUrl: '/images/lookbook-1.jpg' }] },
    { _id: '2', title: 'Formal Elegance', slug: 'formal', basePrice: 4000, media: [{ secureUrl: '/images/lookbook-2.jpg' }] },
    { _id: '3', title: 'Kurta Classic', slug: 'kurta', basePrice: 2500, media: [{ secureUrl: '/images/hero-carousel-1.jpg' }] },
    { _id: '4', title: 'Premium Sherwani', slug: 'sherwani', basePrice: 15000, media: [{ secureUrl: '/images/hero-carousel-2.jpg' }] },
    { _id: '5', title: 'Wedding Special', slug: 'wedding', basePrice: 12000, media: [{ secureUrl: '/images/lookbook-3.jpg' }] }
  ];
  const searchedProducts = debouncedQuery.length > 0 
    ? staticProducts.filter(p => p.title.toLowerCase().includes(debouncedQuery.toLowerCase())).slice(0, 4)
    : [];
  
  // Search Animations
  useEffect(() => {
    if (searchOpen) {
      if (debouncedQuery.length > 0) {
        gsap.to(searchSuggestionsRef.current, { opacity: 0, y: -20, duration: 0.3, display: 'none' });
        gsap.fromTo(searchResultsRef.current, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, display: 'block', delay: 0.1 }
        );
      } else {
        gsap.to(searchResultsRef.current, { opacity: 0, y: 20, duration: 0.3, display: 'none' });
        gsap.fromTo(searchSuggestionsRef.current, 
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.4, display: 'block', delay: 0.1 }
        );
      }
    } else {
      setSearchQuery('');
      setDebouncedQuery('');
    }
  }, [debouncedQuery, searchOpen]);

  // Fetch Cart
  const { data: cart } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: () => CartService.getCart(guestId)
  });

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = wishlistItems.length;

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
      if (location.pathname !== '/') {
        navigate(`/${href}`);
      } else {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
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
        className={`sticky top-0 w-full z-[100] transition-all duration-400 ${isSolid
            ? 'bg-white/95 backdrop-blur-sm shadow-nav'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex flex-col items-start">
            <span
              className={`font-display text-2xl tracking-tight transition-colors duration-400 ${isSolid ? 'text-charcoal' : 'text-ivory'
                }`}
            >
              Shubhoday
            </span>
            <span
              className={`font-body text-[9px] tracking-[0.3em] uppercase transition-colors duration-400 ${isSolid ? 'text-charcoal/60' : 'text-ivory/60'
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
                  className={`font-body text-sm font-medium tracking-wide flex items-center gap-1 transition-colors duration-300 link-underline ${isSolid ? 'text-charcoal' : 'text-ivory'
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
              className={`p-2 transition-colors duration-300 ${isSolid ? 'text-charcoal hover:text-gold' : 'text-ivory hover:text-gold'
                }`}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button
              onClick={() => navigate('/wishlist')}
              className={`hidden sm:block p-2 transition-colors duration-300 relative ${isSolid ? 'text-charcoal hover:text-gold' : 'text-ivory hover:text-gold'
                }`}
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute 0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-[#D4AF37] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
              className={`hidden sm:block p-2 transition-colors duration-300 ${isSolid ? 'text-charcoal hover:text-gold' : 'text-ivory hover:text-gold'
                }`}
              aria-label="Account"
            >
              <User size={20} />
            </button>

            <button
              onClick={() => navigate('/cart')}
              className={`hidden sm:block p-2 transition-colors duration-300 relative ${isSolid ? 'text-charcoal hover:text-gold' : 'text-ivory hover:text-gold'
                }`}
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute 0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-[#D4AF37] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors duration-300 ${isSolid ? 'text-charcoal' : 'text-ivory'
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
        <div className="fixed inset-0 z-[101] bg-charcoal/95 flex flex-col items-center pt-24 md:pt-32 overflow-y-auto pb-20">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 text-ivory hover:text-gold transition-colors"
            aria-label="Close search"
          >
            <X size={28} />
          </button>
          <div className="w-full max-w-3xl px-6 relative">
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent border-b border-ivory/30 text-ivory font-body text-2xl md:text-3xl py-4 outline-none placeholder:text-ivory/40 focus:border-gold transition-colors"
            />
            
            {/* Suggestions View */}
            <div ref={searchSuggestionsRef} className="mt-12 w-full">
              <h3 className="font-body text-sm font-medium tracking-widest text-ivory/50 uppercase mb-6">Popular Suggestions</h3>
              <div className="flex flex-wrap gap-4">
                {['Sherwanis', 'Pathani Suits', 'Wedding Suits', 'Kurta-Pajama', 'Blazers'].map(suggestion => (
                  <Link
                    key={suggestion}
                    to={`/shop/${suggestion.toLowerCase().replace(/ & /g, '_').replace(/-/g, '_').replace(/ /g, '_')}`}
                    onClick={() => setSearchOpen(false)}
                    className="px-6 py-3 border border-ivory/20 rounded-full text-ivory hover:border-gold hover:text-gold transition-colors font-body text-sm"
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </div>

            {/* Results View */}
            <div ref={searchResultsRef} className="mt-12 w-full hidden">
              {isSearchLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : searchedProducts.length > 0 ? (
                <div>
                  <h3 className="font-body text-sm font-medium tracking-widest text-ivory/50 uppercase mb-6">Products</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {searchedProducts.map((product: Product) => (
                      <Link 
                        key={product._id} 
                        to={`/product/${product.slug}`} 
                        onClick={() => setSearchOpen(false)}
                        className="group"
                      >
                        <div className="aspect-[3/4] bg-ivory/10 mb-3 overflow-hidden rounded-md">
                          <img 
                            src={product.media?.[0]?.secureUrl || 'https://via.placeholder.com/400x500'} 
                            alt={product.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <h4 className="font-body text-ivory text-sm truncate group-hover:text-gold transition-colors">{product.title}</h4>
                        <p className="font-accent text-gold text-sm">₹{(product.basePrice || product.variants?.[0]?.price || 0).toLocaleString('en-IN')}</p>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => { setSearchOpen(false); navigate(`/shop?search=${debouncedQuery}`); }}
                      className="inline-flex items-center gap-2 text-ivory hover:text-gold transition-colors font-body text-sm tracking-widest uppercase border-b border-gold/50 hover:border-gold pb-1"
                    >
                      View all results <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-ivory/60 font-body">
                  No products found for "{debouncedQuery}"
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
