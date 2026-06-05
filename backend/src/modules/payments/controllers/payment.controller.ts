import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { Payment } from '../models/Payment.model';
import { ApiResponse } from '../../../utils/ApiResponse';
import { AppError } from '../../../utils/AppError';

export class PaymentController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, gateway } = req.body;
      const userId = (req as any).user.id as string;
      
      const { payment, gatewayOrder } = await PaymentService.createOrder(orderId, gateway || 'razorpay', userId);
      
      res.status(200).json(new ApiResponse('Payment order created successfully', { payment, gatewayOrder }));
    } catch (error) {
      next(error);
    }
  }

  static async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId, payload, signature } = req.body;
      
      if (!paymentId || !payload || !signature) {
        throw new AppError('paymentId, payload, and signature are required', 400);
      }

      const payment = await PaymentService.verifyPayment(paymentId, payload, signature);
      
      res.status(200).json(new ApiResponse('Payment verified successfully', payment));
    } catch (error) {
      next(error);
    }
  }

  static async refundPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId, amount } = req.body;
      const userId = (req as any).user.id as string;
      
      const payment = await PaymentService.processRefund(paymentId, userId, amount);
      
      res.status(200).json(new ApiResponse('Refund processed successfully', payment));
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await Payment.findOne({ paymentId: req.params.id as string }).populate('order');
      if (!payment) throw new AppError('Payment not found', 404);
      
      res.status(200).json(new ApiResponse('Payment retrieved successfully', payment));
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await Payment.findOne({ order: req.params.orderId as string });
      if (!payment) throw new AppError('Payment not found for this order', 404);
      
      res.status(200).json(new ApiResponse('Payment retrieved successfully', payment));
    } catch (error) {
      next(error);
    }
  }
}
