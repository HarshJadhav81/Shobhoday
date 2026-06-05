import { IPaymentProvider, IPaymentOrder, IPaymentVerification, IRefundResult } from '../interfaces/IPaymentProvider';

export class StripeProvider implements IPaymentProvider {
  async createOrder(amount: number, currency: string, receiptId: string): Promise<IPaymentOrder> {
    throw new Error('Stripe is not implemented yet.');
  }
  
  verifyPayment(payload: any, signature: string): IPaymentVerification {
    throw new Error('Stripe is not implemented yet.');
  }
  
  verifyWebhookSignature(payload: string, signature: string): boolean {
    throw new Error('Stripe is not implemented yet.');
  }
  
  async refundPayment(paymentId: string, amount?: number): Promise<IRefundResult> {
    throw new Error('Stripe is not implemented yet.');
  }
}
