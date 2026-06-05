import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  publicId: string;
  url: string;
  secureUrl: string;
  folder: 'products' | 'variants' | 'categories' | 'banners' | 'blogs' | 'users';
  mediaType: string;
  width?: number;
  height?: number;
  size: number;
  altText?: string;
  uploadedBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    folder: {
      type: String,
      enum: ['products', 'variants', 'categories', 'banners', 'blogs', 'users'],
      required: true,
      index: true
    },
    mediaType: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    size: { type: Number, required: true },
    altText: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ isDeleted: 1 });

export const Media = mongoose.model<IMedia>('Media', mediaSchema);
