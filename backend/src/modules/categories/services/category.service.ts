import { Category } from '../models/Category.model';
import { AppError } from '../../../utils/AppError';
import { ApiFeatures } from '../../../utils/ApiFeatures';

export class CategoryService {
  static async createCategory(data: any) {
    if (data.parent) {
      const parentExists = await Category.findById(data.parent);
      if (!parentExists) throw new AppError('Parent category not found', 404);
    }
    
    const existing = await Category.findOne({ slug: data.slug });
    if (existing) throw new AppError('Slug already in use', 400);

    return Category.create(data);
  }

  static async getCategories(queryString: any) {
    const features = new ApiFeatures(Category.find({ isDeleted: false }).populate('thumbnailMedia bannerMedia'), queryString)
      .filter()
      .sort()
      .limitFields()
      .search(['name', 'slug']);

    await features.paginate(Category);
    const data = await features.query.lean();

    return {
      data,
      pagination: features.paginationData,
    };
  }

  static async getCategoryById(id: string) {
    const category = await Category.findOne({ _id: id, isDeleted: false }).populate('thumbnailMedia bannerMedia').lean();
    if (!category) throw new AppError('Category not found', 404);
    return category;
  }

  static async updateCategory(id: string, data: any) {
    if (data.slug) {
      const existing = await Category.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) throw new AppError('Slug already in use', 400);
    }

    if (data.parent && data.parent === id) {
      throw new AppError('Category cannot be its own parent', 400);
    }

    const category = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true }
    );
    if (!category) throw new AppError('Category not found', 404);
    
    return category;
  }

  static async deleteCategory(id: string, deletedBy: string) {
    const hasChildren = await Category.exists({ parent: id, isDeleted: false });
    if (hasChildren) throw new AppError('Cannot delete category with active subcategories', 400);

    const category = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy, isActive: false },
      { new: true }
    );

    if (!category) throw new AppError('Category not found', 404);
    return category;
  }

  static async bulkDelete(ids: string[], deletedBy: string) {
    const results = { processed: 0, successful: 0, failed: 0, failures: [] as any[] };
    
    for (const id of ids) {
      results.processed++;
      try {
        await this.deleteCategory(id, deletedBy);
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.failures.push({ id, reason: error.message });
      }
    }
    
    return results;
  }
}
