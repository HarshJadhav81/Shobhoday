import { ArrowRight } from 'lucide-react';
import type { Category } from '../types';
import { Link } from 'react-router';

export function CategoryCard({ category, tall = false, isSale = false }: { category: Category, tall?: boolean, isSale?: boolean }) {
  const imageUrl = category.thumbnailMedia?.secureUrl || 'https://via.placeholder.com/400x500';

  return (
    <Link
      to={`/category/${category.slug}`}
      className={`category-card block group relative overflow-hidden ${
        tall ? 'md:row-span-2' : ''
      } ${isSale ? 'bg-gold' : ''}`}
    >
      {!isSale && (
        <img
          src={imageUrl}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
          loading="lazy"
        />
      )}

      {/* Overlay */}
      {!isSale && (
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div
          className={`font-accent text-2xl md:text-[28px] mb-1 ${
            isSale ? 'text-charcoal' : 'text-ivory'
          }`}
        >
          {category.name}
        </div>
        <div
          className={`font-body text-sm mb-3 ${
            isSale ? 'text-charcoal/70' : 'text-ivory/70'
          }`}
        >
          {/* We don't have counts directly in Category schema, this can be fetched later or omitted */}
          Explore
        </div>
        <div
          className={`inline-flex items-center gap-2 font-body text-[13px] uppercase tracking-[0.1em] transition-all duration-300 ${
            isSale
              ? 'text-charcoal translate-y-0 opacity-100'
              : 'text-gold translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
          }`}
        >
          Shop Now <ArrowRight size={14} />
        </div>
      </div>

      {/* Hover border */}
      {!isSale && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      )}
    </Link>
  );
}
