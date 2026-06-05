import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  user: mongoose.Types.ObjectId;
  action: string;
  module: string;
  ip: string;
  details: string;
  timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    module: { type: String, required: true },
    ip: { type: String, required: true },
    details: { type: String },
    timestamp: { type: Date, default: Date.now },
  }
);

activityLogSchema.index({ user: 1 });
activityLogSchema.index({ module: 1 });
activityLogSchema.index({ action: 1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
