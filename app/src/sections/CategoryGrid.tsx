import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CategoryCard } from '../components/CategoryCard';
import { SectionHeader } from '../components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

export default function CategoryGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  const categories: any[] = [
    { _id: '1', name: 'Wedding Collection', slug: 'wedding', description: 'Explore', thumbnailMedia: { secureUrl: '/images/category-wedding.jpg' } },
    { _id: '2', name: 'Sherwani', slug: 'sherwani', description: 'Explore', thumbnailMedia: { secureUrl: '/images/category-sherwani.jpg' } },
    { _id: '3', name: 'Kurta Sets', slug: 'kurta', description: 'Explore', thumbnailMedia: { secureUrl: '/images/category-kurta.jpg' } },
    { _id: '4', name: 'Formal Wear', slug: 'formal', description: 'Explore', thumbnailMedia: { secureUrl: '/images/category-formal.jpg' } },
    { _id: '5', name: 'Casual Wear', slug: 'casual', description: 'Explore', thumbnailMedia: { secureUrl: '/images/category-casual.jpg' } },
  ];

  useEffect(() => {
    if (categories.length === 0) return;

    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll('.category-card');
      if (cards.length > 0) {
        gsap.from(cards, {
          y: 60,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [categories.length]);

  return (
    <section
      ref={sectionRef}
      id="collections"
      className="bg-ivory py-20 md:py-32"
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <SectionHeader 
          title="Shop by Category" 
          subtitle="Curated collections for every occasion" 
        />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]">
            {categories.map((cat, i) => (
              <CategoryCard 
                key={cat._id} 
                category={cat} 
                tall={i === 0 || i === 3} // Make some cards tall for dynamic grid
              />
            ))}
          </div>
      </div>
    </section>
  );
}
