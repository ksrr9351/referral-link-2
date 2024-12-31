'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { authClient } from '@/lib/auth/client'; // Import your authClient
import { User } from '@/types/user'; // Import the User type

export function AccountInfo(): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await authClient.getUser();
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setUser(data ?? null); // Use data or null if undefined
      setLoading(false);
    }

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={user?.avatar || '/assets/avatar.png'} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">
              {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user ? `${user.city ?? ''} ${user.country ?? ''}` : ''}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user ? user.timezone ?? '' : ''}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
