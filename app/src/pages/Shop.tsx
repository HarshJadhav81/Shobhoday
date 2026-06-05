import { useParams } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { SectionHeader } from '../components/SectionHeader';
import { SEOMeta } from '../components/SEOMeta';

export default function Shop() {
  const { slug } = useParams<{ slug?: string }>();

  const allCategories = [
    'Sherwanis', 'Kurta-Pajama', 'Dhoti Sets', 'Indo-Western', 'Nehru Jackets',
    'Business Suits', 'Blazers', 'Trousers', 'Shirts', 'Ties & Accessories',
    'Groom Sherwanis', 'Wedding Suits', 'Baraat Outfits', 'Reception Wear',
    'T-Shirts', 'Polo Shirts', 'Casual Shirts', 'Denim', 'Chinos',
    'Pathani Suits', 'Kurtas', 'Festival Wear'
  ];

  const products: any[] = allCategories.map((name, i) => {
    const itemSlug = name.toLowerCase().replace(/ & /g, '_').replace(/-/g, '_').replace(/ /g, '_');
    return {
      _id: String(i + 1),
      title: `Premium ${name}`,
      slug: itemSlug,
      brand: 'Shobhoday',
      category: { name },
      media: [{ secureUrl: `/images/${itemSlug}.png` }],
      variants: [{ price: 2500 + (i % 5) * 1500, compareAtPrice: 4000 + (i % 5) * 1500 }]
    };
  });
  const title = slug ? `Shop ${slug.replace(/_/g, ' ')}` : 'All Products';

  return (
    <div className="bg-beige min-h-screen py-24 md:py-32">
      <SEOMeta title={`${title} | Shobhoday`} />
      <div className="max-w-[1440px] mx-auto px-6">
        <SectionHeader title={title} align="center" className="capitalize" />
        
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.filter(p => !slug || p.slug === slug).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
      </div>
    </div>
  );
}
