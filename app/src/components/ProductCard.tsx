import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { useWishlistStore } from '../store/wishlistStore';
import { Link } from 'react-router';

export function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleItem } = useWishlistStore();
  
  const isWishlisted = isInWishlist(product._id);
  
  // Calculate price bounds
  const price = product.basePrice || (product.variants?.[0]?.price ?? 0);
  const compareAtPrice = product.variants?.[0]?.compareAtPrice;

  const defaultImage = product.media?.[0]?.secureUrl || 'https://via.placeholder.com/400x500';
  const hoverImage = product.media?.[1]?.secureUrl || defaultImage;

  const isSale = compareAtPrice && compareAtPrice > price;

  return (
    <div
      className="group bg-ivory"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-charcoal/5">
        <Link to={`/product/${product.slug}`}>
          <img
            src={defaultImage}
            alt={product.title}
            className="w-full h-full object-cover transition-opacity duration-400"
            style={{ opacity: isHovered ? 0 : 1 }}
            loading="lazy"
          />
          <img
            src={hoverImage}
            alt={`${product.title} alternate`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-400"
            style={{ opacity: isHovered ? 1 : 0 }}
            loading="lazy"
          />
        </Link>

        {/* Badge */}
        {isSale && (
          <div className="absolute top-3 left-3 bg-error text-white font-body text-[11px] font-medium uppercase px-3 py-1">
            Sale
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => toggleItem(product._id)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart
            size={16}
            className={isWishlisted ? 'fill-error text-error' : 'text-charcoal'}
          />
        </button>

        {/* Quick View / Link to product details instead of quick add since variants exist */}
        <Link
          to={`/product/${product.slug}`}
          className={`absolute bottom-0 left-0 right-0 w-full bg-gold text-charcoal font-body text-sm font-medium uppercase tracking-wider py-3 flex items-center justify-center gap-2 transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          } hover:bg-gold/90`}
        >
          <ShoppingBag size={16} />
          View Details
        </Link>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-body text-base font-medium text-charcoal mb-1 truncate">
          <Link to={`/product/${product.slug}`}>{product.title}</Link>
        </h3>
        <p className="font-body text-xs text-slate mb-2 truncate">{product.category?.name || ''}</p>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-accent text-xl font-semibold text-gold">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {isSale && (
            <span className="font-accent text-base text-slate line-through">
              ₹{compareAtPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
