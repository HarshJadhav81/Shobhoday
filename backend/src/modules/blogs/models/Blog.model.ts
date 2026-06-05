import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  tags: string[];
  featuredImage?: mongoose.Types.ObjectId;
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  publishedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'BlogCategory', required: true },
    tags: [{ type: String }],
    featuredImage: { type: Schema.Types.ObjectId, ref: 'Media' },
    seoTitle: { type: String },
    seoDescription: { type: String },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ category: 1 });

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
