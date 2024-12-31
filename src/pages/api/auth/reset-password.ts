// pages/api/auth/reset-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/new';
const JWT_SECRET = process.env.JWT_SECRET || '123456p';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Database connection
async function connectToDatabase() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(MONGO_URI);
  }
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', // Replace with your SMTP host
  port: 465,
  secure: true,
  auth: {
    user: 'hello@codetechnolabs.com', // Replace with your email
    pass: 'Singh@#6249', // Replace with your email password or app password
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await connectToDatabase();

    const { email } = req.body;

    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate a reset token
      const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

      // Create reset link
      const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;

      // Send recovery email
      const mailOptions = {
        from: 'hello@codetechnolabs.com', // Your email
        to: email,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <p><a href="${resetLink}">Reset Password</a></p>
               <p>This link is valid for 1 hour.</p>`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
      console.error('Error sending reset email:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
