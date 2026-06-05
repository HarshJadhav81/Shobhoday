import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  module: string;
  action: string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true, unique: true, trim: true }, // e.g., 'read:products'
    module: { type: String, required: true, trim: true },             // e.g., 'products'
    action: { type: String, required: true, trim: true },             // e.g., 'read'
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

permissionSchema.index({ module: 1, action: 1 });
permissionSchema.index({ isDeleted: 1 });

export const Permission = mongoose.model<IPermission>('Permission', permissionSchema);
