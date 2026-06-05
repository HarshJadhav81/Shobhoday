import React, { useState, useEffect } from 'react';
import { Plus, Edit2, ChevronRight, FolderTree, Loader2, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryService } from '../../../services/categories.service';
import type { Category, CategoryInput } from '../../../services/categories.service';
import { ImageUploader } from '../../../components/ui/ImageUploader';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  parent: z.string().optional(),
  thumbnailMedia: z.string().optional(),
  bannerMedia: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export const CategoryManagerPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { isActive: true }
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddNew = (parentId?: string) => {
    setSelectedCategory(null);
    setIsEditing(true);
    reset({
      name: '',
      slug: '',
      description: '',
      parent: parentId || '',
      thumbnailMedia: '',
      bannerMedia: '',
      isActive: true,
    });
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    
    // Parent could be populated object or just ID string
    const parentId = typeof category.parent === 'object' && category.parent !== null 
      ? (category.parent as Category)._id 
      : (category.parent as string) || '';

    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent: parentId,
      thumbnailMedia: category.thumbnailMedia?._id || '',
      bannerMedia: category.bannerMedia?._id || '',
      isActive: category.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await CategoryService.delete(id);
      await fetchCategories();
      if (selectedCategory?._id === id) {
        setIsEditing(false);
        setSelectedCategory(null);
      }
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      // Clean up empty strings for ObjectIds
      const payload: CategoryInput = {
        ...data,
        parent: data.parent === '' ? undefined : data.parent,
        thumbnailMedia: data.thumbnailMedia === '' ? undefined : data.thumbnailMedia,
        bannerMedia: data.bannerMedia === '' ? undefined : data.bannerMedia,
      };

      if (selectedCategory) {
        await CategoryService.update(selectedCategory._id, payload);
      } else {
        await CategoryService.create(payload);
      }
      
      await fetchCategories();
      setIsEditing(false);
      setSelectedCategory(null);
    } catch (error: any) {
      alert(error.message || 'Failed to save category');
    }
  };

  // Build Tree
  const rootCategories = categories.filter(c => !c.parent);

  const renderTree = (cats: Category[], depth = 0) => {
    return cats.map(cat => {
      // children logic: find categories whose parent ID matches this cat._id
      const children = categories.filter(c => {
        const pid = typeof c.parent === 'object' && c.parent !== null ? (c.parent as Category)._id : c.parent;
        return pid === cat._id;
      });

      return (
        <div key={cat._id}>
          <div className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50 text-gray-700 ${selectedCategory?._id === cat._id ? 'bg-gray-100 font-medium' : ''}`}>
            <div className="flex items-center" style={{ paddingLeft: `${depth * 1.5}rem` }}>
              {children.length > 0 ? <ChevronRight size={16} className="mr-1 text-gray-400" /> : <span className="w-5" />}
              <span onClick={() => handleEdit(cat)}>{cat.name}</span>
            </div>
            <div className="flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(cat)} className="p-1 text-gray-400 hover:text-black"><Edit2 size={14} /></button>
              <button onClick={() => handleAddNew(cat._id)} className="p-1 text-gray-400 hover:text-black"><Plus size={14} /></button>
            </div>
          </div>
          {children.length > 0 && (
            <div className="space-y-1">
              {renderTree(children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Category Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your products into a hierarchy</p>
        </div>
        <button 
          onClick={() => handleAddNew()}
          className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 font-medium"
        >
          <Plus size={18} />
          <span>Add Root Category</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Category Tree */}
        <div className="col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm p-4 h-fit max-h-[800px] overflow-y-auto">
          <h3 className="font-semibold mb-4 text-gray-900 flex items-center">
            <FolderTree size={18} className="mr-2 text-gray-500" />
            Category Tree
          </h3>
          <div className="space-y-1">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">No categories found.</p>
            ) : (
              renderTree(rootCategories)
            )}
          </div>
        </div>

        {/* Category Editor */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          {!isEditing ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500">
              <FolderTree size={48} className="text-gray-300 mb-4" />
              <p>Select a category from the tree to edit or click Add Root Category.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedCategory ? `Edit: ${selectedCategory.name}` : 'Create New Category'}
                </h3>
                <div className="flex space-x-2">
                  {selectedCategory && (
                    <button 
                      type="button" 
                      onClick={() => handleDelete(selectedCategory._id)}
                      className="text-red-600 px-3 py-1.5 border border-red-200 rounded hover:bg-red-50 text-sm font-medium flex items-center"
                    >
                      <Trash2 size={14} className="mr-1"/> Delete
                    </button>
                  )}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 text-sm font-medium flex items-center"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin mr-1"/> : null}
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category Name</label>
                  <input 
                    type="text" 
                    {...register('name')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" 
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">URL Slug</label>
                  <input 
                    type="text" 
                    {...register('slug')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none" 
                  />
                  {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Parent Category</label>
                  <select 
                    {...register('parent')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">None (Root)</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" {...register('isActive')} className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black" />
                    <span className="text-sm font-medium text-gray-700">Is Active</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
                    <ImageUploader 
                      folder="categories"
                      defaultPreview={selectedCategory?.thumbnailMedia?.secureUrl}
                      onUploadSuccess={(id) => setValue('thumbnailMedia', id)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Banner Image</label>
                    <ImageUploader 
                      folder="categories"
                      defaultPreview={selectedCategory?.bannerMedia?.secureUrl}
                      onUploadSuccess={(id) => setValue('bannerMedia', id)}
                    />
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <div className="space-y-2">
                    <textarea 
                      rows={3} 
                      {...register('description')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
