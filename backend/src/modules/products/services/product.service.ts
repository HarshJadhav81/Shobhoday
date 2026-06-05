import mongoose from 'mongoose';
import { Product } from '../models/Product.model';
import { ProductVariant } from '../models/ProductVariant.model';
import { AppError } from '../../../utils/AppError';
import { ApiFeatures } from '../../../utils/ApiFeatures';

export class ProductService {
  static async createProduct(productData: any, variantsData: any[]) {
    const existing = await Product.findOne({ slug: productData.slug });
    if (existing) throw new AppError('Product slug already exists', 400);

    const product = await Product.create(productData);

    const variantsToInsert = variantsData.map((v) => ({
      ...v,
      product: product._id,
    }));

    await ProductVariant.insertMany(variantsToInsert);

    return { product, variants: variantsToInsert };
  }

  static async getProducts(queryString: any) {
    const features = new ApiFeatures(Product.find({ isDeleted: false }).populate('category media'), queryString)
      .filter()
      .sort()
      .limitFields()
      .search(['title', 'slug', 'brand']);

    await features.paginate(Product);
    const data = await features.query.lean();

    return {
      data,
      pagination: features.paginationData,
    };
  }

  static async getProductById(id: string) {
    const product = await Product.findOne({ _id: id, isDeleted: false }).populate('category media').lean();
    if (!product) throw new AppError('Product not found', 404);

    const variants = await ProductVariant.find({ product: product._id, isDeleted: false }).lean();
    return { product, variants };
  }

  static async updateProduct(id: string, productData: any, variantsData?: any[]) {
    if (productData.slug) {
      const existing = await Product.findOne({ slug: productData.slug, _id: { $ne: id } });
      if (existing) throw new AppError('Product slug already exists', 400);
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: productData },
      { new: true }
    );
    if (!product) throw new AppError('Product not found', 404);

    if (variantsData && variantsData.length > 0) {
      // For simplicity in this phase, we update existing variants by SKU, and insert new ones.
      for (const v of variantsData) {
        if (v._id) {
          await ProductVariant.findOneAndUpdate(
            { _id: v._id, product: id },
            { $set: v }
          );
        } else {
          await ProductVariant.create({ ...v, product: id });
        }
      }
    }

    return product;
  }

  static async deleteProduct(id: string, deletedBy: string) {
    const product = await Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy, isActive: false },
      { new: true }
    );
    if (!product) throw new AppError('Product not found', 404);

    await ProductVariant.updateMany(
      { product: product._id },
      { isDeleted: true, deletedAt: new Date(), deletedBy, status: 'archived' }
    );
    
    return product;
  }

  static async bulkPublish(ids: string[], isActive: boolean) {
    const results = { processed: 0, successful: 0, failed: 0, failures: [] as any[] };
    
    for (const id of ids) {
      results.processed++;
      try {
        const product = await Product.findOneAndUpdate(
          { _id: id, isDeleted: false },
          { isActive },
          { new: true }
        );
        if (!product) throw new AppError('Not found', 404);
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.failures.push({ id, reason: error.message });
      }
    }
    
    return results;
  }

  static async bulkDelete(ids: string[], deletedBy: string) {
    const results = { processed: 0, successful: 0, failed: 0, failures: [] as any[] };
    
    for (const id of ids) {
      results.processed++;
      try {
        await this.deleteProduct(id, deletedBy);
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.failures.push({ id, reason: error.message });
      }
    }
    
    return results;
  }
}
