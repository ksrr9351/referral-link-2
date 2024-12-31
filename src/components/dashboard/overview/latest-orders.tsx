// latest-orders.tsx

'use client'; // Marking this as a client-side component

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Interface for referral data
export interface Referral {
  firstName: string;
  lastName: string;
  email: string;
  date: Date;
  rewards: number;
}

// Props for the LatestOrders component
interface LatestOrdersProps {
  sx?: SxProps;
}

export const LatestOrders: React.FC<LatestOrdersProps> = ({ sx }) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const userId = sessionStorage.getItem('auth-session');
        if (!userId) {
          console.error('User not authenticated');
          return;
        }

        // Fetch referrals from the backend
        const response = await axios.get(`/api/referrals?userId=${userId}`);
        const { referrals: referralList } = response.data;

        // Set the state with the referral data
        setReferrals(referralList || []);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  if (loading) {
    return <Typography>Loading latest referrals...</Typography>;
  }

  return (
    <Card sx={sx}>
      <CardHeader title="Latest Referrals" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referrals.map((referral, index) => (
              <TableRow hover key={index}>
                <TableCell>{referral.firstName} {referral.lastName}</TableCell>
                <TableCell>{dayjs(referral.date).format('MMM D, YYYY')}</TableCell>
                <TableCell>{referral.rewards.toFixed(2)} $RWA</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};
