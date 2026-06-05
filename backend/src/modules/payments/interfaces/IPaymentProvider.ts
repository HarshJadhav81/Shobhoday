export interface IPaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string | undefined;
  status: string;
}

export interface IPaymentVerification {
  isValid: boolean;
  paymentId?: string | undefined;
  orderId?: string | undefined;
  error?: string | undefined;
}

export interface IRefundResult {
  id: string;
  amount: number;
  status: string;
}

export interface IPaymentProvider {
  /**
   * Create an order on the payment gateway
   */
  createOrder(amount: number, currency: string, receiptId: string): Promise<IPaymentOrder>;
  
  /**
   * Verify the payment signature from the client
   */
  verifyPayment(payload: any, signature: string): IPaymentVerification;
  
  /**
   * Verify a webhook event signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean;
  
  /**
   * Issue a refund
   */
  refundPayment(paymentId: string, amount?: number): Promise<IRefundResult>;
}
