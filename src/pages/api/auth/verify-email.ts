// pages/api/auth/verify-email.ts
import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '123456p';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token } = req.body;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string };

      const user = await User.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update the user document to mark email as verified
      user.emailVerified = true;
      await user.save();

      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Invalid or expired token' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
