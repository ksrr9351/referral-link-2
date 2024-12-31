export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/referrals',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    earnings: '/dashboard/earnings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;