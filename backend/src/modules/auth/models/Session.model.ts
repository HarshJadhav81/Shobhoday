import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  user: mongoose.Types.ObjectId;
  refreshToken: string;
  ip: string;
  userAgent: string;
  expiresAt: Date;
  isValid: boolean;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    refreshToken: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isValid: { type: Boolean, default: true },
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

sessionSchema.index({ user: 1 });
sessionSchema.index({ refreshToken: 1 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);
