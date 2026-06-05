import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  addressType: 'billing' | 'shipping' | 'both';
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  gstNumber?: string;
  isDefault: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    addressType: { type: String, enum: ['billing', 'shipping', 'both'], default: 'both' },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    gstNumber: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

addressSchema.index({ user: 1 });
addressSchema.index({ isDefault: 1 });
addressSchema.index({ isDeleted: 1 });

export const Address = mongoose.model<IAddress>('Address', addressSchema);
