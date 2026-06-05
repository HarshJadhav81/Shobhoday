import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem extends Document {
  order: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  variant: mongoose.Types.ObjectId;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  costPrice?: number;
  gstPercentage: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },      // Price at time of purchase
    costPrice: { type: Number },                  // For profit calculations
    gstPercentage: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

orderItemSchema.index({ order: 1 });
orderItemSchema.index({ variant: 1 });

export const OrderItem = mongoose.model<IOrderItem>('OrderItem', orderItemSchema);
