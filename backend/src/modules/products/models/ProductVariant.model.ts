import mongoose, { Document, Schema } from 'mongoose';

export interface IProductVariant extends Document {
  product: mongoose.Types.ObjectId;
  sku: string;
  barcode?: string;
  color?: string;
  colorCode?: string;
  size?: string;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  media?: mongoose.Types.ObjectId[];
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  gstPercentage: number;
  status: 'active' | 'draft' | 'archived';
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const productVariantSchema = new Schema<IProductVariant>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true, unique: true, trim: true },
    barcode: { type: String, trim: true },
    color: { type: String, trim: true },
    colorCode: { type: String, trim: true }, // e.g., #FF0000
    size: { type: String, trim: true },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    media: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    gstPercentage: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

productVariantSchema.index({ sku: 1 });
productVariantSchema.index({ product: 1 });
productVariantSchema.index({ isDeleted: 1 });

export const ProductVariant = mongoose.model<IProductVariant>('ProductVariant', productVariantSchema);
