import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { OrderService } from '../services/order.service';
import { AuthService } from '../../auth/services/auth.service';
import { ApiResponse } from '../../../utils/ApiResponse';

const orderItemSchema = z.object({
  variantId: z.string(),
  quantity: z.number().min(1),
});

const createOrderSchema = z.object({
  orderData: z.object({
    orderNumber: z.string(),
    user: z.string(),
    shippingAddress: z.string(),
    billingAddress: z.string(),
    shippingFee: z.number().min(0).optional(),
    discountTotal: z.number().min(0).optional(),
  }),
  items: z.array(orderItemSchema).min(1),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded']),
  notes: z.string().optional(),
});

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createOrderSchema.parse(req.body);
      const userId = (req as any).user.id as string;
      
      const result = await OrderService.createOrder(data.orderData, data.items, userId);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'CREATE', 'ORDERS', ip, `Created order ${result.order.orderNumber}`);

      res.status(201).json(new ApiResponse('Order created successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, pagination } = await OrderService.getOrders(req.query);
      res.status(200).json(new ApiResponse('Orders retrieved successfully', data, pagination));
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.getOrderById(req.params.id as string);
      res.status(200).json(new ApiResponse('Order retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateOrderStatusSchema.parse(req.body);
      const userId = (req as any).user.id as string;
      
      const order = await OrderService.updateOrderStatus(req.params.id as string, data.status, userId, data.notes);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'UPDATE', 'ORDERS', ip, `Updated order ${order.orderNumber} status to ${data.status}`);

      res.status(200).json(new ApiResponse('Order status updated successfully', order));
    } catch (error) {
      next(error);
    }
  }

  static async bulkStatusUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { updates } = req.body;
      const userId = (req as any).user.id as string;
      
      const results = await OrderService.bulkStatusUpdate(updates, userId);
      
      const ip = (req.ip || req.socket.remoteAddress || 'unknown') as string;
      await AuthService.logActivity(userId, 'UPDATE', 'ORDERS', ip, `Bulk updated ${results.successful} order statuses`);

      res.status(200).json(new ApiResponse('Bulk operation completed', results));
    } catch (error) {
      next(error);
    }
  }
}
