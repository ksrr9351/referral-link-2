import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect'; // Utility for connecting to MongoDB
import User from '@/models/User'; // Mongoose model for users

// Connect to the database
dbConnect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const userId = req.query.userId as string; // Expecting the user ID to be passed in query

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // Find the user by their ID
      const user = await User.findById(userId).populate('referredBy'); // Populate referredBy to get the referring user

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Construct the referral link (based on the user's email)
      const referralLink = `http://localhost:3000/auth/sign-up?ref=${user.email}`;

      // Fetch all referrals associated with this user (referredBy is the user who referred them)
      const referrals = await User.find({ referredBy: user._id });

      // Calculate total referral rewards (sum of all referred users' rewards)
      const totalReferralRewards = referrals.reduce((sum, referral) => sum + referral.rewards, 0);

      // Prepare the response with referral link, list of referrals, and reward data
      const response = {
        referralLink,
        userRewards: user.rewards, // Rewards of the current user
        totalReferralRewards, // Total rewards from all referred users
        referrals: referrals.map((referral) => ({
          id: referral._id,
          firstName: referral.firstName,
          lastName: referral.lastName,
          email: referral.email,
          rewards: referral.rewards,
          referralLink: referral.referralLink,
          date: referral.createdAt,
        })),
      };

      // Send the response
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
