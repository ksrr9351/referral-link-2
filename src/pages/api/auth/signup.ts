// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/new';
const JWT_SECRET = process.env.JWT_SECRET || '123456p';
const BASE_URL = 'http://localhost:3000';

async function connectToDatabase() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(MONGO_URI);
  }
}

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'hello@codetechnolabs.com',
    pass: 'Singh@#6249',
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await connectToDatabase();

    const { firstName, lastName, email, password, referralId } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create a new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        emailVerified: false,
        referralLink: `${BASE_URL}/auth/sign-up?ref=${email}`, // Generate referral link
      });

      // Handle referral
      if (referralId) {
        const referringUser = await User.findOne({ email: referralId }); // Use the email as the referral ID
        if (referringUser) {
          newUser.referredBy = referringUser._id; // Set referredBy to the referring user's ID
          referringUser.rewards += 5; // Add $5 reward to referrer
          await referringUser.save(); // Save the updated referring user's rewards

          // Add reward to the new user (for signing up with a referral)
          newUser.rewards += 1; // New user gets 1 reward for signing up with a referral
        }
      }

      // Save the new user
      await newUser.save();

      // Generate a verification token
      const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

      // Send verification email
      const verificationLink = `${BASE_URL}/verify-email?token=${verificationToken}`;
      const mailOptions = {
        from: 'hello@codetechnolabs.com',
        to: email,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking the link below:</p><p><a href="${verificationLink}">Verify Email</a></p>`,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ message: 'User created successfully. Please check your email for verification.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
