import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProductCard } from '../components/ProductCard';
import { SectionHeader } from '../components/SectionHeader';
import { Link } from 'react-router';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState('All');
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const products: any[] = [
    { _id: '1', title: 'Casual Signature', slug: 'casual', brand: 'Shobhoday', category: { name: 'Casual Wear' }, media: [{ secureUrl: '/images/lookbook-1.jpg' }], variants: [{ price: 3500, compareAtPrice: 5000 }] },
    { _id: '2', title: 'Formal Elegance', slug: 'formal', brand: 'Shobhoday', category: { name: 'Formal Wear' }, media: [{ secureUrl: '/images/lookbook-2.jpg' }], variants: [{ price: 4000, compareAtPrice: 6000 }] },
    { _id: '3', title: 'Kurta Classic', slug: 'kurta', brand: 'Shobhoday', category: { name: 'Kurta Sets' }, media: [{ secureUrl: '/images/hero-carousel-1.jpg' }], variants: [{ price: 2500, compareAtPrice: 3500 }] },
    { _id: '4', title: 'Premium Sherwani', slug: 'sherwani', brand: 'Shobhoday', category: { name: 'Sherwani' }, media: [{ secureUrl: '/images/hero-carousel-2.jpg' }], variants: [{ price: 15000, compareAtPrice: 20000 }] },
    { _id: '5', title: 'Wedding Special', slug: 'wedding', brand: 'Shobhoday', category: { name: 'Wedding Collection' }, media: [{ secureUrl: '/images/lookbook-3.jpg' }], variants: [{ price: 12000, compareAtPrice: 18000 }] },
    { _id: '6', title: 'Designer Kurta', slug: 'designer-kurta', brand: 'Shobhoday', category: { name: 'Kurta Sets' }, media: [{ secureUrl: '/images/hero-carousel-3.jpg' }], variants: [{ price: 4500, compareAtPrice: 6000 }] },
    { _id: '7', title: 'Festive Wear', slug: 'festive', brand: 'Shobhoday', category: { name: 'Formal Wear' }, media: [{ secureUrl: '/images/hero-carousel-4.jpg' }], variants: [{ price: 5500, compareAtPrice: 7500 }] },
    { _id: '8', title: 'Casual Everyday', slug: 'casual-everyday', brand: 'Shobhoday', category: { name: 'Casual Wear' }, media: [{ secureUrl: '/images/hero-carousel-5.jpg' }], variants: [{ price: 2000, compareAtPrice: 3000 }] },
  ];

  // Assuming you have categories to list in filters, hardcoding for now as requested by UI
  const filters = ['All', 'Mens', 'Womens', 'Accessories'];

  useEffect(() => {
    if (products.length === 0) return;

    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll('.product-card-wrapper');
      if (cards.length > 0) {
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [products.length, activeFilter]);

  return (
    <section ref={sectionRef} id="new-arrivals" className="bg-beige py-20 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6">
        <SectionHeader title="Most Loved Pieces" />

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-6 mb-10 border-b border-charcoal/10 pb-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative font-body text-sm font-medium pb-2 transition-colors duration-300 ${
                activeFilter === filter ? 'text-charcoal' : 'text-slate hover:text-charcoal'
              }`}
            >
              {filter}
              {activeFilter === filter && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          ))}
        </div>

          <div
            ref={gridRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {products.filter(p => activeFilter === 'All' || p.category.name.includes(activeFilter)).slice(0, 8).map((product) => (
              <div key={product._id} className="product-card-wrapper">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-body text-sm font-medium uppercase tracking-widest text-charcoal border-b-2 border-gold pb-1 hover:text-gold transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
