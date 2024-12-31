// pages/verify-email.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      axios
        .post('/api/auth/verify-email', { token })
        .then(() => {
          alert('Email verified successfully!');
          router.push('/auth/sign-in');
        })
        .catch(() => {
          alert('Verification failed. Please try again.');
        });
    }
  }, [token]);

  return <div>Verifying...</div>;
}
