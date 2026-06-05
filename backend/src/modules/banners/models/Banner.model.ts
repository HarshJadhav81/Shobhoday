import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  media: mongoose.Types.ObjectId;
  mobileMedia?: mongoose.Types.ObjectId;
  link?: string;
  position: 'hero' | 'category' | 'footer' | 'popup';
  sortOrder: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String },
    media: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
    mobileMedia: { type: Schema.Types.ObjectId, ref: 'Media' },
    link: { type: String },
    position: { type: String, enum: ['hero', 'category', 'footer', 'popup'], required: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

bannerSchema.index({ position: 1, isActive: 1 });
bannerSchema.index({ sortOrder: 1 });

export const Banner = mongoose.model<IBanner>('Banner', bannerSchema);
