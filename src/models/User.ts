// models/User.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailVerified: boolean;
  referralLink: string;
  referredBy: string | null; // ID of the referring user
  rewards: number; // Reward balance
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  referralLink: { type: String, unique: true }, // Unique referral link
  referredBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // Referring user
  rewards: { type: Number, default: 0 }, // Reward points
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
