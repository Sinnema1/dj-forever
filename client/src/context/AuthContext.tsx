import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, REGISTER_USER } from '../features/auth/graphql/mutations';
import { AuthContextType, UserType } from '../features/users/types/userTypes';

// Create context with the AuthContextType
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Apollo Mutations for login and register
  const [loginMutation] = useMutation(LOGIN_USER);
  const [registerMutation] = useMutation(REGISTER_USER);

  // On component mount: load token and user from localStorage (if available)
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
   * @param email User's email
   * @param password User's password
   */
  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      const authToken: string = data?.loginUser?.token;
      const authUser: UserType = data?.loginUser?.user;

      if (!authToken || !authUser) {
        throw new Error('Invalid login response.');
      }

      // Optional: warn if isInvited is missing from the response
      if (authUser.isInvited === undefined) {
        console.warn('Warning: isInvited field is missing from the login response.');
      }

      // Update state and localStorage
      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('id_token', authToken);
      localStorage.setItem('user', JSON.stringify(authUser));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Login failed.');
      }
      throw new Error('Login failed.');
    }
  };

  /**
   * Register Function
   * @param fullName User's full name
   * @param email User's email
   * @param password User's password
   */
  const registerUser = async (fullName: string, email: string, password: string) => {
    try {
      const { data } = await registerMutation({
        variables: { fullName, email, password },
      });

      // Expecting the mutation to return a token and a user object with isInvited
      const authToken: string = data?.register?.token;
      const authUser: UserType = data?.register?.user;

      if (!authToken || !authUser) {
        throw new Error('Invalid registration response.');
      }

      // Optional: warn if isInvited is missing from the response
      if (authUser.isInvited === undefined) {
        console.warn('Warning: isInvited field is missing from the registration response.');
      }

      // Update state and localStorage
      setToken(authToken);
      setUser(authUser);
      localStorage.setItem('id_token', authToken);
      localStorage.setItem('user', JSON.stringify(authUser));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Registration failed.');
      }
      throw new Error('Registration failed.');
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

  // Context value exposed to consumers
  const value: AuthContextType = {
    user,
    isLoggedIn: !!token,
    login,
    registerUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth hook for consuming AuthContext
 * Throws an error if used outside the AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
