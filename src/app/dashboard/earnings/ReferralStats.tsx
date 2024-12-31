import * as React from 'react';
import { Stack, Typography } from '@mui/material';

interface ReferralStatsProps {
  totalReferrals: number;
  totalRewards: number;
}

export function ReferralStats({ totalReferrals, totalRewards }: ReferralStatsProps): React.JSX.Element {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Referral Stats</Typography>
      <Typography variant="body1">Total Referrals: {totalReferrals}</Typography>
      <Typography variant="body1">Total Rewards Earned: ${totalRewards.toFixed(2)}</Typography>
    </Stack>
  );
}
