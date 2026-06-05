import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  variant: mongoose.Types.ObjectId;
  warehouseLocation: 'Pune' | 'Mumbai' | 'Delhi';
  availableStock: number;
  reservedStock: number;
  damagedStock: number;
  returnedStock: number;
  reorderLevel: number;
  auditLog: { stockAdded?: number; stockRemoved?: number; reason: string; date: Date; changedBy: mongoose.Types.ObjectId }[];
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    variant: { type: Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
    warehouseLocation: { type: String, enum: ['Pune', 'Mumbai', 'Delhi'], required: true },
    availableStock: { type: Number, required: true, min: 0, default: 0 },
    reservedStock: { type: Number, default: 0, min: 0 },
    damagedStock: { type: Number, default: 0, min: 0 },
    returnedStock: { type: Number, default: 0, min: 0 },
    reorderLevel: { type: Number, default: 5, min: 0 },
    auditLog: [
      {
        stockAdded: { type: Number },
        stockRemoved: { type: Number },
        reason: { type: String, required: true },
        date: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

// Compound index to ensure one inventory record per variant per warehouse
inventorySchema.index({ variant: 1, warehouseLocation: 1 }, { unique: true });
inventorySchema.index({ isDeleted: 1 });

export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
