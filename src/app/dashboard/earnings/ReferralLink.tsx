'use client'; // Esto convierte el archivo a un Client Component
import * as React from 'react';
import { Button, Stack, TextField,Typography, InputAdornment, IconButton } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';

interface ReferralLinkProps {
  referralLink: string;
}

export function ReferralLink({ referralLink }: ReferralLinkProps): React.JSX.Element {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      alert('Referral link copied to clipboard!');
    });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Your Referral Link</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          value={referralLink}
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
            startAdornment: <InputAdornment position="start">https://</InputAdornment>,
          }}
        />
        <IconButton onClick={handleCopyClick}>
          <ContentCopyIcon />
        </IconButton>
      </Stack>
      <Button variant="contained" onClick={handleCopyClick}>Copy Link</Button>
    </Stack>
  );
}
