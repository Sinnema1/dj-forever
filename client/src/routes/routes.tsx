import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout
import AppLayout from '../components/layout/AppLayout';

// Public pages
import Home from '../pages/Home';
import ErrorPage from '../pages/Error';

// Features
import Login from '../features/auth/components/Login';
import Register from '../features/auth/components/Register';
import Profile from '../features/users/pages/Profile';
import RSVP from '../features/rsvp/pages/RSVP';

// Dashboard
import Dashboard from '../features/dashboard/pages/Dashboard';

// Components
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

/**
 * AppRoutes defines all routes and applies the AppLayout as a wrapper.
 */
const AppRoutes = () => {
  const { user, isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public: only for NOT logged-in */}
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Home is always visible */}
        <Route index element={<Home />} />

        {/* Protected: must be logged in */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              {/* RSVP guard: if not RSVPed, force to /rsvp */}
              {user?.hasRSVPed ? (
                <Dashboard />
              ) : (
                <Navigate to="/rsvp" replace />
              )}
            </PrivateRoute>
          }
        />

        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="rsvp"
          element={
            <PrivateRoute>
              {/* If already RSVPed, bounce to dashboard */}
              {user?.hasRSVPed ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RSVP />
              )}
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;