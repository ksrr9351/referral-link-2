'use client';

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Box,
  Chip,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  MonetizationOn as MoneyIcon,
  Group as GroupIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import axios from 'axios';

export default function ReferralPage(): React.JSX.Element {
  const [referrals, setReferrals] = useState<any[]>([]); // Store referral data
  const [referralLink, setReferralLink] = useState<string>(''); // Referral link
  const [userRewards, setUserRewards] = useState<number>(0); // Rewards for the current user
  const [totalReferralRewards, setTotalReferralRewards] = useState<number>(0); // Total rewards from referred users
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const userId = sessionStorage.getItem('auth-session');
        if (!userId) {
          console.error('User not authenticated');
          return;
        }

        const response = await axios.get(`/api/referrals?userId=${userId}`);
        const { referralLink, referrals, userRewards, totalReferralRewards } = response.data;

        setReferralLink(referralLink);
        setReferrals(referrals || []);
        setUserRewards(userRewards);
        setTotalReferralRewards(totalReferralRewards);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const commission = totalReferralRewards * 0.1; // Calculate commission (10%)

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=Join%20our%20platform%20and%20earn%20rewards!%20Use%20my%20referral%20link:%20${encodeURIComponent(
      referralLink
    )}`;
    window.open(twitterUrl, '_blank');
  };

  const copyToClipboard = () => navigator.clipboard.writeText(referralLink);

  if (loading) {
    return <Typography textAlign="center">Loading...</Typography>;
  }

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ padding: 3 }}>
      {/* Title */}
      <Grid item xs={12} lg={12}>
        <Typography variant="h4" textAlign="center">Referral Program</Typography>
      </Grid>

      {/* User Rewards */}
      <Grid item xs={12} lg={12}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MoneyIcon fontSize="large" color="success" />
            <Box>
              <Typography variant="h6">Your Rewards</Typography>
              <Typography variant="body1">${userRewards.toFixed(2)}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Referral Rewards */}
      <Grid item xs={12} lg={12}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MoneyIcon fontSize="large" color="primary" />
            <Box>
              <Typography variant="h6">Total Referral Rewards</Typography>
              <Typography variant="body1">${totalReferralRewards.toFixed(2)}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Your Commission */}
      <Grid item xs={12} lg={12}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MoneyIcon fontSize="large" color="secondary" />
            <Box>
              <Typography variant="h6">Your Commission (10%)</Typography>
              <Typography variant="body1">${commission.toFixed(2)}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Referrals */}
      <Grid item xs={12} lg={12}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <GroupIcon fontSize="large" color="primary" />
            <Box>
              <Typography variant="h6">Total Referrals</Typography>
              <Typography variant="body1">{referrals.length}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={12}>
        <Divider />
      </Grid>

      {/* Referral link */}
      <Grid item xs={12} lg={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Your Referral Link</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography
                variant="body1"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {referralLink}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ContentCopyIcon />}
                  onClick={copyToClipboard}
                >
                  Copy
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<TwitterIcon />}
                  onClick={shareOnTwitter}
                >
                  Share
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={12}>
        <Divider />
      </Grid>

      {/* Referral details */}
      <Grid item xs={12} lg={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Referral Details</Typography>
            <Grid container spacing={2}>
              {referrals.map((referral) => (
                <Grid item xs={12} key={referral.id}>
                  <Card variant="outlined">
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1">{referral.firstName} {referral.lastName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Joined: {dayjs(referral.date).format('MMM D, YYYY')}
                        </Typography>
                      </Box>
                      <Chip label={`Earnings: $${referral.rewards.toFixed(2)}`} color="success" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
