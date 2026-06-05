import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  verifiedPurchase: boolean;
  images: string[];
  likes: number;
  dislikes: number;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    verifiedPurchase: { type: Boolean, default: false },
    images: [{ type: String }],
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, isDeleted: 1 });
reviewSchema.index({ user: 1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
