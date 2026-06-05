import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../../auth/services/auth.service';
import { ApiResponse } from '../../../utils/ApiResponse';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  parent: z.string().optional().nullable(),
  description: z.string().optional(),
  thumbnailImage: z.string().url().optional(),
  bannerImage: z.string().url().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isActive: z.boolean().optional(),
});

const updateCategorySchema = categorySchema.partial();

export class CategoryController {
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = categorySchema.parse(req.body);
      const category = await CategoryService.createCategory(data);
      
      const userId = (req as any).user.id as string;
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'CREATE', 'CATEGORIES', ip, `Created category ${category.slug}`);

      res.status(201).json(new ApiResponse('Category created successfully', category));
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, pagination } = await CategoryService.getCategories(req.query);
      res.status(200).json(new ApiResponse('Categories retrieved successfully', data, pagination));
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id as string);
      res.status(200).json(new ApiResponse('Category retrieved successfully', category));
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateCategorySchema.parse(req.body);
      const category = await CategoryService.updateCategory(req.params.id as string, data);
      
      const userId = (req as any).user.id as string;
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'UPDATE', 'CATEGORIES', ip, `Updated category ${category.slug}`);

      res.status(200).json(new ApiResponse('Category updated successfully', category));
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id as string;
      const category = await CategoryService.deleteCategory(req.params.id as string, userId);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'DELETE', 'CATEGORIES', ip, `Deleted category ${category.slug}`);

      res.status(200).json(new ApiResponse('Category deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async bulkDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      const userId = (req as any).user.id as string;
      
      const results = await CategoryService.bulkDelete(ids, userId);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'DELETE', 'CATEGORIES', ip, `Bulk deleted ${results.successful} categories`);

      res.status(200).json(new ApiResponse('Bulk operation completed', results));
    } catch (error) {
      next(error);
    }
  }
}
