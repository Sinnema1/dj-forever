import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, REGISTER_USER } from '../features/auth/graphql/mutations';
import { AuthContextType, UserType } from '../features/users/types/userTypes';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [loginMutation] = useMutation(LOGIN_USER);
  const [registerMutation] = useMutation(REGISTER_USER);

  // Load from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('id_token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({ variables: { email, password } });

      const authToken = data?.loginUser?.token;
      const authUser  = data?.loginUser?.user;

      if (!authToken || !authUser) throw new Error('Invalid login response.');

      // DEBUG: log only email, never token
      if (import.meta.env.DEV) {
        console.debug('Login success for:', authUser.email);
      }

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('id_token', authToken);
      localStorage.setItem('user', JSON.stringify(authUser));
    } catch (err: unknown) {
      // No console.error here—UI will show the error.message
      if (err instanceof Error) throw new Error(err.message);
      throw new Error('Login failed.');
    }
  };

  const registerUser = async (fullName: string, email: string, password: string) => {
    try {
      const { data } = await registerMutation({
        variables: { fullName, email, password },
      });

      const authToken = data?.registerUser?.token;
      const authUser  = data?.registerUser?.user;

      if (!authToken || !authUser) throw new Error('Invalid registration response.');

      // DEBUG: log only email, never token
      if (import.meta.env.DEV) {
        console.debug('Registration success for:', authUser.email);
      }

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('id_token', authToken);
      localStorage.setItem('user', JSON.stringify(authUser));
    } catch (err: unknown) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error('Registration failed.');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(token),
        login,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};