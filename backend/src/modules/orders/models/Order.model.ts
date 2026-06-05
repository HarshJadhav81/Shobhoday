import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  invoiceNumber?: string;
  user: mongoose.Types.ObjectId;
  shippingAddress: mongoose.Types.ObjectId;
  billingAddress: mongoose.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'refunded' | 'payment_failed';
  statusHistory: { status: string; date: Date; comment?: string; notes?: string; changedBy?: mongoose.Types.ObjectId }[];
  subTotal: number;
  taxTotal: number;
  shippingFee: number;
  discountTotal: number;
  grandTotal: number;
  couponApplied?: mongoose.Types.ObjectId;
  trackingNumber?: string;
  shippingProvider?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  orderSource: 'website' | 'admin' | 'mobileApp';
  currency: string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    invoiceNumber: { type: String, unique: true, sparse: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shippingAddress: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
    billingAddress: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded', 'payment_failed'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        date: { type: Date, default: Date.now },
        comment: { type: String },
        notes: { type: String },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    subTotal: { type: Number, required: true },
    taxTotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    discountTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    couponApplied: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    trackingNumber: { type: String },
    shippingProvider: { type: String },
    estimatedDeliveryDate: { type: Date },
    actualDeliveryDate: { type: Date },
    orderSource: { type: String, enum: ['website', 'admin', 'mobileApp'], default: 'website' },
    currency: { type: String, default: 'INR' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ isDeleted: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
