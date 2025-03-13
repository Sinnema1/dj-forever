import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, REGISTER_USER } from '../graphql/auth/mutations';
import { AuthContextType, UserType } from '../context/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Apollo Mutations
  const [loginMutation] = useMutation(LOGIN_USER);
  const [registerMutation] = useMutation(REGISTER_USER);

  // On mount: Check localStorage for existing login
  useEffect(() => {
    const storedToken = localStorage.getItem('id_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /**
   * Login Function
   * @param email
   * @param password
   */
  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      const token = data?.login?.token;
      const user = data?.login?.user;

      if (!token || !user) {
        throw new Error('Invalid login response.');
      }

      setToken(token);
      setUser(user);
      localStorage.setItem('id_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.message || 'Login failed.');
    }
  };

  /**
   * Register Function
   * @param fullName
   * @param email
   * @param password
   */
  const registerUser = async (fullName: string, email: string, password: string) => {
    try {
      const { data } = await registerMutation({
        variables: { fullName, email, password },
      });

      const token = data?.register?.token;
      const user = data?.register?.user;

      if (!token || !user) {
        throw new Error('Invalid registration response.');
      }

      setToken(token);
      setUser(user);
      localStorage.setItem('id_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed.');
    }
  };

  /**
   * Logout Function
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: !!token,
    login,
    registerUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
