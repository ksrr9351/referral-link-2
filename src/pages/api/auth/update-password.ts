// pages/api/auth/update-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/new';
const JWT_SECRET = process.env.JWT_SECRET || '123456p';

async function connectToDatabase() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(MONGO_URI);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await connectToDatabase();

    const { token, newPassword } = req.body;

    // Validate input
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string };

      // Find the user
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ error: 'Invalid token or user not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
