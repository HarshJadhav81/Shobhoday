import mongoose, { Document, Schema } from 'mongoose';

export interface IGiftCard extends Document {
  code: string;
  balance: number;
  initialValue: number;
  currency: string;
  expiryDate: Date;
  status: 'active' | 'used' | 'expired' | 'disabled';
  user?: mongoose.Types.ObjectId; // If assigned to a user
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const giftCardSchema = new Schema<IGiftCard>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    balance: { type: Number, required: true, min: 0 },
    initialValue: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'used', 'expired', 'disabled'],
      default: 'active',
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

giftCardSchema.index({ code: 1 });
giftCardSchema.index({ user: 1 });
giftCardSchema.index({ status: 1 });
giftCardSchema.index({ isDeleted: 1 });

export const GiftCard = mongoose.model<IGiftCard>('GiftCard', giftCardSchema);
