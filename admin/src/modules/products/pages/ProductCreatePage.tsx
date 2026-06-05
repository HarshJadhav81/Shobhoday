import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductService } from '../../../services/products.service';
import { CategoryService } from '../../../services/categories.service';
import type { Category } from '../../../services/categories.service';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { ImageUploader } from '../../../components/ui/ImageUploader';

const variantSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0, 'Price must be positive'),
  compareAtPrice: z.number().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  mediaId: z.string().optional() // Extracted from uploader
});

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  shortDescription: z.string().optional(),
  isActive: z.boolean(),
  variants: z.array(variantSchema).min(1, 'At least one variant is required')
});

type ProductFormValues = z.infer<typeof productSchema>;

export const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const { register, control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      variants: [{ sku: '', price: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  useEffect(() => {
    CategoryService.getAll().then(data => {
      setCategories(data);
      setLoadingCats(false);
    });
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const payload = {
        product: {
          title: data.title,
          slug: data.slug,
          category: data.category,
          brand: data.brand,
          shortDescription: data.shortDescription,
          isActive: data.isActive
        },
        variants: data.variants.map(v => ({
          sku: v.sku,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          color: v.color,
          size: v.size,
          // If mediaId exists, wrap it in the expected backend schema structure for media
          media: v.mediaId ? [{ _id: v.mediaId }] : [] // Note: backend expects media ObjectIds or similar, actually backend schema says array of objects? Wait, variantSchema says media is array of { url... }. Ah, backend variant schema was refactored in Phase 4I to just use ObjectId refs for media. So just pass media: [v.mediaId].
        }))
      };

      // Ensure media payload matches what the backend expects after Phase 4I. 
      // Phase 4I refactored ProductVariant to use `media: [{ type: Schema.Types.ObjectId, ref: 'Media' }]`.
      // So passing `media: [v.mediaId]` is correct if we extract only valid IDs.
      const cleanedPayload = {
        product: payload.product,
        variants: payload.variants.map(v => ({
          ...v,
          media: v.media ? v.media.map(m => m._id).filter(id => !!id) : []
        }))
      };

      await ProductService.create(cleanedPayload);
      navigate('/products');
    } catch (error: any) {
      alert(error.message || 'Failed to create product');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Product</h1>
          <p className="text-sm text-gray-500 mt-1">Add a new product to your catalog</p>
        </div>
        <div className="flex space-x-3">
          <button type="button" onClick={() => navigate('/products')} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium">Discard</button>
          <button type="submit" disabled={isSubmitting} className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-medium disabled:opacity-50">
            {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Save Product
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-bold">Basic Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Product Title</label>
              <input type="text" {...register('title')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
              {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">URL Slug</label>
              <input type="text" {...register('slug')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
              {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select {...register('category')} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white">
                <option value="">Select a category</option>
                {!loadingCats && categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <input type="text" {...register('brand')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Short Description</label>
            <textarea rows={3} {...register('shortDescription')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('isActive')} className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black" />
              <span className="text-sm font-medium text-gray-700">Is Active</span>
            </label>
          </div>
        </div>

        {/* Variants Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Variants & Media</h2>
            <button 
              type="button" 
              onClick={() => append({ sku: '', price: 0 })}
              className="flex items-center space-x-1 text-sm font-medium text-black hover:text-gray-600"
            >
              <Plus size={16} /> <span>Add Variant</span>
            </button>
          </div>

          {errors.variants?.message && (
            <p className="text-sm text-red-600">{errors.variants.message}</p>
          )}

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                <button 
                  type="button" 
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
                
                <h3 className="text-sm font-medium text-gray-900 mb-4">Variant {index + 1}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">SKU</label>
                    <input type="text" {...register(`variants.${index}.sku` as const)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
                    {errors.variants?.[index]?.sku && <p className="text-xs text-red-600">{errors.variants[index]?.sku?.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Price (₹)</label>
                    <input type="number" {...register(`variants.${index}.price` as const, { valueAsNumber: true })} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
                    {errors.variants?.[index]?.price && <p className="text-xs text-red-600">{errors.variants[index]?.price?.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Color</label>
                    <input type="text" {...register(`variants.${index}.color` as const)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">Size</label>
                    <input type="text" {...register(`variants.${index}.size` as const)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Variant Image</label>
                  <ImageUploader 
                    folder="variants" 
                    onUploadSuccess={(id) => setValue(`variants.${index}.mediaId`, id)}
                    className="max-w-[200px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
