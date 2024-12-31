// lib/auth/client.ts
import type { SignUpParams, SignInWithPasswordParams } from '@/types/user';
import type { User } from '@/types/user';

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const data = await response.json();
        return { error: data.error || 'Something went wrong' };
      }

      return {};
    } catch (error) {
      return { error: 'Something went wrong' };
    }
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string; userId?: string }> {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const data = await response.json();
        return { error: data.error || 'Something went wrong' };
      }

      // If login is successful, return user ID and store it in sessionStorage
      const data = await response.json();
      if (data.userId) {
        sessionStorage.setItem('auth-session', data.userId);
        return { userId: data.userId };
      }

      return {};
    } catch (error) {
      return { error: 'Something went wrong' };
    }
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      const token = sessionStorage.getItem('auth-session');
      
      if (!token) {
        return { data: null };
      }
  
      const response = await fetch('/api/auth/user', {
        method: 'GET',
        headers: { 'Authorization': token }
      });
  
      if (!response.ok) {
        const data = await response.json();
        return { error: data.error || 'Something went wrong' };
      }
  
      const data = await response.json();
      return { data: data.user };
    } catch (error) {
      return { error: 'Something went wrong' };
    }
  }  

  async signOut(): Promise<{ error?: string }> {
    try {
      sessionStorage.removeItem('auth-session');
      sessionStorage.removeItem('user'); // Optionally clear user data if stored
      return {};
    } catch (error) {
      return { error: 'Something went wrong' };
    }
  }

  async resetPassword(values: { email: string }): Promise<{ error?: string }> {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        const data = await response.json();
        return { error: data.error || 'An error occurred' };
      }
  
      return {}; // No error
    } catch (err) {
      console.error('Error resetting password:', err);
      return { error: 'An error occurred. Please try again later.' };
    }

  }
  async updatePasswordWithToken(newPassword: string, token: string): Promise<{ error?: string }> {
    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, token }),
      });
      if (!response.ok) throw new Error('Failed to update password.');
      return { error: undefined };
    } catch (error) {
      return { error: (error as Error).message || 'An unknown error occurred.' };
    }    
  }  
}

export const authClient = new AuthClient();
