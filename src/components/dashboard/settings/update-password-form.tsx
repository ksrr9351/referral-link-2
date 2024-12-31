'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function UpdatePasswordForm(): React.JSX.Element {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const authSession = sessionStorage.getItem('auth-session'); // Retrieve auth-session from sessionStorage
    if (!authSession) {
      setError('Authentication session is missing.');
      return;
    }

    try {
      const response = await fetch('/api/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          userId: authSession, // Include the auth-session as userId
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update password');
        return;
      }

      setSuccessMessage('Password updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Update your password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={4} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Confirm Password</InputLabel>
              <OutlinedInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            {error && <Typography color="error">{error}</Typography>}
            {successMessage && <Typography color="success.main">{successMessage}</Typography>}
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}