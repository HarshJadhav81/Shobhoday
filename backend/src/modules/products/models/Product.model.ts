import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  shortDescription?: string;
  longDescription?: string;
  brand?: string;
  category: mongoose.Types.ObjectId;
  subCategory?: mongoose.Types.ObjectId;
  gender?: 'men' | 'women' | 'unisex' | 'kids';
  ageGroup?: string;
  material?: string;
  fabricType?: string;
  fitType?: string;
  careInstructions?: string;
  countryOfOrigin?: string;
  manufacturer?: string;
  tags: string[];
  media?: mongoose.Types.ObjectId[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  views: number;
  clicks: number;
  featured: boolean;
  trending: boolean;
  bestseller: boolean;
  newArrival: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, trim: true },
    longDescription: { type: String },
    brand: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
    gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'] },
    ageGroup: { type: String },
    material: { type: String },
    fabricType: { type: String },
    fitType: { type: String },
    careInstructions: { type: String },
    countryOfOrigin: { type: String },
    manufacturer: { type: String },
    tags: [{ type: String, trim: true }],
    media: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
    canonicalUrl: { type: String },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ isDeleted: 1 });
productSchema.index({ isActive: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
