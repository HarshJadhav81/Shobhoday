import mongoose, { Document, Schema } from 'mongoose';

export interface IStoreLocation extends Document {
  name: string;
  type: 'warehouse' | 'retail_store' | 'franchise';
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const storeLocationSchema = new Schema<IStoreLocation>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['warehouse', 'retail_store', 'franchise'], required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

storeLocationSchema.index({ type: 1 });
storeLocationSchema.index({ isDeleted: 1 });

export const StoreLocation = mongoose.model<IStoreLocation>('StoreLocation', storeLocationSchema);
