import { api } from './api';

export const PaymentService = {
  createOrder: async (data: { shippingAddress: any, billingAddress?: any, guestId?: string, paymentMethod: 'razorpay' | 'cod' }) => {
    const response = await api.post('/payments/create-order', data);
    return response.data.data;
  },

  verifyPayment: async (data: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, orderId: string }) => {
    const response = await api.post('/payments/verify', data);
    return response.data.data;
  }
};
