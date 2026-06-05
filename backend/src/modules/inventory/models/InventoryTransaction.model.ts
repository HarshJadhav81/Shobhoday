import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryTransaction extends Document {
  variantId: mongoose.Types.ObjectId;
  warehouseId?: mongoose.Types.ObjectId; // Optional if global, but required for specific locations
  type: 'stock_in' | 'stock_out' | 'reserve' | 'release' | 'return' | 'damage' | 'adjustment';
  quantity: number;
  beforeQty: number;
  afterQty: number;
  referenceType: 'order' | 'return' | 'manual' | 'adjustment';
  referenceId?: mongoose.Types.ObjectId;
  changedBy: mongoose.Types.ObjectId; // User ID
  notes?: string;
  createdAt: Date;
}

const inventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    variantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
    warehouseId: { type: Schema.Types.ObjectId },
    type: {
      type: String,
      enum: ['stock_in', 'stock_out', 'reserve', 'release', 'return', 'damage', 'adjustment'],
      required: true,
    },
    quantity: { type: Number, required: true },
    beforeQty: { type: Number, required: true },
    afterQty: { type: Number, required: true },
    referenceType: {
      type: String,
      enum: ['order', 'return', 'manual', 'adjustment'],
      required: true,
    },
    referenceId: { type: Schema.Types.ObjectId },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

inventoryTransactionSchema.index({ variantId: 1, createdAt: -1 });
inventoryTransactionSchema.index({ referenceId: 1, referenceType: 1 });

export const InventoryTransaction = mongoose.model<IInventoryTransaction>('InventoryTransaction', inventoryTransactionSchema);
