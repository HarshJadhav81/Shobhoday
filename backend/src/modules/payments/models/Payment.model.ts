import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  paymentId: string;
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  gateway: 'razorpay' | 'stripe';
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'authorized' | 'captured' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
  transactionReference?: string;
  refundStatus?: 'none' | 'partial' | 'full';
  refundedAmount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    paymentId: { type: String, required: true, unique: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gateway: { type: String, enum: ['razorpay', 'stripe'], required: true },
    gatewayOrderId: { type: String, index: true },
    gatewayPaymentId: { type: String, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['pending', 'authorized', 'captured', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    transactionReference: { type: String },
    refundStatus: { type: String, enum: ['none', 'partial', 'full'], default: 'none' },
    refundedAmount: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
