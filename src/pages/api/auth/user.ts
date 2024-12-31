import type { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User';
import connectToDatabase from '@/lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectToDatabase(); // Ensure database connection

      const userId = req.headers['authorization'];
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const user = await User.findById(userId).select('firstName lastName email');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
