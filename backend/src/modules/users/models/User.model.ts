import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  avatar?: string;
  roles: mongoose.Types.ObjectId[];
  accountStatus: 'active' | 'suspended' | 'banned' | 'pending';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  loginHistory: { ip: string; userAgent: string; loginAt: Date }[];
  lastLogin?: Date;
  loyaltyPoints: number;
  pointsHistory: { type: 'earned' | 'redeemed'; points: number; description: string; date: Date }[];
  totalOrders: number;
  totalSpent: number;
  preferredLanguage: string;
  preferredCurrency: string;
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, sparse: true, trim: true },
    password: { type: String, select: false },
    avatar: { type: String },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'banned', 'pending'],
      default: 'active',
    },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    loginHistory: [
      {
        ip: { type: String },
        userAgent: { type: String },
        loginAt: { type: Date, default: Date.now },
      },
    ],
    lastLogin: { type: Date },
    loyaltyPoints: { type: Number, default: 0 },
    pointsHistory: [
      {
        type: { type: String, enum: ['earned', 'redeemed'] },
        points: { type: Number },
        description: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    preferredLanguage: { type: String, default: 'en' },
    preferredCurrency: { type: String, default: 'INR' },
    googleId: { type: String, sparse: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ accountStatus: 1 });
userSchema.index({ isDeleted: 1 });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
