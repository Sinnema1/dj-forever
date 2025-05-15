import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PublicRouteProps {
  // Only allow a single React element as the child
  children: ReactElement;
}

/**
 * PublicRoute will redirect authenticated users away
 * from pages like Login/Register into the dashboard.
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  // If the user is logged in, redirect to dashboard
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the child element
  return children;
};

export default PublicRoute;