import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  percentageDiscount?: number;
  fixedDiscount?: number;
  minimumOrderAmount: number;
  maximumDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number; // Total times this coupon can be used
  usedCount: number;  // Times already used
  revenueGenerated: number;
  usagePerUser: number; // How many times one user can use it
  applicableCategories: mongoose.Types.ObjectId[];
  applicableProducts: mongoose.Types.ObjectId[];
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    percentageDiscount: { type: Number, min: 0, max: 100 },
    fixedDiscount: { type: Number, min: 0 },
    minimumOrderAmount: { type: Number, default: 0 },
    maximumDiscount: { type: Number },
    validFrom: { type: Date, required: true, default: Date.now },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 },
    usagePerUser: { type: Number, default: 1 },
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ isDeleted: 1 });
couponSchema.index({ validUntil: 1 });

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
