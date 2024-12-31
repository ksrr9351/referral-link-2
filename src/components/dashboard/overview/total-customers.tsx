'use client';  // Mark this file as a Client Component

import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDown as ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUp as ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import axios from 'axios';

export interface TotalCustomersProps {
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps;
  value: string;
}

export function TotalCustomers({ diff, trend, sx, value }: TotalCustomersProps): React.JSX.Element {
  const [referrals, setReferrals] = useState<number>(0); // State to store the number of referrals
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading state

  // Fetch referrals data when the component mounts
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const userId = sessionStorage.getItem('auth-session'); // Get user ID from session storage
        if (!userId) {
          console.error('User not authenticated');
          return;
        }

        // Fetch referral data from the API
        const response = await axios.get(`/api/referrals?userId=${userId}`);
        const { referrals: referralList } = response.data;  // Get referrals data from the response

        // Update the state with the number of referrals
        setReferrals(referralList.length);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      } finally {
        setLoading(false);  // Set loading state to false once the API call is done
      }
    };

    fetchReferrals();
  }, []); // Empty dependency array means this effect runs once on component mount

  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Total Referrals
              </Typography>
              <Typography variant="h4">{loading ? 'Loading...' : referrals}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
              <UsersIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          {diff ? (
            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
              <Stack sx={{ alignItems: 'center' }} direction="row" spacing={0.5}>
                <TrendIcon color={trendColor} fontSize="var(--icon-fontSize-md)" />
                <Typography color={trendColor} variant="body2">
                  {diff}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                Since last month
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
