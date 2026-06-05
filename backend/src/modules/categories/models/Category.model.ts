import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  parent?: mongoose.Types.ObjectId;
  description?: string;
  thumbnailMedia?: mongoose.Types.ObjectId;
  bannerMedia?: mongoose.Types.ObjectId;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    description: { type: String, trim: true },
    thumbnailMedia: { type: Schema.Types.ObjectId, ref: 'Media' },
    bannerMedia: { type: Schema.Types.ObjectId, ref: 'Media' },
    seoTitle: { type: String },
    seoDescription: { type: String },
    views: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isDeleted: 1 });
categorySchema.index({ isActive: 1 });

export const Category = mongoose.model<ICategory>('Category', categorySchema);
