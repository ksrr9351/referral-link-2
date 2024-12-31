'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

const schema = zod.object({
  password: zod.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: zod.string().min(6, { message: 'Confirm password must be at least 6 characters long' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type Values = zod.infer<typeof schema>;

const defaultValues = { password: '', confirmPassword: '' } satisfies Values;

const ResetPasswordForm = (): React.JSX.Element => {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [notification, setNotification] = React.useState<string | null>(null);
  const [generalError, setGeneralError] = React.useState<string | null>(null); // Added for server errors

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') : null; // Safely handle null value

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      if (!token) {
        setNotification('Invalid or missing token.');
        return;
      }

      setIsPending(true);

      const { error } = await authClient.updatePasswordWithToken(values.password, token);

      if (error) {
        setGeneralError(error); // Set general error message
        setIsPending(false);
        return;
      }

      setNotification('Password successfully updated!');
      setIsPending(false);

      setTimeout(() => {
        router.push('/auth/sign-in');
      }, 3000);
    },
    [setError, token, router]
  );

  if (!token) {
    // Display a message or redirect if token is not present
    return (
      <Typography variant="h6" color="error">
        Token is missing or invalid.
      </Typography>
    );
  }

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Reset Password</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormControl error={Boolean(errors.confirmPassword)}>
                <InputLabel>Confirm Password</InputLabel>
                <OutlinedInput {...field} label="Confirm Password" type="password" />
                {errors.confirmPassword && <FormHelperText>{errors.confirmPassword.message}</FormHelperText>}
              </FormControl>
            )}
          />
          {generalError && <Alert color="error">{generalError}</Alert>} {/* Display general error */}
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? 'Loading...' : 'Reset Password'}
          </Button>
        </Stack>
      </form>
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          aria-live="polite"
        >
          {notification}
        </div>
      )}
    </Stack>
  );
};

export default ResetPasswordForm;
