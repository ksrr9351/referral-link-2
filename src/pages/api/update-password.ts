import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, userId } = req.body;

  if (!password || !userId) {
    return res.status(400).json({ error: 'Password and userId are required' });
  }

  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
