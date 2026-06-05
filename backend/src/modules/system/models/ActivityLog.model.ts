import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  user?: mongoose.Types.ObjectId;
  action: string;
  module: string;
  targetId?: mongoose.Types.ObjectId;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    module: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// We usually don't soft delete audit logs, they are immutable
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ module: 1, action: 1 });
activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
