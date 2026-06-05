import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ProductService } from '../services/product.service';
import { AuthService } from '../../auth/services/auth.service';
import { ApiResponse } from '../../../utils/ApiResponse';

const variantSchema = z.object({
  _id: z.string().optional(),
  sku: z.string(),
  barcode: z.string().optional(),
  color: z.string().optional(),
  colorCode: z.string().optional(),
  size: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }).optional(),
  media: z.array(z.object({
    url: z.string().url(),
    altText: z.string().optional(),
    sortOrder: z.number().optional(),
    mediaType: z.enum(['image', 'video']).optional(),
    videoUrl: z.string().url().optional(),
  })).optional(),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  gstPercentage: z.number().min(0).optional(),
  status: z.enum(['active', 'draft', 'archived']).optional(),
});

const productSchema = z.object({
  product: z.object({
    title: z.string().min(1),
    slug: z.string(),
    shortDescription: z.string().optional(),
    longDescription: z.string().optional(),
    brand: z.string().optional(),
    category: z.string(),
    subCategory: z.string().optional(),
    gender: z.enum(['men', 'women', 'unisex', 'kids']).optional(),
    tags: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    featured: z.boolean().optional(),
    trending: z.boolean().optional(),
    bestseller: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
  variants: z.array(variantSchema).min(1, 'At least one variant is required')
});

const updateProductSchema = z.object({
  product: productSchema.shape.product.partial(),
  variants: z.array(variantSchema).optional(),
});

export class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const data = productSchema.parse(req.body);
      const result = await ProductService.createProduct(data.product, data.variants);
      
      const userId = (req as any).user.id as string;
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'CREATE', 'PRODUCTS', ip, `Created product ${result.product.slug} with ${result.variants.length} variants`);

      res.status(201).json(new ApiResponse('Product created successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, pagination } = await ProductService.getProducts(req.query);
      res.status(200).json(new ApiResponse('Products retrieved successfully', data, pagination));
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getProductById(req.params.id as string);
      res.status(200).json(new ApiResponse('Product retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateProductSchema.parse(req.body);
      const product = await ProductService.updateProduct(req.params.id as string, data.product, data.variants);
      
      const userId = (req as any).user.id as string;
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'UPDATE', 'PRODUCTS', ip, `Updated product ${product.slug}`);

      res.status(200).json(new ApiResponse('Product updated successfully', product));
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id as string;
      const product = await ProductService.deleteProduct(req.params.id as string, userId);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'DELETE', 'PRODUCTS', ip, `Deleted product ${product.slug}`);

      res.status(200).json(new ApiResponse('Product deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async bulkPublish(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, isActive } = req.body;
      const results = await ProductService.bulkPublish(ids, isActive);
      
      const userId = (req as any).user.id as string;
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'UPDATE', 'PRODUCTS', ip, `Bulk publish (${isActive}) ${results.successful} products`);

      res.status(200).json(new ApiResponse('Bulk operation completed', results));
    } catch (error) {
      next(error);
    }
  }

  static async bulkDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      const userId = (req as any).user.id as string;
      
      const results = await ProductService.bulkDelete(ids, userId);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'DELETE', 'PRODUCTS', ip, `Bulk deleted ${results.successful} products`);

      res.status(200).json(new ApiResponse('Bulk operation completed', results));
    } catch (error) {
      next(error);
    }
  }
}
