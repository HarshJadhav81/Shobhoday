import mongoose, { Document, Schema } from 'mongoose';

export interface IWebhookEvent extends Document {
  eventId: string;
  gateway: 'razorpay' | 'stripe';
  type: string;
  processed: boolean;
  eventData: Record<string, any>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const webhookEventSchema = new Schema<IWebhookEvent>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    gateway: { type: String, enum: ['razorpay', 'stripe'], required: true },
    type: { type: String, required: true },
    processed: { type: Boolean, default: false },
    eventData: { type: Schema.Types.Mixed, required: true },
    error: { type: String }
  },
  { timestamps: true }
);

export const WebhookEvent = mongoose.model<IWebhookEvent>('WebhookEvent', webhookEventSchema);
