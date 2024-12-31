import mongoose, { Schema, model, models } from 'mongoose';

const ReferralSchema = new Schema({
  referredBy: {
    type: String,
    required: true,
  },
  referralLink: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  earnings: {
    type: Number,
    default: 0,
  },
});

const Referral = models.Referral || model('Referral', ReferralSchema);

export default Referral;
