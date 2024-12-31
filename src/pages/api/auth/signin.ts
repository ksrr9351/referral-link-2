// pages/api/auth/signin.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/new';

async function connectToDatabase() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(MONGO_URI);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await connectToDatabase();

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.emailVerified) {
        return res.status(403).json({ error: 'Email not verified' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Send a success response
      res.status(200).json({ message: 'Signed in successfully', userId: user.id });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}