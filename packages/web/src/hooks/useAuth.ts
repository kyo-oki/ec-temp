import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { SIGN_UP, SIGN_IN, GET_ME } from '../lib/graphql/queries';
import { SignUpInput, SignInInput, AuthPayload, User } from '../lib/graphql/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      // You could verify the token here or fetch user data
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const [signUpMutation] = useMutation<{ signUp: AuthPayload }>(SIGN_UP);
  const [signInMutation] = useMutation<{ signIn: AuthPayload }>(SIGN_IN);

  const signUp = async (input: SignUpInput) => {
    try {
      const { data } = await signUpMutation({ variables: { input } });
      if (data?.signUp) {
        localStorage.setItem('auth-token', data.signUp.access_token);
        setUser(data.signUp.user);
        return { success: true, user: data.signUp.user };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  const signIn = async (input: SignInInput) => {
    try {
      const { data } = await signInMutation({ variables: { input } });
      if (data?.signIn) {
        localStorage.setItem('auth-token', data.signIn.access_token);
        setUser(data.signIn.user);
        return { success: true, user: data.signIn.user };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = () => {
    localStorage.removeItem('auth-token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated,
  };
};
