import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../../auth/services/auth.service';
import { ApiResponse } from '../../../utils/ApiResponse';

const updateCustomerSchema = z.object({
  loyaltyPoints: z.number().optional(),
  accountStatus: z.enum(['active', 'suspended', 'banned', 'pending']).optional(),
  isEmailVerified: z.boolean().optional(),
});

export class CustomerController {
  static async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, pagination } = await CustomerService.getCustomers(req.query);
      res.status(200).json(new ApiResponse('Customers retrieved successfully', data, pagination));
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.getCustomerById(req.params.id as string);
      res.status(200).json(new ApiResponse('Customer retrieved successfully', customer));
    } catch (error) {
      next(error);
    }
  }

  static async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateCustomerSchema.parse(req.body);
      const customer = await CustomerService.updateCustomer(req.params.id as string, data);
      
      const userId = (req as any).user.id as string;
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'UPDATE', 'CUSTOMERS', ip, `Updated customer ${customer.email}`);

      res.status(200).json(new ApiResponse('Customer updated successfully', customer));
    } catch (error) {
      next(error);
    }
  }
}
