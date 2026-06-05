import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../../../config/env';
import { IPaymentProvider, IPaymentOrder, IPaymentVerification, IRefundResult } from '../interfaces/IPaymentProvider';
import { AppError } from '../../../utils/AppError';

export class RazorpayProvider implements IPaymentProvider {
  private razorpay: Razorpay;

  constructor() {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_SECRET) {
      throw new Error('Razorpay keys are missing in environment variables');
    }
    
    this.razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_SECRET
    });
  }

  async createOrder(amount: number, currency: string = 'INR', receiptId: string): Promise<IPaymentOrder> {
    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise)
        currency,
        receipt: receiptId
      };
      
      const order = await this.razorpay.orders.create(options);
      
      return {
        id: order.id,
        amount: order.amount as number / 100, // Convert back to rupees
        currency: order.currency,
        receipt: order.receipt,
        status: order.status
      };
    } catch (error: any) {
      throw new AppError(`Razorpay order creation failed: ${error.message}`, 500);
    }
  }

  verifyPayment(payload: any, signature: string): IPaymentVerification {
    try {
      const { razorpay_order_id, razorpay_payment_id } = payload;
      
      if (!razorpay_order_id || !razorpay_payment_id) {
        return { isValid: false, error: 'Missing order_id or payment_id' };
      }

      const generatedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_SECRET as string)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        return { isValid: false, error: 'Invalid signature' };
      }

      return {
        isValid: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      };
    } catch (error: any) {
      return { isValid: false, error: error.message };
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!env.RAZORPAY_WEBHOOK_SECRET) {
      throw new Error('Razorpay webhook secret is missing');
    }
    
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');
      
    return expectedSignature === signature;
  }

  async refundPayment(paymentId: string, amount?: number): Promise<IRefundResult> {
    try {
      // Amount should be in paise
      const options = amount ? { amount: amount * 100 } : {};
      
      const refund = await this.razorpay.payments.refund(paymentId, options);
      
      return {
        id: refund.id,
        amount: (refund.amount as number) / 100,
        status: refund.status
      };
    } catch (error: any) {
      throw new AppError(`Refund failed: ${error.message}`, 500);
    }
  }
}
