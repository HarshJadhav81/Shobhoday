import mongoose, { Document, Schema } from 'mongoose';

export interface IReturnRequest extends Document {
  order: mongoose.Types.ObjectId;
  orderItem: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  reason: string;
  condition: string;
  status: 'pending' | 'approved' | 'rejected' | 'received' | 'refunded';
  adminComment?: string;
  refundAmount?: number;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const returnRequestSchema = new Schema<IReturnRequest>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    orderItem: { type: Schema.Types.ObjectId, ref: 'OrderItem', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    condition: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'received', 'refunded'],
      default: 'pending',
    },
    adminComment: { type: String },
    refundAmount: { type: Number },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

returnRequestSchema.index({ order: 1 });
returnRequestSchema.index({ status: 1 });
returnRequestSchema.index({ isDeleted: 1 });

export const ReturnRequest = mongoose.model<IReturnRequest>('ReturnRequest', returnRequestSchema);
