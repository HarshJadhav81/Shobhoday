import { Payment } from '../models/Payment.model';
import { Order } from '../../orders/models/Order.model';
import { OrderService } from '../../orders/services/order.service';
import { AppError } from '../../../utils/AppError';
import { RazorpayProvider } from '../providers/RazorpayProvider';
import { StripeProvider } from '../providers/StripeProvider';
import { IPaymentProvider } from '../interfaces/IPaymentProvider';

export class PaymentService {
  private static getProvider(gateway: string): IPaymentProvider {
    if (gateway === 'razorpay') {
      return new RazorpayProvider();
    } else if (gateway === 'stripe') {
      return new StripeProvider();
    }
    throw new AppError('Invalid payment gateway', 400);
  }

  static async createOrder(orderId: string, gateway: 'razorpay' | 'stripe' = 'razorpay', userId: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);
    
    if (order.status !== 'pending') {
      throw new AppError('Order is not in pending status', 400);
    }

    const provider = this.getProvider(gateway);
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Ensure 2 decimal precision
    const amount = Number(order.grandTotal.toFixed(2));
    
    const gatewayOrder = await provider.createOrder(amount, order.currency, paymentId);

    const payment = await Payment.create({
      paymentId,
      order: order._id,
      user: userId,
      gateway,
      gatewayOrderId: gatewayOrder.id,
      amount,
      currency: order.currency,
      status: 'pending'
    });

    return { payment, gatewayOrder };
  }

  static async verifyPayment(paymentId: string, payload: any, signature: string) {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) throw new AppError('Payment not found', 404);

    const provider = this.getProvider(payment.gateway);
    const verification = provider.verifyPayment(payload, signature);

    if (!verification.isValid) {
      payment.status = 'failed';
      await payment.save();
      
      await OrderService.updateOrderStatus(
        payment.order.toString(),
        'payment_failed',
        payment.user.toString(),
        'Payment signature verification failed'
      );
      
      throw new AppError(verification.error || 'Invalid payment signature', 400);
    }

    // Payment is valid
    payment.status = 'authorized';
    payment.gatewayPaymentId = verification.paymentId as string;
    await payment.save();

    await OrderService.updateOrderStatus(
      payment.order.toString(),
      'confirmed',
      payment.user.toString(),
      'Payment verified successfully'
    );

    return payment;
  }

  static async processRefund(paymentId: string, userId: string, amount?: number) {
    const payment = await Payment.findOne({ paymentId });
    if (!payment) throw new AppError('Payment not found', 404);

    if (payment.status !== 'authorized' && payment.status !== 'captured') {
      throw new AppError('Only authorized or captured payments can be refunded', 400);
    }

    const provider = this.getProvider(payment.gateway);
    const refundResult = await provider.refundPayment(payment.gatewayPaymentId as string, amount);

    if (amount && amount < payment.amount) {
      payment.status = 'partially_refunded';
      payment.refundStatus = 'partial';
      payment.refundedAmount += amount;
    } else {
      payment.status = 'refunded';
      payment.refundStatus = 'full';
      payment.refundedAmount = payment.amount;
    }
    
    await payment.save();

    // If fully refunded, cancel the order
    if (payment.refundStatus === 'full') {
      await OrderService.updateOrderStatus(
        payment.order.toString(),
        'cancelled',
        userId,
        `Order cancelled due to full refund (${refundResult.id})`
      );
    }

    return payment;
  }
}
