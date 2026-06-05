import { useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { ShoppingBag, Truck, RotateCcw, Star, Heart } from 'lucide-react';
import { SEOMeta } from '../components/SEOMeta';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  // Hardcoded product for static demo
  const product: any = {
    _id: '1',
    title: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Premium Item',
    slug: slug,
    shortDescription: 'Beautiful piece perfect for your wardrobe. High quality fabric and premium stitching.',
    basePrice: 3500,
    media: [{ secureUrl: '/images/lookbook-1.jpg' }, { secureUrl: '/images/lookbook-2.jpg' }],
    variants: [
      { size: 'S', color: 'Red', price: 3500, compareAtPrice: 5000, stock: 50 },
      { size: 'M', color: 'Blue', price: 3500, compareAtPrice: 5000, stock: 50 },
      { size: 'L', color: 'Black', price: 3500, compareAtPrice: 5000, stock: 50 }
    ]
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Extract unique sizes and colors from variants
  const sizes = useMemo(() => {
    if (!product?.variants) return [];
    const allSizes = product.variants.map((v: any) => v.size).filter(Boolean);
    return [...new Set(allSizes)] as string[];
  }, [product]);

  const colors = useMemo(() => {
    if (!product?.variants) return [];
    // If size is selected, only show colors available for that size
    let availableVariants = product.variants;
    if (selectedSize) {
      availableVariants = availableVariants.filter((v: any) => v.size === selectedSize);
    }
    const allColors = availableVariants.map((v: any) => v.color).filter(Boolean);
    return [...new Set(allColors)] as string[];
  }, [product, selectedSize]);

  // Find the exact variant based on selections
  const currentVariant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find((v: any) => 
      (!selectedSize || v.size === selectedSize) && 
      (!selectedColor || v.color === selectedColor)
    ) || product.variants[0];
  }, [product, selectedSize, selectedColor]);

  // Sync selections if they become invalid
  useMemo(() => {
    if (!sizes.includes(selectedSize) && sizes.length > 0) setSelectedSize(sizes[0]);
    if (!colors.includes(selectedColor) && colors.length > 0) setSelectedColor(colors[0]);
  }, [sizes, colors, selectedSize, selectedColor]);

  const handleAddToCart = () => {
    alert("Added to cart! (Static Demo)");
  };


  if (!product) return <div className="py-32 text-center">Product not found</div>;

  const displayPrice = currentVariant?.price || product.basePrice;
  const displayCompareAt = currentVariant?.compareAtPrice;
  const mediaList = product.media?.length ? product.media : [{ secureUrl: 'https://via.placeholder.com/600x800' }];

  return (
    <div className="bg-ivory min-h-screen py-24 md:py-32">
      <SEOMeta 
        title={`${product.title} | Shobhoday`}
        description={product.shortDescription || product.seoData?.metaDescription}
        ogImage={mediaList[0].secureUrl}
      />
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 shrink-0">
              {mediaList.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-[3/4] w-20 md:w-full overflow-hidden ${selectedImage === i ? 'ring-2 ring-gold' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img src={img.secureUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-[3/4] bg-charcoal/5 relative">
              <img src={mediaList[selectedImage]?.secureUrl} alt={product.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="font-display text-4xl text-charcoal mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-gold">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= 4 ? "currentColor" : "none"} />)}
              </div>
              <span className="text-slate text-sm">(Reviews coming soon)</span>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="font-accent text-3xl text-gold">
                ₹{displayPrice?.toLocaleString('en-IN')}
              </div>
              {displayCompareAt && (
                <div className="font-accent text-xl text-slate line-through">
                  ₹{displayCompareAt?.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body text-sm font-medium text-charcoal">Select Size</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-3 h-12 flex items-center justify-center border transition-colors ${selectedSize === size ? 'border-gold bg-gold text-ivory' : 'border-slate/30 text-charcoal hover:border-gold'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-8">
                <span className="font-body text-sm font-medium text-charcoal mb-2 block">Color: {selectedColor}</span>
                <div className="flex gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-gold p-1' : 'border-transparent'}`}
                    >
                      {/* Using the string name directly or fallback. A real implementation might use a map of color names to hex codes */}
                      <span className="block w-full h-full rounded-full bg-slate-300" style={{backgroundColor: color.toLowerCase()}}></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {currentVariant && (
              <p className="text-sm text-slate mb-4">
                {currentVariant.stock > 0 ? `${currentVariant.stock} in stock` : <span className="text-red-500">Out of Stock</span>}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-slate/30">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3">-</button>
                <span className="w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3">+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={!currentVariant || currentVariant.stock === 0}
                className="flex-1 bg-charcoal text-ivory font-body font-medium uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gold transition-colors disabled:opacity-50"
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button className="w-14 h-14 flex items-center justify-center border border-slate/30 hover:border-gold hover:text-gold transition-colors">
                <Heart size={20} />
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate/20 mb-8">
              <div className="flex items-center gap-3 text-sm text-charcoal">
                <Truck size={20} className="text-gold" /> Free Shipping over ₹5000
              </div>
              <div className="flex items-center gap-3 text-sm text-charcoal">
                <RotateCcw size={20} className="text-gold" /> 7 Days Return
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-body font-medium text-charcoal mb-2">Description</h3>
              <p className="text-slate text-sm leading-relaxed mb-4">{product.shortDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
