import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ReviewService } from '../services/review.service';
import { AuthService } from '../../auth/services/auth.service';
import { ApiResponse } from '../../../utils/ApiResponse';

const reviewSchema = z.object({
  product: z.string(),
  user: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
  isVerifiedPurchase: z.boolean().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

const updateReviewSchema = reviewSchema.partial();

export class ReviewController {
  static async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = reviewSchema.parse(req.body);
      const review = await ReviewService.createReview(data);
      
      const userId = (req as any).user.id as string;
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'CREATE', 'REVIEWS', ip, `Created review for product ${data.product}`);

      res.status(201).json(new ApiResponse('Review created successfully', review));
    } catch (error) {
      next(error);
    }
  }

  static async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, pagination } = await ReviewService.getReviews(req.query);
      res.status(200).json(new ApiResponse('Reviews retrieved successfully', data, pagination));
    } catch (error) {
      next(error);
    }
  }

  static async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateReviewSchema.parse(req.body);
      const review = await ReviewService.updateReview(req.params.id as string, data);
      
      const userId = (req as any).user.id as string;
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'UPDATE', 'REVIEWS', ip, `Updated review ${req.params.id}`);

      res.status(200).json(new ApiResponse('Review updated successfully', review));
    } catch (error) {
      next(error);
    }
  }
}
