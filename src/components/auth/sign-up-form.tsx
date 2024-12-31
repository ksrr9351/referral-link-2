'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // useSearchParams for query params in App Router
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FormControlLabel from '@mui/material/FormControlLabel'; // Import missing FormControlLabel
import Checkbox from '@mui/material/Checkbox'; // Import missing Checkbox component
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the validation schema using Zod
const schema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
  terms: zod.boolean().refine((value) => value, 'You must accept the terms and conditions'),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  terms: false,
};

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams(); // useSearchParams hook to get query parameters
  const [referralCode, setReferralCode] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const { control, handleSubmit, setError, formState: { errors } } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  // Capture referral code from the URL using useSearchParams
  React.useEffect(() => {
    if (searchParams) { // Check if searchParams is not null
      const ref = searchParams.get('ref'); // get the 'ref' query parameter
      if (ref) {
        setReferralCode(ref);
      }
    }
  }, [searchParams]);

  const onSubmit = async (values: Values): Promise<void> => {
    setIsPending(true);

    try {
      // You need to implement your own API request here (or replace it with your logic)
      // Example using fetch, axios, or any client-side API:
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          ...values,
          referralId: referralCode, // Add referral code to the request
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        setError('root', { type: 'server', message: result.error });
        toast.error(result.error || 'Something went wrong', { position: "top-center" });
        setIsPending(false);
        return;
      }

      toast.success('User created successfully. Please check your email for verification.', {
        position: "top-center",
      });

      // Add any post-signup logic (e.g., redirect, session refresh, etc.)
      // router.push('/some-success-page');
    } catch (error) {
      toast.error('Something went wrong. Please try again later.', { position: "top-center" });
      setIsPending(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign up</Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{' '}
          <Link href="/auth/sign-in" underline="hover" variant="subtitle2">
            Sign in
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.firstName)}>
                <InputLabel>First name</InputLabel>
                <OutlinedInput {...field} label="First name" />
                {errors.firstName && <FormHelperText>{errors.firstName.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.lastName)}>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput {...field} label="Last name" />
                {errors.lastName && <FormHelperText>{errors.lastName.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
              </FormControl>
            )}
          />
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
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label="I have read the terms and conditions"
                />
                {errors.terms && <FormHelperText error>{errors.terms.message}</FormHelperText>}
              </div>
            )}
          />
          {errors.root && <Alert color="error">{errors.root.message}</Alert>}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign up
          </Button>
        </Stack>
      </form>
      <ToastContainer />
    </Stack>
  );
}
