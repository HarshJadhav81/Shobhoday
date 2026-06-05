import mongoose, { Document, Schema } from 'mongoose';

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  guestId?: string; // For unauthenticated users
  items: {
    variant: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  coupon?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    guestId: { type: String, index: true },
    items: [
      {
        variant: { type: Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 });
cartSchema.index({ guestId: 1 });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
