import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CouponService } from '../services/coupon.service';
import { AuthService } from '../../auth/services/auth.service';
import { ApiResponse } from '../../../utils/ApiResponse';

const couponSchema = z.object({
  code: z.string().min(3),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0),
  minOrderValue: z.number().optional(),
  maxDiscount: z.number().optional(),
  validFrom: z.string().transform(str => new Date(str)),
  validUntil: z.string().transform(str => new Date(str)),
  usageLimit: z.number().optional(),
  perUserLimit: z.number().optional(),
  isActive: z.boolean().optional(),
});

const updateCouponSchema = couponSchema.partial();

export class CouponController {
  static async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const data = couponSchema.parse(req.body);
      const coupon = await CouponService.createCoupon(data);
      
      const userId = (req as any).user.id as string;
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'CREATE', 'COUPONS', ip, `Created coupon ${coupon.code}`);

      res.status(201).json(new ApiResponse('Coupon created successfully', coupon));
    } catch (error) {
      next(error);
    }
  }

  static async getCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, pagination } = await CouponService.getCoupons(req.query);
      res.status(200).json(new ApiResponse('Coupons retrieved successfully', data, pagination));
    } catch (error) {
      next(error);
    }
  }

  static async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateCouponSchema.parse(req.body);
      const coupon = await CouponService.updateCoupon(req.params.id as string, data);
      
      const userId = (req as any).user.id as string;
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'UPDATE', 'COUPONS', ip, `Updated coupon ${coupon.code}`);

      res.status(200).json(new ApiResponse('Coupon updated successfully', coupon));
    } catch (error) {
      next(error);
    }
  }

  static async deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id as string;
      const coupon = await CouponService.deleteCoupon(req.params.id as string, userId);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'DELETE', 'COUPONS', ip, `Deleted coupon ${coupon.code}`);

      res.status(200).json(new ApiResponse('Coupon deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}
