import { WebhookEvent } from '../models/WebhookEvent.model';
import { Payment } from '../models/Payment.model';
import { RazorpayProvider } from '../providers/RazorpayProvider';
import { AppError } from '../../../utils/AppError';
import { OrderService } from '../../orders/services/order.service';

export class WebhookService {
  static async handleRazorpayWebhook(payload: any, signature: string, rawBody: string) {
    const provider = new RazorpayProvider();
    const isValid = provider.verifyWebhookSignature(rawBody, signature);
    
    if (!isValid) {
      throw new AppError('Invalid webhook signature', 401);
    }

    const eventId = payload.headers && payload.headers['x-razorpay-event-id'] ? payload.headers['x-razorpay-event-id'] : payload.id || `evt_${Date.now()}`;
    const eventType = payload.event;

    // Idempotency check
    const existingEvent = await WebhookEvent.findOne({ eventId });
    if (existingEvent) {
      if (existingEvent.processed) {
        return { message: 'Event already processed' };
      }
    } else {
      await WebhookEvent.create({
        eventId,
        gateway: 'razorpay',
        type: eventType,
        eventData: payload
      });
    }

    try {
      await this.processRazorpayEvent(eventType, payload.payload);
      
      await WebhookEvent.findOneAndUpdate({ eventId }, { processed: true });
      return { message: 'Webhook processed successfully' };
    } catch (error: any) {
      await WebhookEvent.findOneAndUpdate({ eventId }, { error: error.message });
      throw error;
    }
  }

  private static async processRazorpayEvent(eventType: string, eventPayload: any) {
    const paymentEntity = eventPayload.payment?.entity;
    if (!paymentEntity) return;

    const gatewayOrderId = paymentEntity.order_id;
    const payment = await Payment.findOne({ gatewayOrderId });
    
    if (!payment) {
      console.error(`Webhook: Payment not found for gatewayOrderId ${gatewayOrderId}`);
      return;
    }

    switch (eventType) {
      case 'payment.authorized':
      case 'payment.captured':
        if (payment.status === 'pending') {
          payment.status = eventType === 'payment.captured' ? 'captured' : 'authorized';
          payment.gatewayPaymentId = paymentEntity.id;
          await payment.save();

          await OrderService.updateOrderStatus(
            payment.order.toString(),
            'confirmed',
            payment.user.toString(),
            `Payment ${eventType} via webhook`
          );
        }
        break;

      case 'payment.failed':
        payment.status = 'failed';
        await payment.save();
        
        await OrderService.updateOrderStatus(
          payment.order.toString(),
          'payment_failed',
          payment.user.toString(),
          'Payment failed via webhook'
        );
        break;
        
      case 'refund.processed':
        const refundAmount = paymentEntity.amount_refunded / 100;
        if (refundAmount >= payment.amount) {
            payment.status = 'refunded';
            payment.refundStatus = 'full';
        } else {
            payment.status = 'partially_refunded';
            payment.refundStatus = 'partial';
        }
        payment.refundedAmount = refundAmount;
        await payment.save();
        break;
    }
  }
}
